import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, company: true, phone: true, avatar: true },
  });

  return NextResponse.json({ customers });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, company, phone } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const customer = await prisma.customer.create({
    data: { name, email, company, phone },
  });

  return NextResponse.json({ customer }, { status: 201 });
}
