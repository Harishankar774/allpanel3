import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const walletRequestSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL"]),
  amount: z.number().positive().finite(),
  method: z.string().trim().min(2).max(30).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { balance: true, exposure: true },
  });
  const transactions = await prisma.transaction.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ balance: user?.balance || 0, exposure: user?.exposure || 0, transactions });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = walletRequestSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { type, amount, method } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (type === "WITHDRAWAL" && user.balance < amount)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  await prisma.transaction.create({
    data: { userId: user.id, type, amount, method, status: "PENDING" },
  });

  return NextResponse.json({ success: true, message: `${type} request submitted` });
}
