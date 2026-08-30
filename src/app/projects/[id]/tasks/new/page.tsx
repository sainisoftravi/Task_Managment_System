"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project, User } from "@/types";
import { getAuthHeaders } from "@/lib/utils";
import { ArrowLeft, Plus, Save, X } from "lucide-react";

export default function NewTaskPage() {
   const params = useParams<{ id: string }>();
   const { id } = params;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [taskListId, setTaskListId] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [parentTaskId, setParentTaskId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    const headers = getAuthHeaders();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    const [userRes, tlRes] = await Promise.all([
      fetch("/api/users", { headers }),
      fetch(`/api/task-lists?projectId=${id}`, { headers }),
    ]);
    setUsers((await userRes.json()).users || []);
    setTaskLists((await tlRes.json()).taskLists || []);

    if ((await tlRes.json()).taskLists && (await tlRes.json()).taskLists.length > 0) {
      setTaskListId((await tlRes.json()).taskLists[0].id);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        projectId: id,
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        taskListId,
        estimatedHours: parseFloat(estimatedHours) || undefined,
        dueDate: dueDate || undefined,
        startDate: startDate || undefined,
        parentTaskId: parentTaskId || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/projects/${id}/tasks/${data.task.id}`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Detailed description of the task..."
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2">
              {["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"].map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2">
              {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Assignee</label>
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name || u.email}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Task List</label>
          <select value={taskListId} onChange={(e) => setTaskListId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2">
            {taskLists.map((tl) => (
              <option key={tl.id} value={tl.id}>{tl.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Estimated Hours</label>
            <input
              type="number"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 8"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !title}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
