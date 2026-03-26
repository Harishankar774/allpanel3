import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") || "Cricket";

  const matches = await prisma.match.findMany({
    where: { sport },
    orderBy: [{ isLive: "desc" }, { startTime: "asc" }],
  });

  return NextResponse.json({ matches });
}
