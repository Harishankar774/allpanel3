import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

  const { type, amount, method } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (type === "WITHDRAWAL" && user.balance < amount)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  await prisma.transaction.create({
    data: { userId: user.id, type, amount, method, status: "PENDING" },
  });

  return NextResponse.json({ success: true, message: `${type} request submitted` });
}
