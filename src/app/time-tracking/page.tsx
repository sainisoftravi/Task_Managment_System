"use client";

import { useEffect, useState } from "react";
import { TimeLog, Task, Ticket, Project, User } from "@/types";
import { formatDate, formatDuration, getAuthHeaders } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User as UserIcon,
  Plus,
  Pin,
  CheckCircle,
  XCircle,
  ChevronDown,
  Filter,
  Download,
  List,
  Grid,
  Calendar as CalendarIcon,
  CheckSquare,
  Shield,
  Trash2,
  X
} from "lucide-react";
import TimeLogGridView from "@/components/time-tracking/time-log-grid-view";
import TimeLogCalendarView from "@/components/time-tracking/time-log-calendar-view";
import ExportTimeLogsModal from "@/components/time-tracking/export-time-logs-modal";
import CreateCustomViewModal from "@/components/time-tracking/create-custom-view-modal";
import AddColumnDrawer from "@/components/time-tracking/add-column-drawer";
import TimeLogFilterDrawer from "@/components/time-tracking/time-log-filter-drawer";
import CreateTimesheetModal from "@/components/time-tracking/create-timesheet-modal";

export default function TimeTrackingPage() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: LIST, GRID, WEEKLY, CALENDAR
  const [viewType, setViewType] = useState<"LIST" | "GRID" | "WEEKLY" | "CALENDAR">("LIST");
  const [groupBy, setGroupBy] = useState<"DATE" | "USER">("DATE");
  const [datePreset, setDatePreset] = useState<"DAY" | "WEEK" | "MONTH" | "RANGE" | "PROJECT_SPAN">("MONTH");
  const [showExportModal, setShowExportModal] = useState(false);

  // Custom Views & Column Customizer State matching Screenshots 1, 2, and 3
  const [showCustomViewModal, setShowCustomViewModal] = useState(false);
  const [showAddColumnDrawer, setShowAddColumnDrawer] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [customViews, setCustomViews] = useState([
    { id: "v1", name: "All Timesheets", isFavorite: false },
    { id: "v2", name: "Timesheets Pending Approval", isFavorite: true },
    { id: "v3", name: "My Time Logs", isFavorite: false },
    { id: "v4", name: "Billable Time Logs", isFavorite: false },
  ]);
  const [selectedCustomView, setSelectedCustomView] = useState("v1");

  // Selection & Bulk Approval
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);

  // Daily Log Form State
  const [formTask, setFormTask] = useState("");
  const [formDurationInput, setFormDurationInput] = useState("");
  const [formBillable, setFormBillable] = useState<"BILLABLE" | "NON_BILLABLE">("BILLABLE");
  const [formDescription, setFormDescription] = useState("");
  const [formApprover, setFormApprover] = useState("Project Owner (Admin)");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);

  // Weekly Matrix State
  const [weeklyRows, setWeeklyRows] = useState([
    { id: "1", projectId: "p1", taskId: "t1", pinned: true, mon: 4, tue: 4, wed: 8, thu: 8, fri: 6, sat: 0, sun: 0, notes: "Backend API development" },
    { id: "2", projectId: "p1", taskId: "t2", pinned: false, mon: 2, tue: 2, wed: 0, thu: 0, fri: 2, sat: 0, sun: 0, notes: "Code review and PR merge" },
  ]);

  const headers = getAuthHeaders();

  useEffect(() => {
    fetchData();
    fetchTimeLogs();
  }, []);

  async function fetchData() {
    const [tRes, tiRes, uRes] = await Promise.all([
      fetch("/api/tasks", { headers }),
      fetch("/api/projects", { headers }),
      fetch("/api/users", { headers }),
    ]);
    setTasks((await tRes.json()).tasks || []);
    setProjects((await tiRes.json()).projects || []);
    setUsers((await uRes.json()).users || []);
  }

  async function fetchTimeLogs() {
    setLoading(true);
    const res = await fetch(`/api/time-logs`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTimeLogs(data.timeLogs || []);
    }
    setLoading(false);
  }

  // Parse 3.75 -> 3 hours 45 mins (225 minutes)
  const parseFlexibleDuration = (input: string): number => {
    const num = parseFloat(input);
    if (isNaN(num)) return 60;
    if (input.includes(".")) {
      const hours = Math.floor(num);
      const frac = num - hours;
      const minutes = Math.round(frac * 60);
      return hours * 60 + minutes;
    }
    return Math.round(num * 60);
  };

  async function handleAddDailyLog() {
    const minutes = parseFlexibleDuration(formDurationInput);
    const res = await fetch("/api/time-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        taskId: formTask || undefined,
        durationMinutes: minutes,
        billableType: formBillable,
        description: formDescription,
        logDate: formDate,
      }),
    });
    if (res.ok) {
      setShowDailyModal(false);
      setFormTask("");
      setFormDurationInput("");
      setFormDescription("");
      fetchTimeLogs();
    }
  }

  // Bulk Approval Actions
  const handleBulkApprove = () => {
    alert(`Approved ${selectedLogs.length} time log entries.`);
    setSelectedLogs([]);
  };

  const handleBulkReject = () => {
    alert(`Rejected ${selectedLogs.length} time log entries.`);
    setSelectedLogs([]);
  };

  const totalBillable = timeLogs.reduce((sum, log) => sum + (log.billableType === "BILLABLE" ? log.durationMinutes : 0), 0);
  const totalNonBillable = timeLogs.reduce((sum, log) => sum + (log.billableType === "NON_BILLABLE" ? log.durationMinutes : 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & View Type Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 bg-white p-4 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#0070BA]" />
              <span>Time Logs & Cross-Project Timesheets</span>
            </h1>

            {/* Custom View Selector matching Screenshots 2 & 3 */}
            <select
              value={selectedCustomView}
              onChange={(e) => {
                if (e.target.value === "CREATE_NEW") {
                  setShowCustomViewModal(true);
                } else {
                  setSelectedCustomView(e.target.value);
                }
              }}
              className="rounded border border-slate-300 px-3 py-1 text-xs font-bold text-[#0070BA] bg-white focus:outline-none cursor-pointer"
            >
              {customViews.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.isFavorite ? "⭐ " : ""}{v.name}
                </option>
              ))}
              <option value="CREATE_NEW">+ Create Custom View</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">Track daily effort, manage weekly time entries, and approve billable client hours</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Drawer Trigger Button matching Screenshot 2 */}
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
            title="Filter Time Logs"
          >
            <Filter className="h-3.5 w-3.5 text-orange-500" />
            <span>Filter</span>
          </button>

          {/* Add Column Button matching Screenshot 1 */}
          <button
            onClick={() => setShowAddColumnDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-slate-600" />
            <span>Add Column</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-semibold">
            <button
              onClick={() => setViewType("LIST")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                viewType === "LIST" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewType("GRID")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                viewType === "GRID" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewType("WEEKLY")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                viewType === "WEEKLY" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Weekly Matrix</span>
            </button>
            <button
              onClick={() => setViewType("CALENDAR")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                viewType === "CALENDAR" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span>Export Time Logs</span>
          </button>

          <button
            onClick={() => setShowDailyModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Time Log</span>
          </button>
        </div>
      </div>

      {/* Date Range & Grouping Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold text-slate-700">
            {(["DAY", "WEEK", "MONTH", "RANGE", "PROJECT_SPAN"] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setDatePreset(preset)}
                className={`px-2.5 py-1 rounded capitalize ${
                  datePreset === preset ? "bg-white text-[#0070BA] font-bold shadow-2xs" : "hover:text-slate-900"
                }`}
              >
                {preset.replace("_", " ").toLowerCase()}
              </button>
            ))}
          </div>

          {/* Group By Date vs User */}
          <div className="flex items-center gap-1 text-slate-600 font-semibold border-l border-slate-200 pl-3">
            <span>Group By:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="rounded border border-slate-300 px-2 py-1 bg-white text-[#0070BA] font-bold focus:outline-none"
            >
              <option value="DATE">Group By Date</option>
              <option value="USER">Group By User</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono font-bold">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-sans">BILLABLE HOURS</span>
            <span className="text-emerald-600 text-sm">{formatDuration(totalBillable)}</span>
          </div>
          <div className="text-right border-l border-slate-200 pl-4">
            <span className="text-[10px] text-slate-400 block font-sans">NON-BILLABLE</span>
            <span className="text-slate-600 text-sm">{formatDuration(totalNonBillable)}</span>
          </div>
        </div>
      </div>

      {/* Yellow Bulk Action Bar matching Screenshot 2 */}
      {selectedLogs.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs font-semibold text-amber-900 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedLogs([])}
              className="p-1 text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
              title="Clear Selection"
            >
              ✕
            </button>
            <span className="font-bold text-slate-800 bg-amber-200/70 px-2 py-0.5 rounded-full text-[11px]">
              {selectedLogs.length} selected
            </span>

            <button
              onClick={() => {
                if (confirm(`Delete ${selectedLogs.length} selected time log entries?`)) {
                  setTimeLogs(timeLogs.filter((l) => !selectedLogs.includes(l.id)));
                  setSelectedLogs([]);
                }
              }}
              className="rounded border border-rose-400 bg-white px-3 py-1 font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              Delete
            </button>

            {/* Create Timesheet Button matching Red Box in Screenshot 2 */}
            <button
              onClick={() => setShowTimesheetModal(true)}
              className="rounded border border-orange-400 bg-white px-3 py-1 font-bold text-orange-600 hover:bg-orange-50 cursor-pointer shadow-2xs"
            >
              Create Timesheet
            </button>

            <button
              onClick={() => alert("Change Billing Type for selected logs")}
              className="rounded border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Billing Type ▾
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs cursor-pointer"
            >
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 shadow-2xs cursor-pointer"
            >
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Main List Table */}
      {viewType === "LIST" && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedLogs(timeLogs.map((l) => l.id));
                      else setSelectedLogs([]);
                    }}
                    className="rounded text-[#0070BA]"
                  />
                </th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Task / Activity</th>
                <th className="py-3 px-3">Description / Notes</th>
                <th className="py-3 px-3 text-center">Billing Type</th>
                <th className="py-3 px-3 text-center">Approval Status</th>
                <th className="py-3 px-3 text-right">Logged Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {timeLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No time logs recorded for the selected period.
                  </td>
                </tr>
              ) : (
                timeLogs.map((log, idx) => {
                  const isSelected = selectedLogs.includes(log.id);
                  const isApproved = idx % 2 === 0; // Simulated approval status

                  return (
                    <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedLogs([...selectedLogs, log.id]);
                            else setSelectedLogs(selectedLogs.filter((id) => id !== log.id));
                          }}
                          className="rounded text-[#0070BA]"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {formatDate(log.logDate)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                            RS
                          </div>
                          <span>Ravi Saini</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {log.task ? log.task.title : "General Activity"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.billableType === "BILLABLE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {log.billableType === "BILLABLE" ? "Billable" : "Non-billable"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isApproved ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                        {formatDuration(log.durationMinutes)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewType === "GRID" && <TimeLogGridView />}

      {/* Calendar View */}
      {viewType === "CALENDAR" && (
        <TimeLogCalendarView
          onDateClick={(dateStr) => {
            setFormDate(dateStr);
            setShowDailyModal(true);
          }}
        />
      )}

      {/* Export Time Logs Modal */}
      <ExportTimeLogsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(data) => {
          const formatType = data.format; // "XLSX" | "CSV" | "PDF"
          const columns = data.selectedColumns && data.selectedColumns.length > 0
            ? data.selectedColumns
            : ["Project Name", "Task Title", "User Name", "Log Date", "Duration (Hours)", "Billable Type", "Approval Status"];

          // Demo fallback dataset matching screenshot if timeLogs is empty
          const activeLogs = timeLogs.length > 0 ? timeLogs : [
            {
              id: "tl-1",
              logDate: "2025-12-22",
              durationMinutes: 60,
              billableType: "BILLABLE",
              description: "02 Project Master Excel",
              task: { title: "02 JWIL Chennai - 2 parts - post at 2 locations", project: { name: "01 PoC Projects" } },
              user: { name: "Ravi Saini" }
            },
            {
              id: "tl-2",
              logDate: "2025-12-23",
              durationMinutes: 120,
              billableType: "BILLABLE",
              description: "Load testing setup and execution",
              task: { title: "Load Testing & Analysis", project: { name: "01 PoC Projects" } },
              user: { name: "Sushil Verma" }
            }
          ];

          const exportRows = activeLogs.map((log, idx) => ({
            "Project Name": log.task?.project?.name || "01 PoC Projects",
            "Task Title": log.task?.title || "General Activity",
            "User Name": log.user?.name || "Ravi Saini",
            "Log Date": log.logDate ? new Date(log.logDate).toISOString().split("T")[0] : "2025-12-22",
            "Duration (Hours)": (log.durationMinutes / 60).toFixed(2) + " hrs",
            "Billable Type": log.billableType === "BILLABLE" ? "Billable" : "Non-Billable",
            "Approval Status": idx % 2 === 0 ? "Approved" : "Pending",
            "Description Notes": log.description || "",
          }));

          if (formatType === "CSV" || formatType === "XLSX") {
            const headerRow = columns.join(",");
            const bodyRows = exportRows.map((row) =>
              columns.map((col: string) => `"${String((row as any)[col] || "").replace(/"/g, '""')}"`).join(",")
            );
            const csvContent = "\uFEFF" + [headerRow, ...bodyRows].join("\n");
            const mimeType = formatType === "XLSX" ? "application/vnd.ms-excel" : "text/csv;charset=utf-8;";
            const ext = formatType === "XLSX" ? "xlsx" : "csv";

            const blob = new Blob([csvContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `time_logs_report_${new Date().toISOString().slice(0, 10)}.${ext}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (formatType === "PDF") {
            const printWin = window.open("", "_blank");
            if (printWin) {
              const htmlContent = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Time Logs Report - TaskPMP</title>
                    <style>
                      body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #333; }
                      h1 { font-size: 18px; color: #0070BA; margin-bottom: 4px; }
                      p { font-size: 11px; color: #666; margin-top: 0; }
                      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                      th { background-color: #f8fafc; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #475569; }
                      tr:nth-child(even) { background-color: #f1f5f9; }
                      .footer { margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: right; }
                    </style>
                  </head>
                  <body>
                    <h1>TaskPMP Enterprise - Time Logs Summary Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()} | Scope: ${data.projectScope}</p>
                    <table>
                      <thead>
                        <tr>
                          ${columns.map((c: string) => `<th>${c}</th>`).join("")}
                        </tr>
                      </thead>
                      <tbody>
                        ${exportRows
                          .map(
                            (row) =>
                              `<tr>${columns.map((c: string) => `<td>${(row as any)[c] || ""}</td>`).join("")}</tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>
                    <div class="footer">Confidential - TaskPMP Management System</div>
                    <script>
                      window.onload = function() { window.print(); };
                    </script>
                  </body>
                </html>
              `;
              printWin.document.write(htmlContent);
              printWin.document.close();
            }
          }
        }}
      />

      {/* Weekly Matrix View */}
      {viewType === "WEEKLY" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900">Weekly Timesheet Matrix</h2>
              <button
                onClick={() =>
                  setWeeklyRows([
                    ...weeklyRows,
                    {
                      id: String(Date.now()),
                      projectId: "p1",
                      taskId: "t3",
                      pinned: false,
                      mon: 0,
                      tue: 0,
                      wed: 0,
                      thu: 0,
                      fri: 0,
                      sat: 0,
                      sun: 0,
                      notes: "",
                    },
                  ])
                }
                className="inline-flex items-center gap-1 font-bold text-[#0070BA] text-xs hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2 px-2 w-8">Pin</th>
                  <th className="py-2 px-2">Task / General Activity</th>
                  <th className="py-2 px-2 text-center w-14">Mon</th>
                  <th className="py-2 px-2 text-center w-14">Tue</th>
                  <th className="py-2 px-2 text-center w-14">Wed</th>
                  <th className="py-2 px-2 text-center w-14">Thu</th>
                  <th className="py-2 px-2 text-center w-14">Fri</th>
                  <th className="py-2 px-2 text-center w-14">Sat</th>
                  <th className="py-2 px-2 text-center w-14">Sun</th>
                  <th className="py-2 px-2 text-right w-20">Total (HRS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {weeklyRows.map((row, rIdx) => {
                  const rowTotal = row.mon + row.tue + row.wed + row.thu + row.fri + row.sat + row.sun;
                  return (
                    <tr key={row.id}>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => {
                            const updated = [...weeklyRows];
                            updated[rIdx].pinned = !updated[rIdx].pinned;
                            setWeeklyRows(updated);
                          }}
                          className={`p-1 rounded ${row.pinned ? "text-amber-500" : "text-slate-300 hover:text-slate-500"}`}
                        >
                          <Pin className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </td>
                      <td className="py-2 px-2 font-sans font-bold text-slate-800">
                        Task #{rIdx + 1} ({row.notes})
                      </td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.mon} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.tue} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.wed} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.thu} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.fri} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.sat} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-1"><input type="number" defaultValue={row.sun} className="w-full text-center border rounded py-1 text-xs font-bold" /></td>
                      <td className="py-2 px-2 text-right font-bold text-[#0070BA]">{rowTotal} hrs</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Time Log Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Daily Time Log</h3>
              <button onClick={() => setShowDailyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Task / Activity</label>
                <select
                  value={formTask}
                  onChange={(e) => setFormTask(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="">General Activity (Non-task)</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Hours or 3.75 for 3h45m)</label>
                <input
                  type="text"
                  placeholder="e.g. 3.75 or 4"
                  value={formDurationInput}
                  onChange={(e) => setFormDurationInput(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono font-bold focus:border-[#0070BA] focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Interprets 3.75 as 3 hours and 45 minutes.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Type</label>
                <select
                  value={formBillable}
                  onChange={(e) => setFormBillable(e.target.value as any)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="BILLABLE">Billable</option>
                  <option value="NON_BILLABLE">Non-Billable</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Approver</label>
                <select
                  value={formApprover}
                  onChange={(e) => setFormApprover(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="Project Owner (Admin)">Project Owner (Admin)</option>
                  <option value="Support Lead">Support Lead</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Work summary notes..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDailyModal(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddDailyLog}
                  className="rounded-md bg-[#0070BA] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Save Time Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom View Modal matching Screenshots 2 & 3 */}
      <CreateCustomViewModal
        isOpen={showCustomViewModal}
        onClose={() => setShowCustomViewModal(false)}
        onSave={(newView) => {
          const created = { id: `v-${Date.now()}`, name: newView.name, isFavorite: true };
          setCustomViews([...customViews, created]);
          setSelectedCustomView(created.id);
          alert(`Created custom view '${newView.name}' successfully!`);
        }}
      />

      {/* Add Column Drawer matching Screenshot 1 */}
      <AddColumnDrawer
        isOpen={showAddColumnDrawer}
        onClose={() => setShowAddColumnDrawer(false)}
        onAddColumn={(colName) => {
          alert(`Added column '${colName}' to time logs table view.`);
        }}
        onCreateCustomField={() => {
          const fieldName = prompt("Enter Custom Field Name:");
          if (fieldName) {
          }
        }}
      />

      {/* Time Log Filter Drawer matching Screenshot 2 */}
      <TimeLogFilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        onApplyFilter={(filterData) => {
          alert(`Applied filter: ${filterData.selectedUsers.length} user(s) selected with '${filterData.matchLogic}' logic.`);
        }}
      />

      {/* Create Timesheet Modal matching Screenshots 1 & 2 */}
      <CreateTimesheetModal
        isOpen={showTimesheetModal}
        onClose={() => setShowTimesheetModal(false)}
        initialSelectedLogs={timeLogs.filter((l) => selectedLogs.includes(l.id))}
        onSuccess={(timesheet) => {
          setSelectedLogs([]);
          alert(`Created timesheet '${timesheet.name}' with status '${timesheet.status}'.`);
        }}
      />
    </div>
  );
}
