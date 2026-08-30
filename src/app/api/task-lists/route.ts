import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const where: any = {};
  if (projectId) where.projectId = projectId;

  const taskLists = await prisma.taskList.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      project: true,
      milestone: true,
      tasks: {
        orderBy: { createdAt: "desc" },
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          dependencies: { include: { dependsOn: true } },
          subtasks: { select: { id: true, title: true, status: true, _count: { select: { timeLogs: true } } } },
        },
      },
    },
  });

  return NextResponse.json({ taskLists });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, name, milestoneId } = await req.json();

  if (!projectId || !name) {
    return NextResponse.json({ error: "projectId and name required" }, { status: 400 });
  }

  const maxOrder = await prisma.taskList.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });

  const taskList = await prisma.taskList.create({
    data: {
      projectId,
      name,
      milestoneId: milestoneId || undefined,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json({ taskList }, { status: 201 });
}
