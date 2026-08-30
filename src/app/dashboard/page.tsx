"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Ticket, TrendingUp, Calendar, Users, Loader2 } from "lucide-react";

interface DashboardData {
  slaStats: any[];
  overdueTasks: any[];
  resourceHours: any[];
  projectProgress: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-500">Failed to load dashboard data</div>;
  }

  const totalSLAs = data.slaStats.reduce((sum, s) => sum + s.count, 0);
  const breachedSLAs = data.slaStats.reduce((sum, s) => sum + s.breached, 0);
  const warningSLAs = data.slaStats.reduce((sum, s) => sum + s.warning, 0);

  const totalProjects = data.projectProgress.length;
  const activeProjects = data.projectProgress.filter((p) => !p.overdue).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="text-sm text-slate-500">Welcome back, {user?.name || user?.email}</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active SLAs"
          value={totalSLAs}
          subtitle={`${breachedSLAs} breached, ${warningSLAs} warning`}
          icon={<Ticket className="h-6 w-6 text-primary-600" />}
          trend="down"
        />
        <KPICard
          title="Overdue Tasks"
          value={data.overdueTasks.length}
          subtitle="Past due date"
          icon={<Calendar className="h-6 w-6 text-red-600" />}
          trend="up"
        />
        <KPICard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${totalProjects} total` }
          icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
          trend="up"
        />
        <KPICard
          title="Team Resources"
          value={data.resourceHours.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)}
          subtitle="hrs tracked this week"
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          trend="neutral"
        />
      </div>

      {/* SLA Section */}
      <SLASection slaStats={data.slaStats} />

      {/* Overdue Tasks */}
      <OverdueTasksSection tasks={data.overdueTasks} />

      {/* Resource Hours */}
      <ResourceHoursSection resources={data.resourceHours} />

      {/* Project Progress */}
      <ProjectProgressSection projects={data.projectProgress} />
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        {icon}
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">SLA Status by Priority</h2>
      <div className="space-y-3">
        {slaStats.length === 0 ? (
          <p className="text-sm text-slate-500">No active SLA tickets</p>
        ) : (
          slaStats.map((s) => (
            <div key={s.priority} className="flex items-center gap-4">
              <span className={`w-20 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[s.priority] || "bg-slate-100 text-slate-800"}`}>
                {s.priority}
              </span>
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${s.count > 0 ? (s.ok / s.count) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-600 w-48 text-right">
                {s.ok} OK / {s.warning} Warn / {s.breached} Breached ({s.count})
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Overdue Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">No overdue tasks — great job!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">{t.title}</p>
                <p className="text-sm text-slate-600">{t.projectName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600 font-medium">Overdue</p>
                <p className="text-xs text-slate-500">
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Resource Hours (This Week)</h2>
      {resources.length === 0 ? (
        <p className="text-sm text-slate-500">No time logged this week</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2">Resource</th>
                <th className="text-right py-2">Billable (hrs)</th>
                <th className="text-right py-2">Non-Billable (hrs)</th>
                <th className="text-right py-2">Total (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.userId} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{r.userName}</td>
                  <td className="text-right py-2">{r.billableHours.toFixed(1)}</td>
                  <td className="text-right py-2">{r.nonBillableHours.toFixed(1)}</td>
                  <td className="text-right py-2 font-medium">{r.totalHours.toFixed(1)}</td>
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Progress</h2>
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">No active projects</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{p.name}</span>
                <span className="text-sm text-slate-600">{Math.round(p.progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-2 bg-primary-600 rounded-full"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {p.loggedHours.toFixed(1)}h logged / {p.estimatedHours.toFixed(1)}h estimated
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
