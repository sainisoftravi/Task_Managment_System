"use client";

import { useState } from "react";
import { Task } from "@/types";
import { colorForPriority, colorForStatus, formatDate, getDaysOverdue } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckSquare,
  User,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface ListViewProps {
  tasks: Task[];
  headers: Record<string, string>;
  onTaskClick: (task: Task) => void;
}

export default function ListView({ tasks, headers, onTaskClick }: ListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
        >
          <option value="">All Statuses</option>
          {["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"].map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 font-medium text-slate-900">Task</th>
              <th className="text-left py-2 font-medium text-slate-900">Status</th>
              <th className="text-left py-2 font-medium text-slate-900">Priority</th>
              <th className="text-left py-2 font-medium text-slate-900">Assignee</th>
              <th className="text-left py-2 font-medium text-slate-900">Due Date</th>
              <th className="text-right py-2 font-medium text-slate-900">Est.</th>
              <th className="text-right py-2 font-medium text-slate-900">Logged</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">No tasks match your filters</td>
              </tr>
            ) : (
              filtered.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
                return (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3">
                      <div
                        className="cursor-pointer font-medium text-slate-900 hover:text-primary-600"
                        onClick={() => onTaskClick(task)}
                      >
                        {task.title}
                        {task.convertedFromTicketId && (
                          <span className="ml-1 text-xs text-slate-400">(from ticket)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorForStatus(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${colorForPriority(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      {task.assignee && (
                        <span className="flex items-center gap-1 text-sm text-slate-600">
                          <User className="h-4 w-4" /> {task.assignee.name || task.assignee.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {task.dueDate && (
                        <span className={isOverdue ? "text-red-600" : "text-slate-600"}>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(task.dueDate)}
                          {isOverdue && <AlertCircle className="h-3 w-3 inline ml-1" />}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">{task.estimatedHours ?? "—"}</td>
                    <td className="py-3 text-right">
                      {task.loggedHours ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.loggedHours}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
