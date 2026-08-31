"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Ticket, TrendingUp, Calendar, Users, Loader2, Download, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { OpenClosedChart } from "@/components/dashboard/open-closed-chart";
import { PriorityDoughnutChart } from "@/components/dashboard/priority-doughnut-chart";
import { ExportModal } from "@/components/reports/export-modal";
import MyTimeLogsWidget from "@/components/dashboard/my-time-logs-widget";
import MyPhasesWidget from "@/components/dashboard/my-phases-widget";

interface DashboardData {
  slaStats: any[];
  overdueTasks: any[];
  resourceHours: any[];
  projectProgress: any[];
  overallMetrics: {
    totalTickets: number;
    openTickets: number;
    closedTickets: number;
    totalTasks: number;
    openTasks: number;
    closedTasks: number;
    resolutionRate: number;
    slaCompliance: number;
    avgFirstResponseHours: number;
  };
  trendData: Array<{ date: string; open: number; closed: number }>;
  priorityBreakdown: Array<{ name: string; value: number; color: string }>;
  assigneeBreakdown: Array<{ name: string; openItems: number }>;
}

import { Plus, LayoutGrid, BarChart2, Hash, Link as LinkIcon, Share2, Copy } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendDays, setTrendDays] = useState(30);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"personal" | "portfolio" | "custom">("portfolio");
  const [showCreateDashboardModal, setShowCreateDashboardModal] = useState(false);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [widgetName, setWidgetName] = useState("");
  const [widgetType, setWidgetType] = useState<"chart" | "kpi" | "embed">("chart");
  const [embedUrl, setEmbedUrl] = useState("");

  const fetchDashboard = useCallback(async (days = trendDays) => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`/api/dashboard?days=${days}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [trendDays]);

  useEffect(() => {
    fetchDashboard(trendDays);
  }, [trendDays, fetchDashboard]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-[#0070BA]" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-500 font-sans">Failed to load dashboard data</div>;
  }

  const { overallMetrics, trendData, priorityBreakdown, assigneeBreakdown } = data;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Portal Home Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 bg-white p-4 -m-6 mb-2 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Portal Home Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back, {user?.name || user?.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWidgetModal(true)}
            className="inline-flex items-center gap-1.5 rounded border border-[#0070BA]/30 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-[#0070BA] hover:bg-blue-100/50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Widget</span>
          </button>

          <button
            onClick={() => setShowCreateDashboardModal(true)}
            className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Create Custom Dashboard</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            <span>Export (PDF/XLSX)</span>
          </button>
        </div>
      </div>

      {/* Dashboard Type View Switcher Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold pt-2">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "portfolio" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Portfolio Overview
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "personal" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Personal Work Items
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "custom" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Custom Dashboards
        </button>
      </div>

      {/* Top-Level Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Open vs. Closed Items"
          value={`${overallMetrics.openTickets + overallMetrics.openTasks} Open / ${overallMetrics.closedTickets + overallMetrics.closedTasks} Closed`}
          subtitle={`${overallMetrics.totalTickets} Tickets, ${overallMetrics.totalTasks} Tasks total`}
          icon={<Ticket className="h-6 w-6 text-blue-600" />}
          badge="Active Backlog"
          badgeColor="bg-blue-100 text-blue-800"
        />
        <KPICard
          title="Calculated Resolution Rate"
          value={`${overallMetrics.resolutionRate}%`}
          subtitle="Total resolved items percentage"
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          badge="High Efficiency"
          badgeColor="bg-emerald-100 text-emerald-800"
        />
        <KPICard
          title="Avg First-Response Time"
          value={`${overallMetrics.avgFirstResponseHours} hrs`}
          subtitle="Speed to initial ticket response"
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          badge="SLA Metric"
          badgeColor="bg-amber-100 text-amber-800"
        />
        <KPICard
          title="SLA Compliance Rate"
          value={`${overallMetrics.slaCompliance}%`}
          subtitle="Tickets resolved within SLA limit"
          icon={<ShieldCheck className="h-6 w-6 text-indigo-600" />}
          badge="Healthy SLA"
          badgeColor="bg-indigo-100 text-indigo-800"
        />
      </div>

      {/* Area Chart: Open vs Closed Trends */}
      <OpenClosedChart
        data={trendData || []}
        days={trendDays}
        onDaysChange={(newDays) => setTrendDays(newDays)}
      />

      {/* Doughnut Chart & Assignee Workload */}
      <PriorityDoughnutChart
        priorityData={priorityBreakdown || []}
        assigneeData={assigneeBreakdown || []}
      />

      {/* My Timesheet & My Phases Widgets matching User Screenshot */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyTimeLogsWidget
          onLogTimeClick={() => (window.location.href = "/time-tracking")}
          onWeeklyLogClick={() => (window.location.href = "/time-tracking")}
          onExportClick={() => (window.location.href = "/time-tracking")}
        />
        <MyPhasesWidget />
      </div>

      {activeTab === "personal" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <OverdueTasksSection tasks={data.overdueTasks} />
          </div>
        </div>
      )}

      {/* Resource Hours & Project Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResourceHoursSection resources={data.resourceHours} />
        <ProjectProgressSection projects={data.projectProgress} />
      </div>

      {/* Export Modal Component */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  badge,
  badgeColor,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-2 ${badgeColor}`}>
            {badge}
          </span>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">{icon}</div>
      </div>
    </div>
  );
}

function SLASection({ slaStats }: { slaStats: any[] }) {
  const colors: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-amber-100 text-amber-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">SLA Status by Priority</h2>
      <div className="space-y-4">
        {slaStats.length === 0 ? (
          <p className="text-sm text-slate-500">No active SLA tickets</p>
        ) : (
          slaStats.map((s) => (
            <div key={s.priority} className="flex items-center gap-4">
              <span className={`w-20 text-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[s.priority] || "bg-slate-100 text-slate-800"}`}>
                {s.priority}
              </span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${s.count > 0 ? (s.ok / s.count) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-600 w-44 text-right font-medium">
                {s.ok} OK / {s.warning} Warn / {s.breached} Breached
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OverdueTasksSection({ tasks }: { tasks: any[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Overdue Tasks</h2>
      {tasks.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle className="h-4 w-4" />
          <span>No overdue tasks — great job!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <div>
                <p className="font-medium text-slate-900 text-sm">{t.title}</p>
                <p className="text-xs text-slate-500">{t.projectName}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold">
                  <AlertCircle className="h-3 w-3" /> Overdue
                </span>
                <p className="text-[11px] text-slate-400">
                  Due {new Date(t.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceHoursSection({ resources }: { resources: any[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Resource Hours (This Week)</h2>
      {resources.length === 0 ? (
        <p className="text-sm text-slate-500">No time logged this week</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <th className="text-left py-2 font-semibold">Resource</th>
                <th className="text-right py-2 font-semibold">Billable (hrs)</th>
                <th className="text-right py-2 font-semibold">Non-Billable (hrs)</th>
                <th className="text-right py-2 font-semibold">Total (hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => (
                <tr key={r.userId}>
                  <td className="py-2.5 font-medium text-slate-900">{r.userName}</td>
                  <td className="text-right py-2.5 text-emerald-600 font-medium">{r.billableHours.toFixed(1)}</td>
                  <td className="text-right py-2.5 text-slate-500">{r.nonBillableHours.toFixed(1)}</td>
                  <td className="text-right py-2.5 font-bold text-slate-900">{r.totalHours.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProjectProgressSection({ projects }: { projects: any[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Progress</h2>
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">No active projects</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-900">{p.name}</span>
                <span className="font-semibold text-slate-700">{Math.round(p.progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2 bg-primary-600 rounded-full transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500">
                {p.loggedHours.toFixed(1)}h logged / {p.estimatedHours.toFixed(1)}h estimated
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
