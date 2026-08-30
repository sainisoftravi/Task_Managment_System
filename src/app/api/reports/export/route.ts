import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "xlsx";
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const includeTickets = searchParams.get("tickets") !== "false";
  const includeTasks = searchParams.get("tasks") !== "false";
  const includeTimeLogs = searchParams.get("timelogs") !== "false";

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (startStr) dateFilter.gte = new Date(startStr);
  if (endStr) {
    const endDate = new Date(endStr);
    endDate.setHours(23, 59, 59, 999);
    dateFilter.lte = endDate;
  }
  const hasDateFilter = !!dateFilter.gte || !!dateFilter.lte;

  // Query database
  const [openTickets, closedTickets, openTasks, closedTasks, timeLogs] = await Promise.all([
    includeTickets
      ? prisma.ticket.findMany({
          where: {
            status: { in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] },
            ...(hasDateFilter ? { createdAt: dateFilter } : {}),
          },
          include: { assignee: true, customer: true, team: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
    includeTickets
      ? prisma.ticket.findMany({
          where: {
            status: { in: ["RESOLVED", "CLOSED"] },
            ...(hasDateFilter ? { createdAt: dateFilter } : {}),
          },
          include: { assignee: true, customer: true, team: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
    includeTasks
      ? prisma.task.findMany({
          where: {
            status: { not: "DONE" },
            ...(hasDateFilter ? { createdAt: dateFilter } : {}),
          },
          include: { assignee: true, project: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
    includeTasks
      ? prisma.task.findMany({
          where: {
            status: "DONE",
            ...(hasDateFilter ? { createdAt: dateFilter } : {}),
          },
          include: { assignee: true, project: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
    includeTimeLogs
      ? prisma.timeLog.findMany({
          where: hasDateFilter ? { logDate: dateFilter } : {},
          include: { user: true, project: true, ticket: true, task: true },
          orderBy: { logDate: "desc" },
        })
      : [],
  ]);

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Task & PMP System";
    workbook.created = new Date();

    // Sheet 1: Open Items
    const openSheet = workbook.addWorksheet("Open Items");
    openSheet.columns = [
      { header: "Type", key: "type", width: 12 },
      { header: "ID / Key", key: "id", width: 15 },
      { header: "Title", key: "title", width: 35 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Status", key: "status", width: 15 },
      { header: "Assignee", key: "assignee", width: 22 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    openTickets.forEach((t) => {
      openSheet.addRow({
        type: "Ticket",
        id: t.id.slice(-8).toUpperCase(),
        title: t.title,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee?.name || t.assignee?.email || "Unassigned",
        createdAt: t.createdAt.toISOString().replace("T", " ").slice(0, 19),
      });
    });

    openTasks.forEach((t) => {
      openSheet.addRow({
        type: "Task",
        id: t.id.slice(-8).toUpperCase(),
        title: t.title,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee?.name || t.assignee?.email || "Unassigned",
        createdAt: t.createdAt.toISOString().replace("T", " ").slice(0, 19),
      });
    });

    // Style Header Row
    openSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    openSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E293B" } };

    // Sheet 2: Closed Items
    const closedSheet = workbook.addWorksheet("Closed Items");
    closedSheet.columns = [
      { header: "Type", key: "type", width: 12 },
      { header: "ID / Key", key: "id", width: 15 },
      { header: "Title", key: "title", width: 35 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Status", key: "status", width: 15 },
      { header: "Assignee", key: "assignee", width: 22 },
      { header: "Completed Date", key: "closedAt", width: 20 },
    ];

    closedTickets.forEach((t) => {
      closedSheet.addRow({
        type: "Ticket",
        id: t.id.slice(-8).toUpperCase(),
        title: t.title,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee?.name || t.assignee?.email || "Unassigned",
        closedAt: (t.resolvedAt || t.closedAt || t.updatedAt).toISOString().replace("T", " ").slice(0, 19),
      });
    });

    closedTasks.forEach((t) => {
      closedSheet.addRow({
        type: "Task",
        id: t.id.slice(-8).toUpperCase(),
        title: t.title,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee?.name || t.assignee?.email || "Unassigned",
        closedAt: t.updatedAt.toISOString().replace("T", " ").slice(0, 19),
      });
    });

    closedSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    closedSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "0F766E" } };

    // Sheet 3: Time Logs with SUM Formula
    const timeSheet = workbook.addWorksheet("Time Logs");
    timeSheet.columns = [
      { header: "Log Date", key: "logDate", width: 15 },
      { header: "User", key: "user", width: 22 },
      { header: "Billable Type", key: "billableType", width: 15 },
      { header: "Description", key: "description", width: 35 },
      { header: "Duration (Mins)", key: "durationMinutes", width: 16 },
      { header: "Duration (Hours)", key: "durationHours", width: 16 },
    ];

    timeLogs.forEach((l) => {
      timeSheet.addRow({
        logDate: l.logDate.toISOString().split("T")[0],
        user: l.user?.name || l.user?.email || "Unknown",
        billableType: l.billableType,
        description: l.description || "—",
        durationMinutes: l.durationMinutes,
        durationHours: Number((l.durationMinutes / 60).toFixed(2)),
      });
    });

    timeSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    timeSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "B45309" } };

    // Add Total Row with Excel SUM formula
    const totalRowIndex = timeLogs.length + 2;
    if (timeLogs.length > 0) {
      const totalRow = timeSheet.addRow({
        logDate: "TOTAL",
        user: "",
        billableType: "",
        description: "Total Tracked Hours",
        durationMinutes: { formula: `SUM(E2:E${totalRowIndex - 1})` },
        durationHours: { formula: `SUM(F2:F${totalRowIndex - 1})` },
      });
      totalRow.font = { bold: true };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="TaskPMP_Export_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  }

  // Format PDF Summary Document
  const totalOpen = openTickets.length + openTasks.length;
  const totalClosed = closedTickets.length + closedTasks.length;
  const totalHours = timeLogs.reduce((sum, l) => sum + l.durationMinutes / 60, 0);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Task & PMP Executive Summary Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
    .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; color: #0f172a; font-size: 24px; }
    .meta { font-size: 12px; color: #64748b; text-align: right; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
    .card .val { font-size: 24px; font-weight: bold; color: #2563eb; }
    .card .lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 5px; }
    h2 { font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600; }
    td { padding: 8px 12px; border: 1px solid #e2e8f0; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; }
    .badge-open { background: #dbeafe; color: #1e40af; }
    .badge-closed { background: #d1fae5; color: #065f46; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Unified Ticket & Project Executive Report</h1>
      <p style="margin:5px 0 0; font-size:13px; color:#64748b;">Generated for date range: ${startStr || "All time"} to ${endStr || "Present"}</p>
    </div>
    <div class="meta">
      <p>System: Task & PMP Unified</p>
      <p>Export Date: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="grid">
    <div class="card"><div class="val">${totalOpen}</div><div class="lbl">Open Items</div></div>
    <div class="card"><div class="val">${totalClosed}</div><div class="lbl">Closed Items</div></div>
    <div class="card"><div class="val">${totalHours.toFixed(1)}h</div><div class="lbl">Tracked Hours</div></div>
    <div class="card"><div class="val">${openTickets.length}</div><div class="lbl">Active Tickets</div></div>
  </div>

  <h2>Open Support Tickets & Project Tasks (${totalOpen})</h2>
  <table>
    <thead>
      <tr><th>Type</th><th>ID</th><th>Title</th><th>Priority</th><th>Status</th><th>Assignee</th></tr>
    </thead>
    <tbody>
      ${openTickets.slice(0, 15).map(t => `
        <tr>
          <td>Ticket</td>
          <td>${t.id.slice(-6).toUpperCase()}</td>
          <td>${t.title}</td>
          <td>${t.priority}</td>
          <td><span class="badge badge-open">${t.status}</span></td>
          <td>${t.assignee?.name || t.assignee?.email || "Unassigned"}</td>
        </tr>
      `).join("")}
      ${openTasks.slice(0, 15).map(t => `
        <tr>
          <td>Task</td>
          <td>${t.id.slice(-6).toUpperCase()}</td>
          <td>${t.title}</td>
          <td>${t.priority}</td>
          <td><span class="badge badge-open">${t.status}</span></td>
          <td>${t.assignee?.name || t.assignee?.email || "Unassigned"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Time Tracking Summary (${timeLogs.length} logs)</h2>
  <table>
    <thead>
      <tr><th>Date</th><th>User</th><th>Billable Type</th><th>Description</th><th>Duration</th></tr>
    </thead>
    <tbody>
      ${timeLogs.slice(0, 15).map(l => `
        <tr>
          <td>${l.logDate.toISOString().split("T")[0]}</td>
          <td>${l.user?.name || l.user?.email || "User"}</td>
          <td>${l.billableType}</td>
          <td>${l.description || "—"}</td>
          <td>${(l.durationMinutes / 60).toFixed(1)} hrs</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="TaskPMP_Executive_Report_${new Date().toISOString().split("T")[0]}.html"`,
    },
  });
}
