import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BillableType } from "@/types";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "ADMIN" && session.role !== "MANAGER") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (start) dateFilter.gte = new Date(start);
  if (end) dateFilter.lte = new Date(end);
  const hasDateFilter = !!dateFilter.gte || !!dateFilter.lte;

  const [
    totalTickets,
    openTickets,
    breachedSLAs,
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    allBillableLogs,
    nonBillableLogs,
  ] = await Promise.all([
    prisma.ticket.count({}),
    prisma.ticket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] } } }),
    prisma.ticket.count({ where: { slaBreached: true } }),
    prisma.project.count({}),
    prisma.project.count({ where: { status: { in: ["ACTIVE", "PLANNING", "ON_HOLD"] } } }),
    prisma.task.count({}),
    prisma.task.count({ where: { status: "DONE" } }),
    prisma.timeLog.findMany({
      where: hasDateFilter ? { logDate: dateFilter } : {},
      select: { userId: true, durationMinutes: true, billableType: true },
    }),
    prisma.timeLog.aggregate({
      where: {
        ...(hasDateFilter ? { logDate: dateFilter } : {}),
        billableType: "NON_BILLABLE",
      },
      _sum: { durationMinutes: true },
    }),
  ]);

  const agents = await prisma.user.findMany({
    where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          assignedTickets: true,
          authoredTasks: true,
        },
      },
    },
  });

  const timeLogSums = allBillableLogs.reduce(
    (map, log) => {
      if (!map.has(log.userId)) map.set(log.userId, { billable: 0, nonBillable: 0 });
      const entry = map.get(log.userId)!;
      if (log.billableType === "BILLABLE") entry.billable += log.durationMinutes;
      else entry.nonBillable += log.durationMinutes;
      return map;
    },
    new Map<string, { billable: number; nonBillable: number }>(),
  );

  const totalBillable = allBillableLogs
    .filter((l) => l.billableType === "BILLABLE")
    .reduce((sum, l) => sum + l.durationMinutes, 0);
  const totalNonBillable = allBillableLogs
    .filter((l) => l.billableType === "NON_BILLABLE")
    .reduce((sum, l) => sum + l.durationMinutes, 0);

  const report = {
    totalTickets,
    openTickets,
    breachedSLAs,
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    billableHours: totalBillable / 60,
    nonBillableHours: totalNonBillable / 60,
    agentStats: agents.map((a) => {
      const sums = timeLogSums.get(a.id);
      return {
        userId: a.id,
        name: a.name || a.email,
        ticketCount: a._count.assignedTickets,
        taskCount: a._count.authoredTasks,
        hours: ((sums?.billable ?? 0) + (sums?.nonBillable ?? 0)) / 60,
      };
    }),
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ report });
}
