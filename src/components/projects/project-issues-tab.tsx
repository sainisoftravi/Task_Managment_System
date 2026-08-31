"use client";

import { useState } from "react";
import { Project, Ticket } from "@/types";
import { AlertCircle, Plus, Filter, Search, CheckCircle2, Clock, User, Tag } from "lucide-react";
import { colorForPriority, colorForStatus } from "@/lib/utils";

interface ProjectIssuesTabProps {
  project: Project;
  tickets?: Ticket[];
}

export default function ProjectIssuesTab({ project, tickets = [] }: ProjectIssuesTabProps) {
  const [search, setSearch] = useState("");

  const sampleIssues = [
    { key: "ISSUE-101", title: "API Gateway Memory Leak during Peak Load", priority: "URGENT", status: "OPEN", reporter: "Support Desk", assignee: "Divakar Pandiy", date: "2026-08-29" },
    { key: "ISSUE-102", title: "UI Layout Broken on Mobile Web Safar", priority: "HIGH", status: "IN_PROGRESS", reporter: "Acme Corp", assignee: "Sushil Verma", date: "2026-08-30" },
    { key: "ISSUE-103", title: "PDF Report Generation Timeout (> 50 pages)", priority: "MEDIUM", status: "RESOLVED", reporter: "Internal QA", assignee: "Ravi Saini", date: "2026-08-25" },
    { key: "ISSUE-104", title: "CORS Header Mismatch on Authentication Endpoint", priority: "LOW", status: "CLOSED", reporter: "DevOps Team", assignee: "Admin User", date: "2026-08-22" },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Top Header & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 rounded-md shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Issue & Bug Tracker</span>
          </h2>
          <p className="text-xs text-slate-500">Submit, track, and resolve project bugs and customer issues.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none"
            />
          </div>

          <button className="inline-flex items-center gap-1.5 rounded bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs transition-colors">
            <Plus className="h-4 w-4" />
            <span>Submit Issue</span>
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <th className="py-2.5 px-4 w-28">Issue Key</th>
              <th className="py-2.5 px-4">Title / Summary</th>
              <th className="py-2.5 px-4 text-center w-24">Priority</th>
              <th className="py-2.5 px-4 text-center w-28">Status</th>
              <th className="py-2.5 px-4 w-36">Assignee</th>
              <th className="py-2.5 px-4 w-28 text-right">Reported Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleIssues.map((issue, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-red-600">{issue.key}</td>
                <td className="py-3 px-4 font-bold text-slate-800">{issue.title}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorForPriority(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${colorForStatus(issue.status)}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">{issue.assignee}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-500">{issue.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
