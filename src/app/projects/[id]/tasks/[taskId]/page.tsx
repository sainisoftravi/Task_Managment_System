"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Task, TaskDependency, TimeLog, User, Project } from "@/types";
import { colorForPriority, colorForStatus, formatDate, formatDateTime, formatDuration } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, UserIcon, Flag, Save, Plus, Trash2, Link2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TaskDetailPage() {
   const params = useParams<{ id: string; taskId: string }>();
   const { id, taskId } = params;
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [dependents, setDependents] = useState<TaskDependency[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

    const headers = getAuthHeaders();

  useEffect(() => {
    fetchTask();
    fetchDependencies();
    fetchTimeLogs();
    fetchUsers();
    fetchProjects();
  }, [taskId]);

  async function fetchTask() {
    const res = await fetch(`/api/tasks/${taskId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTask(data.task);
      setDependencies(data.task.dependencies || []);
      setDependents(data.task.dependents || []);
      setEditForm({
        title: data.task.title,
        description: data.task.description,
        status: data.task.status,
        priority: data.task.priority,
        assigneeId: data.task.assigneeId,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().split("T")[0] : "",
        estimatedHours: data.task.estimatedHours,
      });
    }
    setLoading(false);
  }

  async function fetchDependencies() {
    const res = await fetch(`/api/tasks/dependencies?taskId=${taskId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setDependencies(data.dependencies || []);
    }
  }

  async function fetchTimeLogs() {
    const res = await fetch(`/api/time-logs?taskId=${taskId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTimeLogs(data.timeLogs || []);
    }
  }

  async function fetchUsers() {
    const res = await fetch("/api/users", { headers });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
  }

  async function fetchProjects() {
    const res = await fetch("/api/projects", { headers });
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects || []);
    }
  }

  async function saveChanges() {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const data = await res.json();
      setTask(data.task);
      setEditing(false);
    }
  }

  async function addTimeLog() {
    const timeLogData = {
      durationMinutes: 60,
      billableType: "BILLABLE" as const,
      description: "Quick log",
      logDate: new Date().toISOString().split("T")[0],
    };
    await fetch("/api/time-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ taskId, ...timeLogData }),
    });
    fetchTimeLogs();
  }

  async function addDependency(dependsOnTaskId: string) {
    await fetch("/api/tasks/dependencies", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ taskId, dependsOnTaskId }),
    });
    fetchDependencies();
  }

  async function removeDependency(depId: string) {
    await fetch(`/api/tasks/dependencies?taskId=${taskId}`, {
      method: "DELETE",
      headers,
    });
    fetchDependencies();
  }

  if (loading || !task) {
    return <div className="p-6">Loading task...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className={`text-xs font-medium ${colorForPriority(task.priority)} rounded px-2 py-1`}>
            {task.priority}
          </span>
          <h1 className="text-xl font-bold text-slate-900">{task.title}</h1>
        </div>
        {editing ? (
          <button onClick={saveChanges} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            <Save className="h-4 w-4" /> Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
            <Plus className="h-4 w-4" /> Edit
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <span className="text-xs text-slate-500">Status</span>
            {editing ? (
              <select
                value={editForm.status || task.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                {["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"].map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            ) : (
              <span className={`mt-1 block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorForStatus(task.status)}`}>
                {task.status.replace("_", " ")}
              </span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-500">Priority</span>
            {editing ? (
              <select
                value={editForm.priority || task.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            ) : (
              <span className={`mt-1 block ${colorForPriority(task.priority)} rounded px-2 py-1 text-xs font-medium w-fit`}>
                {task.priority}
              </span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-500">Assignee</span>
            {editing ? (
              <select
                value={editForm.assigneeId || ""}
                onChange={(e) => setEditForm({ ...editForm, assigneeId: e.target.value || null })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            ) : task.assignee ? (
              <span className="mt-1 block text-sm font-medium">{task.assignee.name || task.assignee.email}</span>
            ) : (
              <span className="mt-1 text-sm text-slate-500">Unassigned</span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-500">Due Date</span>
            {editing ? (
              <input
                type="date"
                value={editForm.dueDate || ""}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            ) : task.dueDate ? (
              <span className="mt-1 block text-sm text-slate-600">{formatDate(task.dueDate)}</span>
            ) : (
              <span className="mt-1 text-sm text-slate-500">No due date</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <span className="text-xs text-slate-500">Estimated Hours</span>
            {editing ? (
              <input
                type="number"
                step="0.5"
                value={editForm.estimatedHours || ""}
                onChange={(e) => setEditForm({ ...editForm, estimatedHours: parseFloat(e.target.value) || undefined })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            ) : (
              <span className="mt-1 block text-sm text-slate-600">{task.estimatedHours ?? "—"}</span>
            )}
          </div>
          <div>
            <span className="text-xs text-slate-500">Logged Hours</span>
            <span className="mt-1 block text-sm font-medium text-slate-900">{task.loggedHours ?? 0}h</span>
          </div>
          {task.convertedFromTicketId && (
            <div>
              <span className="text-xs text-slate-500">From Ticket</span>
              <Link
                href={`/tickets/${task.convertedFromTicketId}`}
                className="mt-1 block text-sm text-primary-600 hover:text-primary-700"
              >
                View ticket
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
        {editing ? (
          <textarea
            value={editForm.description || ""}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
          />
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{task.description}</p>
        )}
      </div>

      {/* Dependencies */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Task Dependencies</h3>
        {dependencies.length === 0 && dependents.length === 0 ? (
          <p className="text-sm text-slate-500">No dependencies</p>
        ) : (
          <div className="space-y-3 text-sm">
            {dependencies.length > 0 && (
              <div>
                <span className="text-xs text-slate-500">Depends on:</span>
                {dependencies.map((d) => (
                  <div key={d.id} className="ml-2 mt-1 flex items-center gap-2">
                    <Link2 className="h-3 w-3 text-slate-400" />
                    <span>{d.dependsOn?.title || d.dependsOnTaskId}</span>
                  </div>
                ))}
              </div>
            )}
            {dependents.length > 0 && (
              <div>
                <span className="text-xs text-slate-500">Depended on by:</span>
                {dependents.map((d) => (
                  <div key={d.id} className="ml-2 mt-1 flex items-center gap-2">
                    <Link2 className="h-3 w-3 text-slate-400" />
                    <span>{d.task?.title || d.taskId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Time logs */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Time Logs</h3>
          <button
            onClick={() => router.push(`/projects/${task.projectId}/tasks/${taskId}?log=true`)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            <Plus className="h-3 w-3" /> Add Log
          </button>
        </div>
        {timeLogs.length === 0 ? (
          <p className="text-sm text-slate-500">No time logged yet</p>
        ) : (
          <div className="space-y-2">
            {timeLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="text-sm font-medium text-slate-900">{log.user?.name || "Unknown"}</span>
                  <span className="text-xs text-slate-500"> — {log.description}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-1.5 py-0.5 text-xs rounded ${log.billableType === "BILLABLE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
                    {log.billableType === "BILLABLE" ? "Billable" : "Non-billable"}
                  </span>
                  <span className="font-medium">{formatDuration(log.durationMinutes)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
