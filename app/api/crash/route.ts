import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

let currentMultiplier = 1.0
let gameStatus = 'waiting' // waiting, running, crashed
let crashPoint = 1.0
let players: { userId: string; amount: number; cashedOut: boolean; cashOutAt?: number }[] = []

function generateCrashPoint() {
  const r = Math.random()
  if (r < 0.01) return 1.0
  return Math.max(1.0, (1 / (1 - r)) * 0.97)
}

export async function GET() {
  return NextResponse.json({ multiplier: currentMultiplier, status: gameStatus, players: players.length })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { action, amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (action === 'bet') {
    if (gameStatus !== 'waiting') return NextResponse.json({ error: 'Game already running' }, { status: 400 })
    if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    await prisma.user.update({ where: { id: user.id }, data: { balance: user.balance - amount } })
    players.push({ userId: user.id, amount, cashedOut: false })
    return NextResponse.json({ success: true, message: 'Bet placed!' })
  }

  if (action === 'cashout') {
    const player = players.find(p => p.userId === user.id)
    if (!player || player.cashedOut) return NextResponse.json({ error: 'Cannot cashout' }, { status: 400 })
    if (gameStatus !== 'running') return NextResponse.json({ error: 'Game not running' }, { status: 400 })
    const winAmount = player.amount * currentMultiplier
    player.cashedOut = true
    player.cashOutAt = currentMultiplier
    await prisma.user.update({ where: { id: user.id }, data: { balance: user.balance + winAmount } })
    return NextResponse.json({ success: true, winAmount: winAmount.toFixed(2) })
  }

  if (action === 'start') {
    gameStatus = 'running'
    crashPoint = generateCrashPoint()
    currentMultiplier = 1.0
    const interval = setInterval(() => {
      currentMultiplier = parseFloat((currentMultiplier + 0.01).toFixed(2))
      if (currentMultiplier >= crashPoint) {
        gameStatus = 'crashed'
        clearInterval(interval)
        setTimeout(() => {
          gameStatus = 'waiting'
          players = []
          currentMultiplier = 1.0
        }, 3000)
      }
    }, 100)
    return NextResponse.json({ success: true, crashPoint })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}