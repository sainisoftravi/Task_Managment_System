import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, email: true, name: true, role: true, avatar: true, teamId: true },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "ADMIN" && session.role !== "MANAGER") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { email, name, role, teamId } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.update({
    where: { email },
    data: { name, role: role || "AGENT", teamId: teamId || undefined },
    select: { id: true, email: true, name: true, role: true, teamId: true },
  });

  return NextResponse.json({ user });
}
