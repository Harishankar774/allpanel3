import { crashEngine } from '@/lib/crash-engine'

export async function GET() {
  const encoder = new TextEncoder()
  let interval: NodeJS.Timeout | null = null
  let isClosed = false

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        // Pehle check karo — controller band hai kya
        if (isClosed) {
          if (interval) clearInterval(interval)
          return
        }
        try {
          const payload = JSON.stringify(crashEngine.getState())
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
        } catch {
          // Controller band ho gaya — timer band karo
          isClosed = true
          if (interval) clearInterval(interval)
        }
      }

      send()
      interval = setInterval(send, 500)
    },

    cancel() {
      // User ne page chhoda — sab band karo
      isClosed = true
      if (interval) clearInterval(interval)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}