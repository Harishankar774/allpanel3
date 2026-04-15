import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/require-admin'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const bets = await prisma.bet.findMany({
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const weatherBets = await prisma.weatherBet.findMany({
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ bets, weatherBets })
}