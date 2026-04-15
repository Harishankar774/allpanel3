import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    const { name, email, phone, password, referralCode } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Email or phone already registered" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        referredBy: referralCode || null,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
