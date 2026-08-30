import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BillableType } from "@/types";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const projectId = searchParams.get("projectId");
  const billableType = searchParams.get("billableType") as BillableType | null;
  const userId = searchParams.get("userId") || session.userId;

  const where: any = { userId };
  if (start && end) where.logDate = { gte: new Date(start), lte: new Date(end) };
  if (projectId) where.projectId = projectId;
  if (billableType) where.billableType = billableType;

  const timeLogs = await prisma.timeLog.findMany({
    where,
    orderBy: { logDate: "desc" },
    include: {
      task: { select: { id: true, title: true, project: { select: { id: true, name: true, key: true } } } },
      ticket: { select: { id: true, title: true } },
      project: { select: { id: true, name: true, key: true } },
    },
  });

  return NextResponse.json({ timeLogs });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, ticketId, projectId, durationMinutes, billableType = "BILLABLE", description, logDate } = await req.json();

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
      projectId: projectId || undefined,
      durationMinutes,
      billableType,
      description,
      logDate: logDate ? new Date(logDate) : new Date(),
    },
    include: {
      task: { select: { id: true, title: true } },
      ticket: { select: { id: true, title: true } },
      project: { select: { id: true, name: true } },
    },
  });

  const { wsServer } = await import("@/lib/websocket-server");
  wsServer.broadcast(`user:${session.userId}`, {
    type: "time-log:added",
    payload: { timeLog },
  });

  return NextResponse.json({ timeLog }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, durationMinutes, billableType, description, logDate } = await req.json();

  const data: any = {};
  if (durationMinutes !== undefined) data.durationMinutes = durationMinutes;
  if (billableType !== undefined) data.billableType = billableType;
  if (description !== undefined) data.description = description;
  if (logDate !== undefined) data.logDate = new Date(logDate);

  const timeLog = await prisma.timeLog.update({ where: { id }, data });
  return NextResponse.json({ timeLog });
}

export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.timeLog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
