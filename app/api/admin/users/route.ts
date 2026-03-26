import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      isActive: true,
      isAdmin: true,
      createdAt: true,
    }
  })
  return NextResponse.json(users)
}