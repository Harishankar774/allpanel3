import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/require-admin'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

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