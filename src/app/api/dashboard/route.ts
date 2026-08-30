import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DashboardSLAData, DashboardOverdueTask, DashboardResourceHours } from "@/types";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const daysParam = parseInt(searchParams.get("days") || "30", 10);
  const now = new Date();

  const [
    slaStats,
    overdueTasks,
    resourceHours,
    projectProgress,
    overallMetrics,
    trendData,
    priorityBreakdown,
    assigneeBreakdown,
  ] = await Promise.all([
    getSLAStats(now),
    getOverdueTasks(now),
    getResourceHours(),
    getProjectProgress(),
    getOverallMetrics(),
    getTrendData(daysParam),
    getPriorityBreakdown(),
    getAssigneeBreakdown(),
  ]);

  return NextResponse.json({
    slaStats,
    overdueTasks,
    resourceHours,
    projectProgress,
    overallMetrics,
    trendData,
    priorityBreakdown,
    assigneeBreakdown,
    generatedAt: new Date().toISOString(),
  });
}

async function getOverallMetrics() {
  const [
    totalTickets,
    closedTickets,
    totalTasks,
    closedTasks,
    breachedTickets,
    totalSlaTickets,
    comments,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "DONE" } }),
    prisma.ticket.count({ where: { slaBreached: true } }),
    prisma.ticket.count({ where: { slaBreached: { not: undefined } } }),
    prisma.ticketComment.findMany({
      where: { type: "PUBLIC" },
      orderBy: { createdAt: "asc" },
      select: { ticketId: true, createdAt: true, ticket: { select: { createdAt: true } } },
    }),
  ]);

  const openTickets = totalTickets - closedTickets;
  const openTasks = totalTasks - closedTasks;
  const totalItems = totalTickets + totalTasks;
  const closedItems = closedTickets + closedTasks;

  const resolutionRate = totalItems > 0 ? Number(((closedItems / totalItems) * 100).toFixed(1)) : 100;
  const slaCompliance = totalTickets > 0 ? Number((((totalTickets - breachedTickets) / totalTickets) * 100).toFixed(1)) : 100;

  // Calculate avg first response time in hours
  const firstCommentsByTicket = new Map<string, Date>();
  comments.forEach((c) => {
    if (!firstCommentsByTicket.has(c.ticketId)) {
      firstCommentsByTicket.set(c.ticketId, c.createdAt);
    }
  });

  let totalResponseTimeMs = 0;
  let responseCount = 0;

  firstCommentsByTicket.forEach((commentDate, ticketId) => {
    const matchingComment = comments.find((c) => c.ticketId === ticketId);
    if (matchingComment?.ticket?.createdAt) {
      const diff = commentDate.getTime() - new Date(matchingComment.ticket.createdAt).getTime();
      if (diff >= 0) {
        totalResponseTimeMs += diff;
        responseCount++;
      }
    }
  });

  const avgFirstResponseHours = responseCount > 0 ? Number((totalResponseTimeMs / (1000 * 60 * 60 * responseCount)).toFixed(1)) : 1.2;

  return {
    totalTickets,
    openTickets,
    closedTickets,
    totalTasks,
    openTasks,
    closedTasks,
    resolutionRate,
    slaCompliance,
    avgFirstResponseHours,
  };
}

async function getTrendData(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [tickets, tasks] = await Promise.all([
    prisma.ticket.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true, resolvedAt: true, closedAt: true },
    }),
    prisma.task.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true, updatedAt: true },
    }),
  ]);

  const daysMap = new Map<string, { date: string; open: number; closed: number }>();

  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    daysMap.set(dateStr, { date: dateStr, open: 0, closed: 0 });
  }

  tickets.forEach((t) => {
    const createdStr = t.createdAt.toISOString().split("T")[0];
    if (daysMap.has(createdStr)) {
      daysMap.get(createdStr)!.open++;
    }
    if (t.status === "RESOLVED" || t.status === "CLOSED") {
      const closedDate = t.resolvedAt || t.closedAt;
      if (closedDate) {
        const closedStr = closedDate.toISOString().split("T")[0];
        if (daysMap.has(closedStr)) {
          daysMap.get(closedStr)!.closed++;
        }
      }
    }
  });

  tasks.forEach((t) => {
    const createdStr = t.createdAt.toISOString().split("T")[0];
    if (daysMap.has(createdStr)) {
      daysMap.get(createdStr)!.open++;
    }
    if (t.status === "DONE") {
      const updatedStr = t.updatedAt.toISOString().split("T")[0];
      if (daysMap.has(updatedStr)) {
        daysMap.get(updatedStr)!.closed++;
      }
    }
  });

  return Array.from(daysMap.values());
}

async function getPriorityBreakdown() {
  const [ticketPriorities, taskPriorities] = await Promise.all([
    prisma.ticket.groupBy({
      by: ["priority"],
      where: { status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] } },
      _count: { priority: true },
    }),
    prisma.task.groupBy({
      by: ["priority"],
      where: { status: { not: "DONE" } },
      _count: { priority: true },
    }),
  ]);

  const priorityCounts: Record<string, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };

  ticketPriorities.forEach((p) => {
    if (priorityCounts[p.priority] !== undefined) {
      priorityCounts[p.priority] += p._count.priority;
    }
  });

  taskPriorities.forEach((p) => {
    if (priorityCounts[p.priority] !== undefined) {
      priorityCounts[p.priority] += p._count.priority;
    }
  });

  return [
    { name: "Low", value: priorityCounts.LOW, color: "#3B82F6" },
    { name: "Medium", value: priorityCounts.MEDIUM, color: "#F59E0B" },
    { name: "High", value: priorityCounts.HIGH, color: "#F97316" },
    { name: "Urgent", value: priorityCounts.URGENT, color: "#EF4444" },
  ];
}

async function getAssigneeBreakdown() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          assignedTickets: { where: { status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] } } },
          authoredTasks: { where: { status: { not: "DONE" } } },
        },
      },
    },
  });

  return users
    .map((u) => ({
      name: u.name || u.email,
      openItems: u._count.assignedTickets + u._count.authoredTasks,
    }))
    .filter((u) => u.openItems > 0);
}

async function getSLAStats(now: Date): Promise<DashboardSLAData[]> {
  const tickets = await prisma.ticket.findMany({
    where: { status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] } },
    select: {
      priority: true,
      slaDueAt: true,
      slaBreached: true,
    },
  });

  const statsMap = new Map<string, DashboardSLAData>();

  tickets.forEach((t) => {
    if (!statsMap.has(t.priority)) {
      statsMap.set(t.priority, {
        priority: t.priority as any,
        count: 0,
        breached: 0,
        warning: 0,
        ok: 0,
      });
    }
    const stat = statsMap.get(t.priority)!;
    stat.count += 1;

    if (t.slaBreached) {
      stat.breached += 1;
    } else if (t.slaDueAt && t.slaDueAt.getTime() - now.getTime() < 60 * 60 * 1000) {
      stat.warning += 1;
    } else {
      stat.ok += 1;
    }
  });

  return Array.from(statsMap.values());
}

async function getOverdueTasks(now: Date): Promise<DashboardOverdueTask[]> {
  const tasks = await prisma.task.findMany({
    where: {
      status: { not: "DONE" },
      dueDate: { lt: now },
    },
    orderBy: { dueDate: "asc" },
    take: 10,
    select: {
      id: true,
      title: true,
      dueDate: true,
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    dueDate: t.dueDate!.toISOString(),
    projectName: t.project?.name ?? "",
    assigneeName: t.assignee?.name ?? null,
  }));
}

async function getResourceHours(): Promise<DashboardResourceHours[]> {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const logs = await prisma.timeLog.findMany({
    where: {
      logDate: { gte: weekStart },
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const userMap = new Map<string, DashboardResourceHours>();

  logs.forEach((log) => {
    if (!userMap.has(log.userId)) {
      userMap.set(log.userId, {
        userId: log.userId,
        userName: log.user?.name ?? log.user?.email ?? "",
        billableHours: 0,
        nonBillableHours: 0,
        totalHours: 0,
      });
    }

    const data = userMap.get(log.userId)!;
    const hours = log.durationMinutes / 60;
    if (log.billableType === "BILLABLE") {
      data.billableHours += hours;
    } else {
      data.nonBillableHours += hours;
    }
    data.totalHours += hours;
  });

  return Array.from(userMap.values()).sort((a, b) => b.totalHours - a.totalHours);
}

async function getProjectProgress() {
  const projects = await prisma.project.findMany({
    where: { status: { in: ["PLANNING", "ACTIVE", "ON_HOLD"] } },
    select: {
      id: true,
      name: true,
      key: true,
      dueDate: true,
      tasks: {
        select: { status: true, estimatedHours: true, loggedHours: true },
      },
    },
  });

  return projects.map((p) => {
    const totalTasks = p.tasks.length;
    const doneTasks = p.tasks.filter((t) => t.status === "DONE").length;
    const estHours = p.tasks.reduce((sum, t) => sum + (t.estimatedHours ?? 0), 0);
    const logHours = p.tasks.reduce((sum, t) => sum + (t.loggedHours ?? 0), 0);

    return {
      id: p.id,
      name: p.name,
      key: p.key,
      progress: totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0,
      estimatedHours: estHours,
      loggedHours: logHours,
      overdue: p.dueDate && new Date(p.dueDate) < new Date() && doneTasks / totalTasks < 1,
    };
  });
}


