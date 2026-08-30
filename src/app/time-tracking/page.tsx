"use client";

import { useEffect, useState } from "react";
import { TimeLog, Task, Ticket, Project, User } from "@/types";
import { formatDate, formatDuration } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/utils";
import { Calendar, Clock, User as UserIcon, Plus } from "lucide-react";

export default function TimeTrackingPage() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [showForm, setShowForm] = useState(false);
  const [formTask, setFormTask] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formBillable, setFormBillable] = useState("BILLABLE");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState(dateRange.end);

    const headers = getAuthHeaders();

  useEffect(() => {
    fetchData();
    fetchTimeLogs();
  }, []);

  useEffect(() => {
    fetchTimeLogs();
  }, [dateRange]);

  async function fetchData() {
    const [tRes, tkRes, tiRes, uRes] = await Promise.all([
      fetch("/api/tasks", { headers }),
      fetch("/api/tickets", { headers }),
      fetch("/api/projects", { headers }),
      fetch("/api/users", { headers }),
    ]);
    setTasks((await tRes.json()).tasks || []);
    setTickets((await tkRes.json()).tickets || []);
    setProjects((await tiRes.json()).projects || []);
    setUsers((await uRes.json()).users || []);
  }

  async function fetchTimeLogs() {
    setLoading(true);
    const res = await fetch(`/api/time-logs?start=${dateRange.start}&end=${dateRange.end}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTimeLogs(data.timeLogs || []);
    }
    setLoading(false);
  }

  async function addTimeLog() {
    const res = await fetch("/api/time-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        taskId: formTask ? formTask : undefined,
        durationMinutes: parseInt(formDuration),
        billableType: formBillable,
        description: formDescription,
        logDate: formDate,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setFormTask("");
      setFormDuration("");
      setFormDescription("");
      setFormDate(dateRange.end);
      fetchTimeLogs();
    }
  }

  const totalBillable = timeLogs.reduce((sum, log) => sum + (log.billableType === "BILLABLE" ? log.durationMinutes : 0), 0);
  const totalNonBillable = timeLogs.reduce((sum, log) => sum + (log.billableType === "NON_BILLABLE" ? log.durationMinutes : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Time Tracking</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" /> Log Time
        </button>
      </div>

      <div className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </div>

        <div className="ml-auto flex gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500">Billable</p>
            <p className="text-lg font-bold text-emerald-600">{formatDuration(totalBillable)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Non-Billable</p>
            <p className="text-lg font-bold text-slate-600">{formatDuration(totalNonBillable)}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Log Time</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Task</label>
                <select value={formTask} onChange={(e) => setFormTask(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option value="">Select a task</option>
                  {tasks.map((t) => (<option key={t.id} value={t.id}>{t.title}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Duration (minutes)</label>
                <input
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  placeholder="e.g. 60"
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select value={formBillable} onChange={(e) => setFormBillable(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option value="BILLABLE">Billable</option>
                  <option value="NON_BILLABLE">Non-Billable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
              <button
                onClick={addTimeLog}
                disabled={!formDuration || !formDescription}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ))}
        </div>
      ) : timeLogs.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <Clock className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2">No time logs found for this period</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Task/Ticket</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Type</th>
                <th className="text-right py-3 px-4 font-medium text-slate-900">Duration</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100">
                  <td className="py-2 px-4">{formatDate(log.logDate)}</td>
                  <td className="py-2 px-4">
                    {log.task ? log.task.title : log.ticket ? log.ticket.title : "\u2014"}
                  </td>
                  <td className="py-2 px-4 text-slate-600">{log.description}</td>
                  <td className="py-2 px-4">
                    <span className={`rounded px-1.5 py-0.5 text-xs ${log.billableType === "BILLABLE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
                      {log.billableType === "BILLABLE" ? "Billable" : "Non-billable"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right font-medium">{formatDuration(log.durationMinutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
