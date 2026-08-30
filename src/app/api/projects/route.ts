import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateProjectKey } from "@/lib/utils";
import { wsServer } from "@/lib/websocket-server";

type ProjectStatusType = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ProjectStatusType | null;

  const where: any = {};
  if (status) where.status = status;

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      team: { select: { id: true, name: true } },
      _count: {
        select: { tasks: true, milestones: true, timeLogs: true },
      },
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, startDate, dueDate, teamId } = await req.json();

  if (!name || !startDate) {
    return NextResponse.json({ error: "Name and startDate required" }, { status: 400 });
  }

  const key = generateProjectKey(name);

  const project = await prisma.project.create({
    data: {
      name,
      key,
      description,
      startDate: new Date(startDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      ownerId: session.userId,
      teamId: teamId || session.teamId || undefined,
      members: {
        create: {
          userId: session.userId,
          role: "OWNER",
        },
      },
    },
    include: {
      owner: true,
      team: true,
      members: { include: { user: true } },
    },
  });

  wsServer.broadcastToTeam(project.teamId ?? "", {
    type: "project:created",
    payload: { project },
  });

  return NextResponse.json({ project }, { status: 201 });
}
