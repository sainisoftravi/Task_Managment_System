import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TicketPriority, TicketStatus } from "@/types";
import { wsServer } from "@/lib/websocket-server";

const PAGE_SIZE = 25;

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const status = searchParams.get("status") as TicketStatus | null;
  const priority = searchParams.get("priority") as TicketPriority | null;
  const assigneeId = searchParams.get("assigneeId");
  const search = searchParams.get("search");
  const teamId = searchParams.get("teamId");
  const categoryId = searchParams.get("categoryId");

  const where: any = {};

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assigneeId) where.assigneeId = assigneeId;
  if (categoryId) where.category = categoryId;
  if (teamId) where.teamId = teamId;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        author: { select: { id: true, name: true, email: true } },
        customer: { select: { id: true, name: true, company: true, email: true } },
        team: { select: { id: true, name: true } },
        comments: {
          where: { type: "PRIVATE" },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { id: true, content: true, createdAt: true, author: { select: { id: true, name: true } } },
        },
        kbArticles: {
          include: { article: true },
        },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return NextResponse.json({
    tickets,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    title,
    description,
    priority = "MEDIUM",
    status = "OPEN",
    category,
    source = "WEB",
    customerId,
    assigneeId,
    teamId,
    projectId,
    dueDate,
  } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const validPriorities: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const validStatuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED"];

  if (!validPriorities.includes(priority)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { calculateSLA } = await import("@/lib/utils");
  const { slaDueAt, slaBreached } = calculateSLA(new Date(), priority, 60, 240);

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      priority,
      status,
      category,
      source,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      customerId: customerId || undefined,
      assigneeId: assigneeId || session.userId,
      authorId: session.userId,
      teamId: teamId || session.teamId || undefined,
      projectId: projectId || undefined,
      slaDueAt: slaDueAt,
      slaBreached: slaBreached,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      customer: true,
      team: { select: { id: true, name: true } },
    },
  });

  await prisma.activity.create({
    data: {
      userId: session.userId,
      action: "ticket.created",
      entityType: "Ticket",
      entityId: ticket.id,
      details: JSON.stringify({ title, priority, status }),
      ticketId: ticket.id,
    },
  });

  const { generateTicketKey } = await import("@/lib/utils");
  wsServer.broadcastToTeam(ticket.teamId ?? "", {
    type: "ticket:created",
    payload: { ticket: { ...ticket, key: generateTicketKey(ticket.id) } },
  });

  return NextResponse.json({ ticket }, { status: 201 });
}
