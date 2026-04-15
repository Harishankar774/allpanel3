import { prisma } from "@/lib/prisma";

type SettleResult = {
  updatedBets: number;
  winners: number;
  losers: number;
  refunded: number;
};

function deriveOutcome(betType: string, team: string, winner: string): "WON" | "LOST" | "REFUND" {
  if (winner === "CANCELLED") return "REFUND";
  if (betType === "oddsDraw" || betType === "oddsDraw2") return winner === "Draw" ? "WON" : "LOST";
  return team === winner ? "WON" : "LOST";
}

export async function settleMatchBets(matchId: string, winner: string): Promise<SettleResult> {
  return prisma.$transaction(async (tx) => {
    const bets = await tx.bet.findMany({
      where: { matchId, status: "PENDING" },
      include: { user: true, match: true },
    });

    let winners = 0;
    let losers = 0;
    let refunded = 0;

    for (const bet of bets) {
      const outcome = deriveOutcome(bet.betType, bet.team, winner);

      if (outcome === "WON") {
        winners += 1;
        await tx.bet.update({
          where: { id: bet.id },
          data: { status: "WON" },
        });
        await tx.user.update({
          where: { id: bet.userId },
          data: {
            balance: { increment: bet.potential },
            exposure: { decrement: bet.amount },
          },
        });
        await tx.transaction.create({
          data: {
            userId: bet.userId,
            type: "BET_SETTLED_WIN",
            amount: bet.potential,
            status: "SUCCESS",
            reference: `match:${matchId}`,
          },
        });
      } else if (outcome === "REFUND") {
        refunded += 1;
        await tx.bet.update({
          where: { id: bet.id },
          data: { status: "CANCELLED" },
        });
        await tx.user.update({
          where: { id: bet.userId },
          data: {
            balance: { increment: bet.amount },
            exposure: { decrement: bet.amount },
          },
        });
        await tx.transaction.create({
          data: {
            userId: bet.userId,
            type: "BET_REFUND",
            amount: bet.amount,
            status: "SUCCESS",
            reference: `match:${matchId}`,
          },
        });
      } else {
        losers += 1;
        await tx.bet.update({
          where: { id: bet.id },
          data: { status: "LOST" },
        });
        await tx.user.update({
          where: { id: bet.userId },
          data: {
            exposure: { decrement: bet.amount },
          },
        });
      }
    }

    await tx.match.update({
      where: { id: matchId },
      data: { status: "SETTLED" },
    });

    return { updatedBets: bets.length, winners, losers, refunded };
  });
}
