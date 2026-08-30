import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BillableType } from "@/types";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const projectFilter = searchParams.get("projectId");

  const where: any = { userId: session.userId };
  if (start && end) {
    where.logDate = { gte: new Date(start), lte: new Date(end) };
  }
  if (projectFilter) where.projectId = projectFilter;

  const timeLogs = await prisma.timeLog.findMany({
    where,
    orderBy: { logDate: "desc" },
    include: {
      task: { select: { id: true, title: true, project: true } },
      ticket: { select: { id: true, title: true } },
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ timeLogs });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { taskId, ticketId, durationMinutes, billableType = "BILLABLE", description, logDate } = await req.json();

  if (!durationMinutes || durationMinutes <= 0) {
    return NextResponse.json({ error: "Valid durationMinutes required" }, { status: 400 });
  }

  const validBillable: BillableType[] = ["BILLABLE", "NON_BILLABLE"];
  if (!validBillable.includes(billableType)) {
    return NextResponse.json({ error: "Invalid billableType" }, { status: 400 });
  }

  const timeLog = await prisma.timeLog.create({
    data: {
      userId: session.userId,
      taskId: taskId || undefined,
      ticketId: ticketId || undefined,
      projectId: undefined,
      durationMinutes,
      billableType,
      description,
      logDate: logDate ? new Date(logDate) : new Date(),
    },
    include: {
      task: { select: { id: true, title: true } },
      ticket: { select: { id: true, title: true } },
    },
  });

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true },
  });

  wsServer.broadcastToTeam(ticket?.teamId ?? "", {
    type: "ticket:time-log:added",
    payload: { ticketId: id, timeLog },
  });

  return NextResponse.json({ timeLog }, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { durationMinutes, billableType, description, logDate, taskId, ticketId } = await req.json();

  const data: any = {};
  if (durationMinutes !== undefined) data.durationMinutes = durationMinutes;
  if (billableType !== undefined) data.billableType = billableType;
  if (description !== undefined) data.description = description;
  if (logDate !== undefined) data.logDate = new Date(logDate);
  if (taskId !== undefined) data.taskId = taskId;
  if (ticketId !== undefined) data.ticketId = ticketId;

  const timeLog = await prisma.timeLog.update({
    where: { id },
    data,
  });

  return NextResponse.json({ timeLog });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.timeLog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
