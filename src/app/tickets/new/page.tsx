"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TicketPriority,
  TicketStatus,
  Customer,
  User,
  Project,
} from "@/types";
import { getAuthHeaders } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "CLOSED"];

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [status, setStatus] = useState<TicketStatus>("OPEN");
  const [category, setCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    const headers = getAuthHeaders();
    const [custRes, userRes, projRes] = await Promise.all([
      fetch("/api/customers", { headers }).catch(() => ({ ok: false, json: async () => ({ customers: [] }) })),
      fetch("/api/users", { headers }).catch(() => ({ ok: false, json: async () => ({ users: [] }) })),
      fetch("/api/projects", { headers }),
    ]);
    setCustomers((await custRes.json()).customers ?? []);
    setUsers((await userRes.json()).users ?? []);
    setProjects((await projRes.json()).projects ?? []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title,
        description,
        priority,
        status,
        category,
        assigneeId: assigneeId || undefined,
        projectId: projectId || undefined,
        dueDate: dueDate || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/tickets/${data.ticket.id}`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">New Ticket</h1>
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
          <label className="block text-sm font-medium text-slate-700">Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500">
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Billing, Technical, Account, etc."
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Assign to</label>
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name || u.email} ({u.role})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Project (optional)</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500">
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.key})</option>
            ))}
          </select>
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
            disabled={loading}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
