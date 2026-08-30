import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TicketPriority } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const policies = await prisma.slaPolicy.findMany({
    where: session.role === "ADMIN" ? {} : { ownerId: session.userId },
    include: { escalations: true, owner: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ policies });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, priority, responseTimeMinutes, resolutionTimeMinutes, escalations = [] } = await req.json();

  if (!name || !priority || !responseTimeMinutes || !resolutionTimeMinutes) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const validPriorities: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  if (!validPriorities.includes(priority)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }

  const policy = await prisma.slaPolicy.create({
    data: {
      name,
      priority,
      responseTimeMinutes,
      resolutionTimeMinutes,
      ownerId: session.userId,
      escalations: {
        create: escalations.map((e: any) => ({
          afterMinutes: e.afterMinutes,
          action: e.action,
          targetRoleId: e.targetRoleId,
          targetTeamId: e.targetTeamId,
        })),
      },
    },
    include: { escalations: true },
  });

  wsServer.broadcast("sla", { type: "sla:policy:created", payload: { policy } });

  return NextResponse.json({ policy }, { status: 201 });
}
