import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { settleMatchBets } from "@/lib/settlement";
import { settleBulkSchema, settleCandidatesQuerySchema, settleMatchSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  const { searchParams } = new URL(req.url);
  const parsed = settleCandidatesQuerySchema.safeParse({
    sport: searchParams.get("sport") || undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  const { sport, limit = 100 } = parsed.data;

  const matches = await prisma.match.findMany({
    where: {
      startTime: { lte: new Date() },
      status: { not: "SETTLED" },
      bets: { some: { status: "PENDING" } },
      ...(sport && sport !== "ALL" ? { sport } : {}),
    },
    include: {
      bets: {
        where: { status: "PENDING" },
        select: { id: true, team: true, amount: true },
      },
    },
    orderBy: { startTime: "desc" },
    take: limit,
  });

  const candidates = matches.map((m) => ({
    id: m.id,
    name: m.name,
    teamA: m.teamA,
    teamB: m.teamB,
    sport: m.sport,
    startTime: m.startTime,
    pendingBets: m.bets.length,
    pendingAmount: m.bets.reduce((acc, b) => acc + b.amount, 0),
  }));

  return NextResponse.json({ candidates });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const body = await req.json();
  const bulk = settleBulkSchema.safeParse(body);
  if (bulk.success) {
    const limit = bulk.data.limit ?? 30;
    const eligible = await prisma.match.findMany({
      where: {
        startTime: { lte: new Date() },
        status: { not: "SETTLED" },
        bets: { some: { status: "PENDING" } },
        ...(bulk.data.sport && bulk.data.sport !== "ALL" ? { sport: bulk.data.sport } : {}),
      },
      select: { id: true },
      orderBy: { startTime: "desc" },
      take: limit,
    });
    const outcomes = [];
    for (const m of eligible) {
      const result = await settleMatchBets(m.id, bulk.data.winner);
      outcomes.push({ matchId: m.id, ...result });
    }
    return NextResponse.json({ success: true, bulk: true, settledMatches: outcomes.length, outcomes });
  }

  const parsed = settleMatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { matchId, winner } = parsed.data;
  const result = await settleMatchBets(matchId, winner);
  return NextResponse.json({ success: true, ...result });
}
