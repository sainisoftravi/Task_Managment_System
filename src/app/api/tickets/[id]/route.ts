import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TicketPriority, TicketStatus } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      author: { select: { id: true, name: true, email: true } },
      customer: true,
      team: true,
      project: { select: { id: true, name: true, key: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, avatar: true, role: true } } },
      },
      kbArticles: {
        include: { article: true },
      },
      timeLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
      convertedTask: {
        include: { project: true, assignee: true },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const {
    title,
    description,
    priority,
    status,
    category,
    assigneeId,
    dueDate,
    slaDueAt,
    slaBreached,
  } = body;

  const data: any = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (category !== undefined) data.category = category;
  if (assigneeId !== undefined) data.assigneeId = assigneeId;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

  if (priority !== undefined) {
    const valid: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (!valid.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    data.priority = priority;
  }

  if (status !== undefined) {
    const valid: TicketStatus[] = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;

    if (status === "RESOLVED") {
      data.resolvedAt = new Date();
    }
    if (status === "CLOSED" && !data.closedAt) {
      data.closedAt = new Date();
    }
  }

  if (slaDueAt !== undefined) data.slaDueAt = slaDueAt ? new Date(slaDueAt) : null;
  if (slaBreached !== undefined) data.slaBreached = slaBreached;

  const oldTicket = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true, assigneeId: true },
  });

  const ticket = await prisma.ticket.update({
    where: { id },
    data,
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      comments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  await prisma.activity.create({
    data: {
      userId: session.userId,
      action: "ticket.updated",
      entityType: "Ticket",
      entityId: ticket.id,
      details: JSON.stringify({ changes: data }),
      ticketId: ticket.id,
    },
  });

  wsServer.broadcastToTeam(oldTicket?.teamId ?? "", {
    type: "ticket:updated",
    payload: { ticketId: id, changes: data },
  });

  return NextResponse.json({ ticket });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true },
  });
  if (!existing) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  await prisma.ticket.delete({ where: { id } });

  wsServer.broadcastToTeam(existing?.teamId ?? "", {
    type: "ticket:deleted",
    payload: { ticketId: id },
  });

  return NextResponse.json({ success: true });
}
