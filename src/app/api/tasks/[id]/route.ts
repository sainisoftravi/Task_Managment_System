import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TaskStatus, TaskPriority } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      project: { select: { id: true, name: true, key: true } },
      taskList: { include: { milestone: true } },
      parentTask: { select: { id: true, title: true } },
      subtasks: { include: { assignee: { select: { id: true, name: true } } } },
      dependencies: {
        include: {
          dependsOn: {
            include: {
              assignee: true,
              project: { select: { id: true, name: true } },
            },
          },
        },
      },
      dependents: {
        include: {
          task: {
            include: {
              assignee: true,
              project: { select: { id: true, name: true } },
            },
          },
        },
      },
      timeLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
      activities: { orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true } } } },
    },
  });

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json();
  const {
    title,
    description,
    status,
    priority,
    assigneeId,
    taskListId,
    estimatedHours,
    loggedHours,
    dueDate,
    startDate,
  } = body;

  const data: any = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (assigneeId !== undefined) data.assigneeId = assigneeId;
  if (taskListId !== undefined) data.taskListId = taskListId;
  if (estimatedHours !== undefined) data.estimatedHours = parseFloat(estimatedHours);
  if (loggedHours !== undefined) data.loggedHours = parseFloat(loggedHours);
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
  if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;

  if (status !== undefined) {
    const valid: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }

  if (priority !== undefined) {
    const valid: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (!valid.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    data.priority = priority;
  }

  const task = await prisma.task.update({
    where: { id },
    data,
  });

  await prisma.activity.create({
    data: {
      userId: session.userId,
      action: "task.updated",
      entityType: "Task",
      entityId: task.id,
      details: JSON.stringify({ changes: data }),
      taskId: task.id,
      projectId: task.projectId,
    },
  });

  wsServer.broadcast(`project:${task.projectId}`, {
    type: "task:updated",
    payload: { taskId: id, changes: data },
  });

  if (task.assigneeId) {
    wsServer.broadcast(`user:${task.assigneeId}`, {
      type: "task:assigned",
      payload: { taskId: id },
    });
  }

  return NextResponse.json({ task });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id }, select: { projectId: true } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  await prisma.task.delete({ where: { id } });

  wsServer.broadcast(`project:${task.projectId}`, {
    type: "task:deleted",
    payload: { taskId: id },
  });

  return NextResponse.json({ success: true });
}
