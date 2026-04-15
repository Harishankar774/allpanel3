import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/require-admin'
import { adminBalanceSchema } from '@/lib/validation'

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const parsed = adminBalanceSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const { email, amount, type } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (type === 'subtract' && user.balance < amount)
    return NextResponse.json({ error: 'Balance would go negative' }, { status: 400 })

  const newBalance = type === 'add'
    ? user.balance + amount
    : user.balance - amount

  await prisma.user.update({
    where: { email },
    data: { balance: newBalance }
  })
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'ADMIN_BALANCE_ADJUSTMENT',
      amount: type === 'add' ? amount : -amount,
      status: 'SUCCESS',
      method: 'ADMIN_PANEL',
      reference: `by:${admin.email}`,
    }
  })

  return NextResponse.json({ message: `Balance updated! New balance: ₹${newBalance}` })
}