"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/utils";
import {
  BarChart3, Calendar, Users, Clock, FileText, Ticket, Briefcase,
  AlertCircle, CheckCircle,
} from "lucide-react";

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
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

    const headers = getAuthHeaders();

  useEffect(() => {
    fetchReports();
  }, []);

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
    return <div className="p-6">Loading reports...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-slate-500">Failed to load reports</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="rounded-md border border-slate-300 px-2 py-1 text-sm" />
          <span className="text-slate-400">to</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={data.totalTickets} icon={<Ticket className="h-6 w-6 text-primary-600" />} />
        <StatCard title="Open Tickets" value={data.openTickets} icon={<Ticket className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Breached SLAs" value={data.breachedSLAs} icon={<AlertCircle className="h-6 w-6 text-red-600" />} />
        <StatCard title="Active Projects" value={data.activeProjects} icon={<Briefcase className="h-6 w-6 text-indigo-600" />} />
        <StatCard title="Total Tasks" value={data.totalTasks} icon={<FileText className="h-6 w-6 text-slate-600" />} />
        <StatCard title="Completed Tasks" value={data.completedTasks} icon={<CheckCircle className="h-6 w-6 text-emerald-600" />} />
        <StatCard title="Total Time" value={formatDuration(data.billableHours * 60 + data.nonBillableHours * 60)} icon={<Clock className="h-6 w-6 text-amber-600" />} />
        <StatCard title="Billable Hours" value={`${data.billableHours.toFixed(1)}h`} icon={<Clock className="h-6 w-6 text-emerald-600" />} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Agent Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2">Agent</th>
                <th className="text-right py-2">Tickets</th>
                <th className="text-right py-2">Tasks</th>
                <th className="text-right py-2">Hours Tracked</th>
              </tr>
            </thead>
            <tbody>
              {data.agentStats.map((agent) => (
                <tr key={agent.userId} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{agent.name}</td>
                  <td className="text-right py-2">{agent.ticketCount}</td>
                  <td className="text-right py-2">{agent.taskCount}</td>
                  <td className="text-right py-2">{agent.hours.toFixed(1)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
