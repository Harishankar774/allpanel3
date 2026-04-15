import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdmin(): Promise<
  | { ok: true; email: string }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!(session.user as { isAdmin?: boolean }).isAdmin) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, email: session.user.email };
}
