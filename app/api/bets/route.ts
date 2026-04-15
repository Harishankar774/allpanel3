import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import type { Match } from "@prisma/client";
import { placeBetSchema } from "@/lib/validation";

function expectedOdds(m: Match, betType: string): number | null {
  switch (betType) {
    case "oddsA":
      return m.oddsA;
    case "oddsALay":
      return m.oddsALay;
    case "oddsB":
      return m.oddsB;
    case "oddsBLay":
      return m.oddsBLay;
    case "oddsDraw":
    case "oddsDraw2":
      return m.oddsDraw;
    default:
      return null;
  }
}

function teamValid(m: Match, betType: string, team: string): boolean {
  if (betType === "oddsDraw" || betType === "oddsDraw2") return team === "Draw";
  if (betType.startsWith("oddsA")) return team === m.teamA;
  if (betType.startsWith("oddsB")) return team === m.teamB;
  return false;
}

function oddsMatch(server: number | null, client: number): boolean {
  if (server === null || server === undefined) return false;
  return Math.abs(server - client) < 0.02;
}

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

  let body: { matchId?: string; team?: string; betType?: string; amount?: number; odds?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = placeBetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { matchId, team, betType, amount, odds } = parsed.data;
  const stake = amount;
  const clientOdds = odds;

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
  if (match.isLocked)
    return NextResponse.json({ error: "Match is locked" }, { status: 400 });

  if (!teamValid(match, betType, team))
    return NextResponse.json({ error: "Team does not match selection" }, { status: 400 });

  const serverOdds = expectedOdds(match, betType);
  if (serverOdds === null || !oddsMatch(serverOdds, clientOdds)) {
    return NextResponse.json({ error: "Odds have changed — refresh and try again" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.balance < stake)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  const potential = parseFloat((stake * clientOdds).toFixed(2));

  try {
    const result = await prisma.$transaction(async (tx) => {
      const u = await tx.user.findUnique({ where: { id: user.id } });
      if (!u || u.balance < stake) throw new Error("INSUFFICIENT");
      const bet = await tx.bet.create({
        data: {
          userId: user.id,
          matchId,
          team,
          betType,
          amount: stake,
          odds: clientOdds,
          potential,
          status: "PENDING",
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: stake }, exposure: { increment: stake } },
      });
      await tx.transaction.create({
        data: { userId: user.id, type: "BET_PLACED", amount: -stake, status: "SUCCESS" },
      });
      const updated = await tx.user.findUnique({
        where: { id: user.id },
        select: { balance: true },
      });
      return { bet, newBalance: updated?.balance ?? u.balance - stake };
    });

    return NextResponse.json({ success: true, bet: result.bet, newBalance: result.newBalance });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INSUFFICIENT") {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }
    throw e;
  }
}
