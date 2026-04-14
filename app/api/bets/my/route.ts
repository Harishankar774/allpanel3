import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const bets = await prisma.bet.findMany({
    where: { userId: user.id },
    include: {
      match: {
        select: { name: true, sport: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(bets)
}