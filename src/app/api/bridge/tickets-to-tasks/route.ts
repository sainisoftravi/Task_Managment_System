import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketId, projectId, title, description, priority = "MEDIUM", assigneeId } = await req.json();

  if (!ticketId || !projectId) {
    return NextResponse.json({ error: "ticketId and projectId required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { team: true },
  });

  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const taskList = await prisma.taskList.findFirst({ where: { projectId } });

  const task = await prisma.task.create({
    data: {
      projectId,
      title: title || ticket.title,
      description: description || ticket.description,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      assigneeId: assigneeId || undefined,
      taskListId: taskList?.id ?? await getDefaultTaskList(projectId),
      convertedFromTicketId: ticketId,
    },
    include: { project: { select: { id: true, name: true, key: true } } },
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { convertedTaskId: task.id },
  });

  await prisma.activity.createMany({
    data: [
      {
        userId: session.userId,
        action: "ticket.converted_to_task",
        entityType: "Ticket",
        entityId: ticketId,
        details: JSON.stringify({ taskId: task.id }),
        ticketId,
        projectId,
      },
      {
        userId: session.userId,
        action: "task.created_from_ticket",
        entityType: "Task",
        entityId: task.id,
        details: JSON.stringify({ ticketId }),
        taskId: task.id,
        projectId,
      },
    ],
  });

  wsServer.broadcast(`project:${projectId}`, {
    type: "task:created",
    payload: { task, fromTicket: ticketId },
  });
  wsServer.broadcastToTeam(ticket.teamId ?? "", {
    type: "ticket:converted",
    payload: { ticketId, taskId: task.id },
  });

  return NextResponse.json({ ticket, task }, { status: 201 });
}

async function getDefaultTaskList(projectId: string): Promise<string> {
  const list = await prisma.taskList.findFirst({ where: { projectId } });
  if (list) return list.id;
  const newList = await prisma.taskList.create({
    data: { projectId, name: "Backlog", sortOrder: 0 },
  });
  return newList.id;
}

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get("ticketId");
  const taskId = searchParams.get("taskId");

  if (ticketId) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { convertedTaskId: true },
    });
    if (ticket?.convertedTaskId) {
      const task = await prisma.task.findUnique({
        where: { id: ticket.convertedTaskId },
        include: { project: { select: { id: true, name: true, key: true } } },
      });
      return NextResponse.json({ task });
    }
    return NextResponse.json({ task: null });
  }

  if (taskId) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { convertedFromTicketId: true },
    });
    if (task?.convertedFromTicketId) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: task.convertedFromTicketId },
      });
      return NextResponse.json({ ticket });
    }
    return NextResponse.json({ ticket: null });
  }

  return NextResponse.json({ error: "Must provide ticketId or taskId" }, { status: 400 });
}
