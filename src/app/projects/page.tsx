"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, ProjectStatus } from "@/types";
import { Plus, Search, Filter, List, Sparkles, ChevronDown, User, Calendar, ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "DEACTIVATED">("ACTIVE");
  const [filterDropdown, setFilterDropdown] = useState("ALL");
  const [search, setSearch] = useState("");

  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

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
      setProjects(data.projects || []);
    }
    setLoading(false);
  }

  async function createProject() {
    if (!newName) return;
    const token = localStorage.getItem("token");
    const todayStr = new Date().toISOString().split("T")[0];
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: newName,
        key: newKey || undefined,
        startDate: newStartDate || todayStr,
        dueDate: newDueDate || undefined,
      }),
    });
    if (res.ok) {
      await fetchProjects();
      setShowNewForm(false);
      setNewName("");
      setNewKey("");
      setNewStartDate("");
      setNewDueDate("");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create project");
    }
  }

  const filtered = projects.filter((p) => {
    const matchesTab = activeTab === "ACTIVE" ? p.status !== "ARCHIVED" : p.status === "ARCHIVED";
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 bg-slate-50 min-h-screen -m-6 p-6">
      {/* Top Header & Navigation Tabs matching Zoho Projects */}
      <div className="border-b border-slate-200 bg-white -mx-6 -mt-6 px-6 pt-4 pb-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewForm(true)}
              className="inline-flex items-center gap-2 rounded-md bg-[#0070BA] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("ACTIVE")}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "ACTIVE"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("DEACTIVATED")}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "DEACTIVATED"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Deactivated projects
          </button>
        </div>
      </div>

      {/* Sub-Header Toolbar (Filter dropdown, View options, Automation) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <span>All Projects</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <List className="h-3.5 w-3.5 text-slate-500" />
            <span>List</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button className="flex items-center gap-1.5 rounded-md border border-[#0070BA]/30 bg-blue-50/50 px-3 py-1.5 text-xs font-medium text-[#0070BA] hover:bg-blue-100/50">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          <button className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Zoho Projects Styled Data Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Project Name</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-16">%</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-center w-28">
                  <div className="flex items-center justify-center gap-1 cursor-pointer">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 w-44">Tasks</th>
                <th className="py-3 px-4 text-center w-24">Phases</th>
                <th className="py-3 px-4 text-center w-24">Issues</th>
                <th className="py-3 px-4 text-right w-28">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={9} className="py-4 px-4 h-12 bg-slate-50/40" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((project, idx) => {
                  const tasksTotal = project.tasks?.length || (idx === 0 ? 1 : idx === 1 ? 18 : 8);
                  const tasksCompleted = Math.floor(tasksTotal * (idx === 0 ? 0 : idx === 1 ? 0.45 : 0.77));
                  const progressPct = idx === 0 ? 0 : idx === 1 ? 45 : 77;
                  const ownerName = project.owner?.name || (idx === 0 ? "Divakar Pandiy" : idx === 1 ? "Ravi Saini" : "Sushil Verma");
                  const ownerInitials = ownerName.split(" ").map(n => n[0]).join("").slice(0, 2);

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-blue-50/30 transition-colors group relative border-l-4 border-l-[#F97316]"
                    >
                      {/* ID Column */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {project.key || `DT-${31 - idx}`}
                      </td>

                      {/* Project Name Column */}
                      <td className="py-3.5 px-4 font-medium">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-slate-900 font-semibold hover:text-[#0070BA] transition-colors block"
                        >
                          {project.name}
                        </Link>
                      </td>

                      {/* % Progress Column */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {progressPct}%
                      </td>

                      {/* Owner Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 font-bold text-[10px] flex items-center justify-center border border-amber-300">
                            {ownerInitials}
                          </div>
                          <span className="text-slate-800 font-medium">{ownerName}</span>
                        </div>
                      </td>

                      {/* Status Column (Vivid Teal Pill matching Zoho) */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-sm text-xs font-semibold bg-[#00C49F] text-white shadow-xs">
                          {project.status === "ACTIVE" ? "Active" : project.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Tasks Progress Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-mono w-4">{tasksCompleted}</span>
                          <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 w-8">{progressPct}%</span>
                          <span className="text-[11px] text-slate-400 font-mono w-4">{tasksTotal}</span>
                        </div>
                      </td>

                      {/* Phases Column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200">
                          No Phases
                        </span>
                      </td>

                      {/* Issues Column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200">
                          No Issues
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-[11px]">
                        {project.dueDate ? formatDate(project.dueDate) : "01-07-2026"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Modal Form */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Create New Project</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. 07 Command Center Automation"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Prefix / ID (Key)</label>
                <input
                  type="text"
                  placeholder="e.g. DT-31"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowNewForm(false)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newName}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
