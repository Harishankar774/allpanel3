import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { prediction, amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const dice = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1)
  const total = dice.reduce((a, b) => a + b, 0)
  const isEven = total % 2 === 0
  const actualResult = isEven ? 'even' : 'odd'
  const isWin = prediction === actualResult

  const winAmount = isWin ? amount : -amount
  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({ dice, total, prediction, actualResult, result: isWin ? 'win' : 'loss', winAmount, newBalance })
}