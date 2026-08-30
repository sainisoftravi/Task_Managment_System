"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, ProjectStatus } from "@/types";
import { Plus, Calendar, Users, TrendingUp, Search, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUSES: { id: ProjectStatus; name: string }[] = [
  { id: "PLANNING", name: "Planning" },
  { id: "ACTIVE", name: "Active" },
  { id: "ON_HOLD", name: "On Hold" },
  { id: "COMPLETED", name: "Completed" },
  { id: "ARCHIVED", name: "Archived" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/projects", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
    }
    setLoading(false);
  }

  async function createProject() {
    if (!newName || !newStartDate) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: newName,
        startDate: newStartDate,
        dueDate: newDueDate || undefined,
      }),
    });
    if (res.ok) {
      await fetchProjects();
      setShowNewForm(false);
      setNewName("");
      setNewStartDate("");
      setNewDueDate("");
    }
  }

  const filtered = statusFilter === "ALL"
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "ALL")}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500"
        >
          <option value="ALL">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Plus className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2 text-slate-600">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-medium text-slate-500">{project.key}</span>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-primary-700">{project.name}</h3>
                  {project.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.description}</p>}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === "ACTIVE" ? "bg-blue-100 text-blue-800" :
                  project.status === "PLANNING" ? "bg-slate-100 text-slate-800" :
                  project.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                  project.status === "ON_HOLD" ? "bg-amber-100 text-amber-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {project.dueDate ? formatDate(project.dueDate) : "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.owner ? (project.owner.name || project.owner.email) : "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Create Project</h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
              />
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
              />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowNewForm(false)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newName || !newStartDate}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
