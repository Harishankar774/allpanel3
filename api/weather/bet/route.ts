import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { city, betType, prediction, amount } = await request.json();

  if (!city || !betType || !prediction || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Deduct amount from balance
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: user.balance - amount },
    });

    // Create weather bet
    const weatherBet = await prisma.weatherBet.create({
      data: {
        userId: user.id,
        city,
        betType,
        prediction,
        amount,
      },
    });

    return NextResponse.json(weatherBet);
  } catch (error) {
    console.error('Error placing weather bet:', error);
    return NextResponse.json({ error: 'Failed to place bet' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bets = await prisma.weatherBet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bets);
  } catch (error) {
    console.error('Error fetching weather bets:', error);
    return NextResponse.json({ error: 'Failed to fetch bets' }, { status: 500 });
  }
}