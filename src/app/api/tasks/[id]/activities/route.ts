import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const activities = await prisma.activity.findMany({
    where: { taskId: id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json({ activities });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { action, text, details } = body;

  const task = await prisma.task.findUnique({
    where: { id },
    select: { id: true, projectId: true, title: true },
  });

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const activity = await prisma.activity.create({
    data: {
      userId: session.userId,
      taskId: id,
      projectId: task.projectId,
      entityType: "Task",
      entityId: id,
      action: action || "task.commented",
      details: details || JSON.stringify({ text: text || "" }),
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  wsServer.broadcast(`project:${task.projectId}`, {
    type: "task:commented",
    payload: { taskId: id, activity },
  });

  return NextResponse.json({ activity });
}
