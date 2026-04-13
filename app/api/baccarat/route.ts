import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function cardValue(card: number) {
  if (card >= 10) return 0
  return card
}

function handTotal(cards: number[]) {
  return cards.reduce((sum, c) => sum + cardValue(c), 0) % 10
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { betOn, amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const deck = Array.from({length:52}, (_,i) => (i%13)+1)
  const shuffled = deck.sort(() => Math.random()-0.5)

  const playerCards = [shuffled[0], shuffled[2]]
  const bankerCards = [shuffled[1], shuffled[3]]

  const playerTotal = handTotal(playerCards)
  const bankerTotal = handTotal(bankerCards)

  let winner = playerTotal > bankerTotal ? 'player' : playerTotal < bankerTotal ? 'banker' : 'tie'
  let isWin = betOn === winner
  let multiplier = betOn === 'tie' ? 8 : 1
  let winAmount = isWin ? amount * multiplier : -amount
  if (betOn === 'banker' && isWin) winAmount = Math.floor(amount * 0.95)

  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({ playerCards, bankerCards, playerTotal, bankerTotal, winner, betOn, result: isWin ? 'win' : 'loss', winAmount, newBalance })
}