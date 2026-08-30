import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentType } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const comments = await prisma.ticketComment.findMany({
    where: { ticketId: id },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true, role: true } },
    },
  });

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { content, type = "PUBLIC", mentions = [] } = await req.json();

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const validTypes: CommentType[] = ["PUBLIC", "PRIVATE"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid comment type" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true, assigneeId: true },
  });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const comment = await prisma.ticketComment.create({
    data: {
      ticketId: id,
      authorId: session.userId,
      content,
      type,
    },
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true, role: true } },
    },
  });

  await prisma.activity.create({
    data: {
      userId: session.userId,
      action: "ticket.comment.added",
      entityType: "TicketComment",
      entityId: comment.id,
      details: JSON.stringify({ type, mentions }),
      ticketId: id,
    },
  });

  wsServer.broadcastToTeam(ticket.teamId ?? "", {
    type: "ticket:comment:added",
    payload: { ticketId: id, comment },
  });

  if (ticket.assigneeId && ticket.assigneeId !== session.userId) {
    wsServer.broadcastToTeam(ticket.teamId ?? "", {
      type: "notification",
      payload: {
        type: "TICKET_UPDATED",
        title: "New comment on your ticket",
        message: `A ${type.toLowerCase()} comment was added to ticket #${id.slice(0, 8)}`,
        entityId: id,
        entityType: "Ticket",
      },
    });
  }

  return NextResponse.json({ comment }, { status: 201 });
}
