import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { betType, betValue, amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const spinResult = Math.floor(Math.random() * 37)
  const isRed = redNumbers.includes(spinResult)
  const isEven = spinResult !== 0 && spinResult % 2 === 0

  let isWin = false
  let multiplier = 1

  if (betType === 'number') {
    isWin = parseInt(betValue) === spinResult
    multiplier = 35
  } else if (betType === 'color') {
    isWin = betValue === 'red' ? isRed : !isRed && spinResult !== 0
    multiplier = 1
  } else if (betType === 'evenodd') {
    isWin = betValue === 'even' ? isEven : !isEven && spinResult !== 0
    multiplier = 1
  } else if (betType === 'half') {
    isWin = betValue === 'low' ? spinResult >= 1 && spinResult <= 18 : spinResult >= 19 && spinResult <= 36
    multiplier = 1
  }

  const winAmount = isWin ? amount * multiplier : -amount
  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({
    spinResult, isRed, isEven,
    betType, betValue,
    result: isWin ? 'win' : 'loss',
    winAmount, newBalance
  })
}