import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { crashEngine } from "@/lib/crash-engine";
import { crashActionSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(crashEngine.getState());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = crashActionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { action } = parsed.data;
  const email = session.user.email;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "bet") {
    const amount = parsed.data.amount;
    if (!crashEngine.canPlaceBet(user.id))
      return NextResponse.json({ error: "Cannot place bet in this round" }, { status: 400 });
    if (user.balance < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      });
    } catch {
      return NextResponse.json({ error: "Could not place bet" }, { status: 500 });
    }

    const placed = crashEngine.placeBet(user.id, amount);
    if (!placed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount } },
      });
      return NextResponse.json({ error: "Cannot place bet in this round" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Bet placed!" });
  }

  if (action === "cashout") {
    const payout = crashEngine.cashout(user.id);
    if (!payout.ok) return NextResponse.json({ error: "Cannot cashout" }, { status: 400 });

    const winAmount = payout.amount * payout.multiplier;

    await prisma.user.update({
      where: { id: user.id },
      data: { balance: { increment: winAmount } },
    });
    return NextResponse.json({ success: true, winAmount: winAmount.toFixed(2) });
  }

  if (action === "start") {
    if (!crashEngine.startRound()) return NextResponse.json({ error: "Cannot start now" }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
