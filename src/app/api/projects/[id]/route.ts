import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [
        { id: id },
        { key: id },
      ],
    },
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

  try {
    // Delete associated child dependencies safely
    await prisma.activity.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.timeLog.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.ticket.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.taskDependency.deleteMany({ where: { task: { projectId: id } } }).catch(() => {});
    await prisma.task.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.taskList.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.milestone.deleteMany({ where: { projectId: id } }).catch(() => {});
    await prisma.projectMember.deleteMany({ where: { projectId: id } }).catch(() => {});

    await prisma.project.delete({ where: { id } }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true, warning: err.message });
  }
}
