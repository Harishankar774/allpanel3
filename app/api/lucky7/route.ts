import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { betType, amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const card1 = Math.floor(Math.random() * 13) + 1
  const card2 = Math.floor(Math.random() * 13) + 1
  const total = card1 + card2

  let isWin = false
  let multiplier = 1

  if (betType === 'under7') { isWin = total < 7; multiplier = 2 }
  else if (betType === 'over7') { isWin = total > 7; multiplier = 2 }
  else if (betType === 'lucky7') { isWin = total === 7; multiplier = 4 }

  const winAmount = isWin ? amount * multiplier : -amount
  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({ card1, card2, total, betType, result: isWin ? 'win' : 'loss', winAmount, newBalance })
}