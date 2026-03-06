import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode: refCode } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Find referrer if referral code provided
    let referredById: string | undefined;
    if (refCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: refCode },
        select: { id: true },
      });
      if (referrer) referredById = referrer.id;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        referralCode,
        ...(referredById && { referredById }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
