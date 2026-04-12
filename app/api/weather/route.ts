import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const icao = searchParams.get('icao') || 'VIDP'

  try {
    const res = await fetch(
      `https://api.checkwx.com/metar/${icao}/decoded`,
      {
        headers: {
          'X-API-Key': process.env.CHECKWX_API_KEY || ''
        }
      }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}