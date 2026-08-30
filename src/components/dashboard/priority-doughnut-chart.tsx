"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface PriorityItem {
  name: string;
  value: number;
  color: string;
}

interface AssigneeItem {
  name: string;
  openItems: number;
}

interface PriorityDoughnutChartProps {
  priorityData: PriorityItem[];
  assigneeData: AssigneeItem[];
}

export function PriorityDoughnutChart({ priorityData, assigneeData }: PriorityDoughnutChartProps) {
  const totalOpen = priorityData.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Priority Breakdown Doughnut Chart */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Open Items by Priority</h2>
            <p className="text-xs text-slate-500">Distribution across Low, Medium, High, & Urgent</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {totalOpen} Total Open
          </span>
        </div>

        <div className="h-64 w-full">
          {totalOpen === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No open items to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", border: "none", color: "#F8FAFC", fontSize: "12px" }}
                  formatter={(val: any) => [`${val} items`, "Count"]}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Assignee Allocation Bar Chart */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Assignee / Team Allocation</h2>
          <p className="text-xs text-slate-500">Active workload per team member</p>
        </div>

        <div className="h-64 w-full">
          {assigneeData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No assigned open items
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assigneeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", border: "none", color: "#F8FAFC", fontSize: "12px" }}
                />
                <Bar dataKey="openItems" name="Open Tasks & Tickets" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
