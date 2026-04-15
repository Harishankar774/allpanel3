import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { auditQuerySchema } from "@/lib/validation";

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(req.url);
  const parsed = auditQuerySchema.safeParse({
    type: searchParams.get("type") || undefined,
    user: searchParams.get("user") || undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query params" }, { status: 400 });

  const { type = "ALL", user, limit = 50, from, to } = parsed.data;
  const createdAtFilter: { gte?: Date; lte?: Date } = {};
  if (from) createdAtFilter.gte = new Date(from);
  if (to) createdAtFilter.lte = new Date(to);

  const items = await prisma.transaction.findMany({
    where: {
      type: type === "ALL" ? { in: ["ADMIN_BALANCE_ADJUSTMENT", "BET_SETTLED_WIN", "BET_REFUND"] } : type,
      ...(from || to ? { createdAt: createdAtFilter } : {}),
      ...(user
        ? {
            user: {
              OR: [{ email: { contains: user, mode: "insensitive" } }, { name: { contains: user, mode: "insensitive" } }],
            },
          }
        : {}),
    },
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ items });
}
