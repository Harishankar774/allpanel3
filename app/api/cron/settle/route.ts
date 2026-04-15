import { NextRequest, NextResponse } from "next/server";
import { settleMatchBets } from "@/lib/settlement";
import { settleMatchSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = settleMatchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { matchId, winner } = parsed.data;
  const result = await settleMatchBets(matchId, winner);
  return NextResponse.json({ success: true, ...result });
}
