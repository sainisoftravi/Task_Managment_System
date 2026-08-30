import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectKey = new URL(req.url).searchParams.get("key");
  if (projectKey) {
    const project = await prisma.project.findUnique({
      where: { key: projectKey },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        team: true,
        milestones: { include: { taskLists: true } },
        taskLists: { include: { tasks: { include: { subtasks: true, dependencies: true, dependents: true } } } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
            taskList: true,
            subtasks: true,
            dependencies: { include: { dependsOn: true } },
            dependents: { include: { task: true } },
          },
        },
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true, role: true } } } },
        tickets: true,
        _count: { select: { tasks: true, milestones: true, timeLogs: true } },
      },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const where = id ? { id } : {};
  const projects = await prisma.project.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      team: true,
      _count: { select: { tasks: true, milestones: true, timeLogs: true } },
    },
  });

  return NextResponse.json({ projects });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, status, startDate, dueDate, teamId } = body;

  const project = await prisma.project.update({
    where: { id },
    data: { name, description, status, startDate: startDate ? new Date(startDate) : undefined, dueDate: dueDate ? new Date(dueDate) : undefined, teamId: teamId || undefined },
  });

  wsServer.broadcast(`project:${id}`, {
    type: "project:updated",
    payload: { project },
  });

  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
