import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DependencyType } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  const where: any = {};
  if (taskId) {
    where.OR = [
      { taskId: taskId },
      { dependsOnTaskId: taskId },
    ];
  }

  const dependencies = await prisma.taskDependency.findMany({
    where,
    include: {
      task: { select: { id: true, title: true, status: true, projectId: true } },
      dependsOn: { select: { id: true, title: true, status: true, projectId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ dependencies });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, dependsOnTaskId, type = "FINISH_TO_START" } = await req.json();

  if (!taskId || !dependsOnTaskId) {
    return NextResponse.json({ error: "taskId and dependsOnTaskId required" }, { status: 400 });
  }

  if (taskId === dependsOnTaskId) {
    return NextResponse.json({ error: "Task cannot depend on itself" }, { status: 400 });
  }

  const validTypes: DependencyType[] = ["FINISH_TO_START", "START_TO_START", "FINISH_TO_FINISH", "START_TO_FINISH"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid dependency type" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  });

  const dependsOn = await prisma.task.findUnique({
    where: { id: dependsOnTaskId },
    select: { projectId: true },
  });

  if (!task || !dependsOn) {
    return NextResponse.json({ error: "Task(s) not found" }, { status: 404 });
  }

  if (task.projectId !== dependsOn.projectId) {
    return NextResponse.json({ error: "Both tasks must be in the same project" }, { status: 400 });
  }

  const circularCheck = await checkCircularDependency(taskId, dependsOnTaskId);
  if (circularCheck) {
    return NextResponse.json({ error: "This would create a circular dependency" }, { status: 400 });
  }

  try {
    const dependency = await prisma.taskDependency.create({
      data: { taskId, dependsOnTaskId, type },
      include: {
        task: { select: { id: true, title: true } },
        dependsOn: { select: { id: true, title: true } },
      },
    });

    wsServer.broadcast(`project:${task.projectId}`, {
      type: "task:dependency:added",
      payload: { dependency },
    });

    return NextResponse.json({ dependency }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dependency already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  const dependsOnTaskId = searchParams.get("dependsOnTaskId");
  const id = searchParams.get("id");

  if (id) {
    await prisma.taskDependency.delete({ where: { id } });
  } else if (taskId && dependsOnTaskId) {
    await prisma.taskDependency.deleteMany({ where: { taskId, dependsOnTaskId } });
  } else {
    return NextResponse.json({ error: "Must provide id or taskId+dependsOnTaskId" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

async function checkCircularDependency(taskId: string, dependsOnTaskId: string): Promise<boolean> {
  const visited = new Set<string>();
  const stack = [dependsOnTaskId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === taskId) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const children = await prisma.taskDependency.findMany({
      where: { taskId: current },
      select: { dependsOnTaskId: true },
    });

    children.forEach((c) => stack.push(c.dependsOnTaskId));
  }

  return false;
}
