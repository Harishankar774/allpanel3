import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, amount, type } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const newBalance = type === 'add' 
    ? user.balance + amount 
    : user.balance - amount

  await prisma.user.update({
    where: { email },
    data: { balance: newBalance }
  })

  return NextResponse.json({ message: `Balance updated! New balance: ₹${newBalance}` })
}