import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DashboardSLAData, DashboardOverdueTask, DashboardResourceHours } from "@/types";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();

  const [slaStats, overdueTasks, resourceHours, projectProgress] = await Promise.all([
    getSLAStats(now),
    getOverdueTasks(now),
    getResourceHours(),
    getProjectProgress(),
  ]);

  return NextResponse.json({
    slaStats,
    overdueTasks,
    resourceHours,
    projectProgress,
    generatedAt: new Date().toISOString(),
  });
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
