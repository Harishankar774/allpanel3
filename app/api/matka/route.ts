import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { number, amount } = await req.json()
  if (number < 0 || number > 9) return NextResponse.json({ error: 'Number must be 0-9' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const winningNumber = Math.floor(Math.random() * 10)
  const isWin = number === winningNumber
  const winAmount = isWin ? amount * 9 : -amount
  const newBalance = user.balance + winAmount

  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({ winningNumber, yourNumber: number, result: isWin ? 'win' : 'loss', winAmount, newBalance })
}