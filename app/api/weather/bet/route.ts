import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { city, betType, prediction, amount } = await req.json()

  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  await prisma.user.update({ where: { id: user.id }, data: { balance: user.balance - amount } })

  const bet = await prisma.weatherBet.create({
    data: { userId: user.id, city, betType, prediction, amount, status: 'pending' }
  })

  return NextResponse.json(bet)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  const bets = await prisma.weatherBet.findMany({ where: { userId: user?.id } })

  return NextResponse.json(bets)
}