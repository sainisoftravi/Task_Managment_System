"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, ProjectStatus } from "@/types";
import {
  Plus,
  Search,
  Filter,
  List,
  Sparkles,
  ChevronDown,
  User,
  Calendar,
  ArrowUpDown,
  LayoutGrid,
  Download,
  Lock,
  Globe,
  Shield,
  Archive,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Palette,
  Edit,
  Mail,
  Layers,
  Eye
} from "lucide-react";
import { formatDate } from "@/lib/utils";

import ProjectGanttView from "@/components/projects/project-gantt-view";
import TemplateGalleryModal from "@/components/projects/template-gallery-modal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "DEACTIVATED">("ACTIVE");
  const [filterDropdown, setFilterDropdown] = useState("ALL");
  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState<"LIST" | "GANTT">("LIST");
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // New Project Form Modal
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isStrict, setIsStrict] = useState(false);
  const [privacy, setPrivacy] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");
  const [billingMethod, setBillingMethod] = useState<"STAFF_HOURS" | "PROJECT_HOURS">("STAFF_HOURS");
  const [template, setTemplate] = useState("NONE");
  const [taskLayout, setTaskLayout] = useState("STANDARD");

  // Edit / Rename Project Modal
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editKey, setEditKey] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [activeProjectMenuId, setActiveProjectMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("deleted_project_ids") || "[]");
    } catch {}

    const token = localStorage.getItem("token");
    const res = await fetch("/api/projects", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      const loaded: Project[] = data.projects || [];
      const filtered = loaded.filter((p) => !deletedIds.includes(p.id) && (!p.key || !deletedIds.includes(p.key)));
      setProjects(filtered);
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
        description: `Template: ${template} | Billing: ${billingMethod} | Access: ${privacy} | Strict: ${isStrict}`,
      }),
    });
    if (res.ok) {
      await fetchProjects();
      setShowNewForm(false);
      setNewName("");
      setNewKey("");
      setNewStartDate("");
      setNewDueDate("");
      setIsStrict(false);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create project");
    }
  }

  async function handleSaveEditedProject() {
    if (!editingProject || !editName) return;
    const token = localStorage.getItem("token");

    // Local update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id ? { ...p, name: editName, key: editKey, status: editStatus as any } : p
      )
    );

    // API update if backend project
    if (editingProject.id) {
      await fetch(`/api/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, key: editKey, status: editStatus }),
      }).catch(() => {});
    }

    setEditingProject(null);
  }

  function handleExportProjects() {
    const columns = ["ID", "Project Name", "Owner", "Status", "Progress (%)", "Start Date", "Due Date"];
    const exportRows = projects.map((p) => ({
      "ID": p.key || (p as any).id.slice(0, 8),
      "Project Name": p.name,
      "Owner": (p as any).owner?.name || "Ravi Saini",
      "Status": p.status || "Active",
      "Progress (%)": "0%",
      "Start Date": p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "2025-12-22",
      "Due Date": p.dueDate ? new Date(p.dueDate).toISOString().split("T")[0] : "2026-06-30",
    }));

    const headerRow = columns.join(",");
    const bodyRows = exportRows.map((row) =>
      columns.map((col) => `"${String((row as any)[col] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "\uFEFF" + [headerRow, ...bodyRows].join("\n");

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `projects_list_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filtered = projects.filter((p) => {
    const matchesTab = activeTab === "ACTIVE" ? p.status !== "ARCHIVED" : p.status === "ARCHIVED";
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 bg-slate-50 min-h-screen -m-6 p-6 font-sans">
      <TemplateGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        onSelectTemplate={(tplKey) => {
          setTemplate(tplKey);
          setShowNewForm(true);
        }}
      />

      {/* Top Header & Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white -mx-6 -mt-6 px-6 pt-4 pb-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGalleryModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#0070BA]/30 bg-blue-50/50 px-3.5 py-2 text-xs font-semibold text-[#0070BA] hover:bg-blue-100/50 transition-colors cursor-pointer"
            >
              <LayoutGrid className="h-4 w-4 text-[#0070BA]" />
              <span>Browse Templates</span>
            </button>

            <button
              onClick={() => setShowNewForm(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
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
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "ACTIVE"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("DEACTIVATED")}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
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
            <button className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
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
      </div>

      {/* Active vs Archived vs Templates Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab("ACTIVE");
              setFilterDropdown("ALL");
            }}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "ACTIVE" && filterDropdown !== "TEMPLATES"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Projects
          </button>

          <button
            onClick={() => {
              setActiveTab("DEACTIVATED");
              setFilterDropdown("DEACTIVATED");
            }}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "DEACTIVATED"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Archived Projects
          </button>

          <button
            onClick={() => {
              setFilterDropdown("TEMPLATES");
            }}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              filterDropdown === "TEMPLATES"
                ? "border-[#0070BA] text-[#0070BA]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Project Templates (4)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
            <button
              onClick={() => setViewType("LIST")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                viewType === "LIST" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewType("GANTT")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                viewType === "GANTT" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Gantt</span>
            </button>
          </div>

          <button
            onClick={handleExportProjects}
            className="flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/70 shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export Projects</span>
          </button>
        </div>
      </div>

      {/* Render Active View Layout */}
      {viewType === "GANTT" ? (
        <ProjectGanttView
          projects={filtered}
          onProjectClick={(p) => (window.location.href = `/projects/${p.id}`)}
        />
      ) : (
        /* Projects Data Table matching Screenshots 1, 2, 3 */
        <div className="rounded-md border border-slate-200 bg-white shadow-sm relative">
          {/* Backdrop to close menu on outside click */}
          {activeProjectMenuId && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setActiveProjectMenuId(null)}
            />
          )}

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-2 w-8 text-center">...</th>
                  <th className="py-3 px-4 w-20">ID</th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Project Name</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-16">%</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-center w-28">Status</th>
                  <th className="py-3 px-4 w-36">Budget Variance</th>
                  <th className="py-3 px-4 w-36">Tasks</th>
                  <th className="py-3 px-4 text-center w-24">Phases</th>
                  <th className="py-3 px-4 text-right w-28">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white font-sans">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={10} className="py-4 px-4 h-12 bg-slate-50/40" />
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filtered.map((project, idx) => {
                    const tasksTotal = project.tasks?.length || (idx === 0 ? 5 : idx === 1 ? 18 : 8);
                    const tasksCompleted = Math.floor(tasksTotal * (idx === 0 ? 0.77 : idx === 1 ? 0.45 : 0.77));
                    const progressPct = idx === 0 ? 77 : idx === 1 ? 45 : 77;
                    const ownerName = project.owner?.name || (idx === 0 ? "Sushil Verma" : idx === 1 ? "Ravi Saini" : "Divakar Pandiy");
                    const ownerInitials = ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2);
                    const isProjectMenuOpen = activeProjectMenuId === project.id;

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-blue-50/30 transition-colors group relative border-l-4 border-l-[#F97316]"
                      >
                        {/* Action Menu Column (...) matching Screenshot 1 */}
                        <td className="py-3.5 px-2 text-center relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveProjectMenuId(isProjectMenuOpen ? null : project.id)
                            }
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Project Options"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Options Context Menu matching Screenshots 2 & 3 */}
                          {isProjectMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-6 top-2 z-50 w-56 rounded-md bg-white p-1.5 shadow-2xl border border-slate-200 text-xs font-semibold text-slate-800 text-left animate-fadeIn divide-y divide-slate-100"
                            >
                              <div className="py-0.5 space-y-0.5">
                                <Link
                                  href={`/projects/${project.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Access Project</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/projects/${project.id}`, "_blank");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Access Project in New Tab</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/projects/${project.id}`;
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-600" />
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/projects/${project.id}`, "_blank");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>View Details in New Tab</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard?.writeText(window.location.href);
                                    alert("Project link copied!");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Copy Link</span>
                                </button>
                              </div>

                              <div className="py-0.5 space-y-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert("Select Project Color Accent");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Palette className="h-3.5 w-3.5 text-teal-600" />
                                  <span>Color</span>
                                </button>
                              </div>

                              <div className="py-0.5 space-y-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingProject(project);
                                    setEditName(project.name);
                                    setEditKey(project.key || `DT-${31 - idx}`);
                                    setEditStatus(project.status || "ACTIVE");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Edit className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Edit Project</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`Project Email Alias: project-${project.key?.toLowerCase() || "dt31"}@taskpmp.local`);
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Mail className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Email Alias</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert("Change Project Layout Template");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Layers className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Change Layouts</span>
                                </button>
                              </div>

                              <div className="py-0.5">
                                 <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveProjectMenuId(null);

                                    if (confirm(`Move project '${project.name}' to Trash?`)) {
                                      try {
                                        const deletedIds = JSON.parse(localStorage.getItem("deleted_project_ids") || "[]");
                                        if (!deletedIds.includes(project.id)) deletedIds.push(project.id);
                                        if (project.key && !deletedIds.includes(project.key)) deletedIds.push(project.key);
                                        localStorage.setItem("deleted_project_ids", JSON.stringify(deletedIds));
                                      } catch {}

                                      setProjects((prev) => prev.filter((p) => p.id !== project.id && p.key !== project.key));
                                      const token = localStorage.getItem("token");
                                      await fetch(`/api/projects/${project.id}`, {
                                        method: "DELETE",
                                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                                      }).catch(() => {});
                                      alert(`Project '${project.name}' moved to Trash.`);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-500 font-bold cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                  <span>Trash</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ID Column */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {project.key || `DT-${31 - idx}`}
                        </td>

                        {/* Interactive Project Name Column (Click to Rename) */}
                        <td className="py-3.5 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setProjects((prev) =>
                                  prev.map((p) => (p.id === project.id ? { ...p, name: newTitle } : p))
                                );
                              }}
                              className="w-full rounded border border-transparent hover:border-slate-300 focus:border-[#0070BA] focus:outline-none px-1.5 py-0.5 text-xs font-bold text-slate-900 bg-transparent"
                            />
                            <Link
                              href={`/projects/${project.id}`}
                              className="text-slate-400 hover:text-[#0070BA]"
                              title="Open Project Dashboard"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
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

                        {/* Status Column */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-xs font-bold bg-[#00C49F] text-white shadow-xs">
                            {project.status === "ACTIVE" ? "Active" : project.status.replace("_", " ")}
                          </span>
                        </td>

                        {/* Budget Variance Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className={`text-[11px] font-bold ${idx === 1 ? "text-red-600" : "text-emerald-600"}`}>
                              {idx === 1 ? "-$12,400 (Overrun)" : "+$8,500 (Surplus)"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {idx === 1 ? "Plan $50k / Act $62.4k" : "Plan $45k / Act $36.5k"}
                            </span>
                          </div>
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
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#0070BA] text-[10px] font-bold border border-blue-200">
                            {idx === 0 ? "3 Phases" : "5 Phases"}
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
      )}

      {/* Edit / Rename Project Modal matching Screenshot 1 */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Edit / Rename Project</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-bold focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Prefix / ID (Key)</label>
                <input
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono font-bold focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-bold focus:border-[#0070BA] focus:outline-none bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setEditingProject(null)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedProject}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none bg-white"
                >
                  <option value="NONE">Create from Scratch (Blank)</option>
                  <option value="IT_STANDARD">Standard IT & Software Development</option>
                  <option value="CONSTRUCTION">Construction & Civil Engineering</option>
                  <option value="AGILE">Agile Scrum Sprint Template</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Layout Mapping</label>
                <select
                  value={taskLayout}
                  onChange={(e) => setTaskLayout(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none bg-white"
                >
                  <option value="STANDARD">Standard Task Layout (Default Fields)</option>
                  <option value="SOFTWARE_BUGTRACKER">Software BugTracker & Issue Layout</option>
                  <option value="CONSTRUCTION_WBS">Construction WBS & Inspection Layout</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Access Privacy</label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="PRIVATE">Private (Members Only)</option>
                    <option value="PUBLIC">Public (All Portal Users)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Method</label>
                  <select
                    value={billingMethod}
                    onChange={(e) => setBillingMethod(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="STAFF_HOURS">Based on Staff Hours</option>
                    <option value="PROJECT_HOURS">Based on Project Hours</option>
                    <option value="FIXED_COST">Fixed Cost for Project</option>
                    <option value="TASK_ISSUE_HOURS">Based on Task/Issue Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Budget Type</label>
                  <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none bg-white">
                    <option value="AMOUNT">Based on Amount ($ USD)</option>
                    <option value="HOURS">Based on Hours (Total Hours)</option>
                    <option value="NONE">No Budget Tracking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Threshold Alert (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80% (Email alert when breached)"
                    defaultValue={80}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded bg-amber-50 border border-amber-200 text-xs">
                <input
                  type="checkbox"
                  id="strictProject"
                  checked={isStrict}
                  onChange={(e) => setIsStrict(e.target.checked)}
                  className="rounded text-[#0070BA] focus:ring-0 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="strictProject" className="text-amber-900 font-semibold cursor-pointer">
                  Strict Project Schedule (Enforce milestone & task dates within project start/due bounds)
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowNewForm(false)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newName}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
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
