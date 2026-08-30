import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TaskStatus, TaskPriority, DependencyType } from "@/types";
import { wsServer } from "@/lib/websocket-server";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const assigneeId = searchParams.get("assigneeId");
  const status = searchParams.get("status") as TaskStatus | null;
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const includeDeps = searchParams.get("includeDeps") === "true";
  const includeSubtasks = searchParams.get("includeSubtasks") === "true";

  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const include: any = {
    assignee: { select: { id: true, name: true, email: true, avatar: true } },
    project: { select: { id: true, name: true, key: true } },
    taskList: true,
    _count: { select: { subtasks: true, timeLogs: true, dependencies: true, dependents: true } },
  };

  if (includeDeps) {
    include.dependencies = { include: { dependsOn: true } };
    include.dependents = { include: { task: true } };
  }

  if (includeSubtasks) {
    include.subtasks = { include: { assignee: { select: { id: true, name: true, avatar: true } } } };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include,
    }),
    prisma.task.count({ where }),
  ]);

  return NextResponse.json({
    tasks,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    projectId,
    title,
    description,
    status = "TODO",
    priority = "MEDIUM",
    assigneeId,
    taskListId,
    parentTaskId,
    estimatedHours,
    dueDate,
    startDate,
  } = await req.json();

  if (!projectId || !title) {
    return NextResponse.json({ error: "projectId and title required" }, { status: 400 });
  }

  const validStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const validPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  if (!validPriorities.includes(priority)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status,
      priority,
      assigneeId,
      taskListId: taskListId || (await getDefaultTaskList(projectId)),
      parentTaskId: parentTaskId || undefined,
      estimatedHours: estimatedHours ?? undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
    },
    include: {
      assignee: true,
      project: true,
      dependencies: { include: { dependsOn: true } },
    },
  });

  await prisma.activity.create({
    data: {
      userId: session.userId,
      action: "task.created",
      entityType: "Task",
      entityId: task.id,
      details: JSON.stringify({ title, priority, status }),
      taskId: task.id,
      projectId,
    },
  });

  wsServer.broadcast(`project:${projectId}`, {
    type: "task:created",
    payload: { task },
  });

  return NextResponse.json({ task }, { status: 201 });
}

async function getDefaultTaskList(projectId: string): Promise<string> {
  const list = await prisma.taskList.findFirst({ where: { projectId } });
  if (list) return list.id;
  const newList = await prisma.taskList.create({
    data: { projectId, name: "Backlog", sortOrder: 0 },
  });
  return newList.id;
}
