import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const bets = await prisma.bet.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return NextResponse.json(bets)
}