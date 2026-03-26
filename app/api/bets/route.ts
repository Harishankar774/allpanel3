import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bets = await prisma.bet.findMany({
    where: { userId: user.id },
    include: { match: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ bets });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { matchId, team, betType, amount, odds } = await req.json();
  if (!matchId || !team || !amount || !odds)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.balance < amount)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  const potential = parseFloat((amount * odds).toFixed(2));

  const [bet] = await prisma.$transaction([
    prisma.bet.create({
      data: { userId: user.id, matchId, team, betType, amount, odds, potential, status: "PENDING" },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amount }, exposure: { increment: amount } },
    }),
    prisma.transaction.create({
      data: { userId: user.id, type: "BET_PLACED", amount: -amount, status: "SUCCESS" },
    }),
  ]);

  return NextResponse.json({ success: true, bet, newBalance: user.balance - amount });
}
