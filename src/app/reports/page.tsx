"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/utils";
import {
  Calendar, Users, Clock, FileText, Ticket, Briefcase,
  AlertCircle, CheckCircle, Download,
} from "lucide-react";
import { ExportModal } from "@/components/reports/export-modal";

interface ReportData {
  totalTickets: number;
  openTickets: number;
  breachedSLAs: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalTimeLogs: number;
  billableHours: number;
  nonBillableHours: number;
  agentStats: Array<{ userId: string; name: string; ticketCount: number; taskCount: number; hours: number }>;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const headers = getAuthHeaders();

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  async function fetchReports() {
    setLoading(true);
    const res = await fetch(`/api/reports?start=${dateRange.start}&end=${dateRange.end}`, { headers });
    if (res.ok) {
      const d = await res.json();
      setData(d.report);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Loading reports...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-slate-500">Failed to load reports</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-sm text-slate-500">Summary statistics & export controls</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="border-none text-xs font-medium text-slate-700 focus:outline-none"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="border-none text-xs font-medium text-slate-700 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={data.totalTickets} icon={<Ticket className="h-6 w-6 text-primary-600" />} />
        <StatCard title="Open Tickets" value={data.openTickets} icon={<Ticket className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Breached SLAs" value={data.breachedSLAs} icon={<AlertCircle className="h-6 w-6 text-red-600" />} />
        <StatCard title="Active Projects" value={data.activeProjects} icon={<Briefcase className="h-6 w-6 text-indigo-600" />} />
        <StatCard title="Total Tasks" value={data.totalTasks} icon={<FileText className="h-6 w-6 text-slate-600" />} />
        <StatCard title="Completed Tasks" value={data.completedTasks} icon={<CheckCircle className="h-6 w-6 text-emerald-600" />} />
        <StatCard title="Total Time Logged" value={formatDuration(data.billableHours * 60 + data.nonBillableHours * 60)} icon={<Clock className="h-6 w-6 text-amber-600" />} />
        <StatCard title="Billable Hours" value={`${data.billableHours.toFixed(1)}h`} icon={<Clock className="h-6 w-6 text-emerald-600" />} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Agent Workload & Productivity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs">
                <th className="text-left py-2 font-semibold">Agent</th>
                <th className="text-right py-2 font-semibold">Tickets Assigned</th>
                <th className="text-right py-2 font-semibold">Tasks Authored</th>
                <th className="text-right py-2 font-semibold">Hours Tracked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.agentStats.map((agent) => (
                <tr key={agent.userId}>
                  <td className="py-3 font-medium text-slate-900">{agent.name}</td>
                  <td className="text-right py-3">{agent.ticketCount}</td>
                  <td className="text-right py-3">{agent.taskCount}</td>
                  <td className="text-right py-3 font-semibold text-slate-900">{agent.hours.toFixed(1)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">{icon}</div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
