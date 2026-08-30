import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { team: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

import { getSession } from "@/lib/auth";
