"use client";

import { BarChart3, Users, DollarSign, CheckCircle2, Clock, PieChart } from "lucide-react";

export default function TaskListChartView() {
  const taskListMetrics = [
    { name: "Walk-through check list", total: 13, open: 11, completed: 2, budgetHealth: "Healthy ($12,500)", lead: "Monica Hemsworth" },
    { name: "Architecture Floor Plan & Elevation", total: 8, open: 3, completed: 5, budgetHealth: "Healthy ($24,000)", lead: "Ravi Saini" },
    { name: "HR Employee Onboarding Checklist", total: 6, open: 1, completed: 5, budgetHealth: "Optimal ($4,200)", lead: "Faiyazudeen I" },
    { name: "QA Software Testing Suite", total: 15, open: 12, completed: 3, budgetHealth: "At Risk ($18,900)", lead: "Eduardo Vargas" },
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <span>Task List Chart View & Visual Reports</span>
          </h3>
          <p className="text-xs text-slate-500">Visual overview of task list completion status, user workload assignments, and budget health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task List Status Doughnut Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#0070BA]" />
            <span>Task List Completion Status</span>
          </h4>

          <div className="space-y-3">
            {taskListMetrics.map((item) => {
              const pct = Math.round((item.completed / item.total) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>{item.name} ({item.completed}/{item.total} finished)</span>
                    <span className="text-[#0070BA] font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-[#0070BA] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Health & User Assignments */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span>Budget Health & Lead Assignments</span>
          </h4>

          <div className="space-y-2">
            {taskListMetrics.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 font-sans">
                <div>
                  <span className="font-bold text-slate-900 block">{item.name}</span>
                  <span className="text-[11px] text-slate-500">Lead: {item.lead}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  item.budgetHealth.includes("Healthy") || item.budgetHealth.includes("Optimal")
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {item.budgetHealth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
