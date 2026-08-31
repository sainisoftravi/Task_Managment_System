"use client";

import { useState } from "react";
import { Task, Project } from "@/types";
import { Plus, MoreHorizontal, AlertCircle, PieChart as PieIcon, Users, Tag, Calendar, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

interface ProjectDashboardTabProps {
  project: Project;
  tasks: Task[];
}

const PASTEL_COLORS = ["#FF7675", "#55E6C1", "#74B9FF", "#F6B93B", "#A29BFE", "#FD79A8"];

export default function ProjectDashboardTab({ project, tasks }: ProjectDashboardTabProps) {
  const [widgets, setWidgets] = useState([
    "taskStatus",
    "overdueWorkItems",
    "teamStatus",
    "issueStatus",
    "projectTags",
    "weeklyDigest",
  ]);

  // Compute Task Status Distribution
  const statusCounts: Record<string, number> = {
    Closed: 0,
    "In Review": 0,
    "Not Started": 0,
    "In QA": 0,
  };

  tasks.forEach((t) => {
    if (t.status === "DONE") statusCounts["Closed"]++;
    else if (t.status === "IN_REVIEW") statusCounts["In Review"]++;
    else if (t.status === "IN_PROGRESS") statusCounts["In QA"]++;
    else statusCounts["Not Started"]++;
  });

  // Ensure default demo counts if empty to match Zoho screenshot
  if (tasks.length === 0) {
    statusCounts["Closed"] = 15;
    statusCounts["In Review"] = 3;
    statusCounts["Not Started"] = 3;
    statusCounts["In QA"] = 2;
  }

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const totalTasks = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  // Overdue Work Items
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE");

  // Team Status Table Data
  const teamMembers = [
    { name: "Aman Besham", overdue: 1, today: 0, open: 1 },
    { name: "Divakar Pandiy", overdue: 0, today: 0, open: 2 },
    { name: "Ravi Saini", overdue: 1, today: 0, open: 3 },
    { name: "Sushil Chaudhary", overdue: 0, today: 0, open: 1 },
    { name: "Sushil Verma", overdue: 0, today: 0, open: 1 },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Sub-header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-3 rounded-md shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">Project Dashboard ▾</span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Widget
        </button>
      </div>

      {/* Widgets Grid (2 Columns matching Zoho Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Widget 1: Task Status Pie Chart */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Task Status</h3>
              <span className="text-[10px] text-slate-400 font-mono">TOTAL : {totalTasks} Tasks</span>
            </div>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={30}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 2: Overdue Work Items */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800">Overdue Work Items</h3>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {overdueTasks.length === 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50 text-xs">
                  <span className="font-semibold text-slate-800 truncate">05 PROJECT MANAGEMENT</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Late by 174 days
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50 text-xs">
                  <span className="font-semibold text-slate-800 truncate">01 Digital Twin Support at Client Site</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Late by 157 days
                  </span>
                </div>
              </div>
            ) : (
              overdueTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50 text-xs">
                  <span className="font-semibold text-slate-800 truncate">{t.title}</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Overdue
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Widget 3: Team Status Table */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800">Team Status</h3>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-[10px] uppercase">
                  <th className="py-2 px-2">Users</th>
                  <th className="py-2 px-2 text-center text-red-600">Overdue</th>
                  <th className="py-2 px-2 text-center text-blue-600">Today's</th>
                  <th className="py-2 px-2 text-center text-emerald-600">All Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-amber-400 text-amber-900 font-bold text-[9px] flex items-center justify-center">
                        {m.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-800">{m.name}</span>
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-red-600">{m.overdue}</td>
                    <td className="py-2 px-2 text-center text-slate-600">{m.today}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-800">{m.open}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Widget 4: Issue Status */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800">Issue Status</h3>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
            <span className="text-xs font-bold text-slate-700">No Open Issues</span>
            <span className="text-[10px] text-slate-400">All support tickets and bugs resolved for this project.</span>
          </div>
        </div>

        {/* Widget 5: Project Tags Cloud */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800">Project Tags Cloud</h3>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex flex-wrap gap-2 py-4">
            <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">#Automation (12)</span>
            <span className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">#PoC (8)</span>
            <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">#ClientDemo (5)</span>
            <span className="px-3 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">#Hardware (3)</span>
          </div>
        </div>

        {/* Widget 6: Weekly Digest */}
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800">Weekly Digest (Week 42)</h3>
            <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: "Mon", created: 2, completed: 4 },
                { day: "Tue", created: 5, completed: 3 },
                { day: "Wed", created: 1, completed: 6 },
                { day: "Thu", created: 4, completed: 5 },
                { day: "Fri", created: 3, completed: 2 },
              ]}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#00C49F" radius={[2, 2, 0, 0]} />
                <Bar dataKey="created" fill="#FF7675" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
