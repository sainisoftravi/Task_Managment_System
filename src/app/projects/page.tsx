"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import {
  Plus,
  Search,
  Filter,
  List as ListIcon,
  Kanban as KanbanIcon,
  Sparkles,
  ChevronDown,
  User,
  Calendar,
  ArrowUpDown,
  LayoutGrid,
  Download,
  Lock,
  Globe,
  Archive,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Palette,
  Edit,
  Mail,
  Layers,
  Eye,
  SlidersHorizontal,
  Tag
} from "lucide-react";
import { formatDate, getNextSequentialProjectKey } from "@/lib/utils";

import ProjectGanttView from "@/components/projects/project-gantt-view";
import TemplateGalleryModal from "@/components/projects/template-gallery-modal";
import NewProjectFormModal from "@/components/projects/new-project-form-modal";
import ProjectDetailDrawer from "@/components/projects/project-detail-drawer";
import ProjectColorPickerModal from "@/components/projects/project-color-picker-modal";
import ProjectLayoutSwitcherModal from "@/components/projects/project-layout-switcher-modal";

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-dt-31",
    key: "DT-31",
    name: "07 Command Center Automation",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u2", name: "Divakar Pandiy", email: "divakar@taskpmp.local" } as any,
    _count: { tasks: 1, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-07-01" as any,
    dueDate: "2026-08-31" as any,
    tags: ["Automation", "CommandCenter"],
  } as any,
  {
    id: "proj-dt-30",
    key: "DT-30",
    name: "06 Monthly Miscellaneous Tasks",
    status: "ACTIVE",
    pct: 45,
    owner: { id: "u1", name: "Ravi Saini", email: "ravi@taskpmp.local" } as any,
    _count: { tasks: 18, milestones: 0, timeLogs: 5 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-01-01" as any,
    dueDate: "2029-12-31" as any,
    tags: ["Operations", "Monthly"],
  } as any,
  {
    id: "proj-dt-21",
    key: "DT-21",
    name: "01 PoC Projects",
    status: "ACTIVE",
    pct: 77,
    owner: { id: "u3", name: "Sushil Verma", email: "sushil@taskpmp.local" } as any,
    _count: { tasks: 15, milestones: 0, timeLogs: 8 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2025-11-01" as any,
    dueDate: "2031-11-30" as any,
    tags: ["PoC", "Enterprise"],
  } as any,
  {
    id: "proj-dt-03",
    key: "DT-03",
    name: "03 data demo",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 4, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-01" as any,
    dueDate: "2026-12-31" as any,
    tags: ["Demo"],
  } as any,
  {
    id: "proj-dt-01",
    key: "DT-01",
    name: "01 Demo",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 3, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-15" as any,
    dueDate: "2026-11-30" as any,
    tags: ["Demo"],
  } as any,
  {
    id: "proj-dt-02",
    key: "DT-02",
    name: "01 Demo Test Project Creation",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 0, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-31" as any,
    dueDate: "2027-01-07" as any,
    tags: ["Testing"],
  } as any,
  {
    id: "proj-dt-04",
    key: "DT-04",
    name: "dsdd",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 0, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-31" as any,
    dueDate: "2027-01-07" as any,
  } as any,
  {
    id: "proj-dt-05",
    key: "DT-05",
    name: "demo",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 0, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-31" as any,
    dueDate: "2027-01-07" as any,
  } as any,
  {
    id: "proj-dt-06",
    key: "DT-06",
    name: "01 Demo Project Test",
    status: "ACTIVE",
    pct: 0,
    owner: { id: "u1", name: "Admin User", email: "admin@taskpmp.local" } as any,
    _count: { tasks: 0, milestones: 0, timeLogs: 0 },
    budgetVariance: "+$0 (Surplus)",
    startDate: "2026-08-31" as any,
    dueDate: "2027-01-07" as any,
  } as any,
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Header Tabs: Active Projects, Project Templates, Project Groups, Public Projects, Archived Projects
  const [topTab, setTopTab] = useState<"ACTIVE" | "TEMPLATES" | "GROUPS" | "PUBLIC" | "ARCHIVED">("ACTIVE");
  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState<"LIST" | "KANBAN" | "GANTT">("LIST");
  
  // 3-Step Workflow State: 'table_view' | 'gallery_modal' | 'form_modal'
  const [workflowState, setWorkflowState] = useState<"table_view" | "gallery_modal" | "form_modal">("table_view");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("BLANK");

  // Context Action Modals & Drawers
  const [activeProjectMenuId, setActiveProjectMenuId] = useState<string | null>(null);
  const [detailDrawerProject, setDetailDrawerProject] = useState<Project | null>(null);
  const [colorModalProject, setColorModalProject] = useState<Project | null>(null);
  const [layoutModalProject, setLayoutModalProject] = useState<Project | null>(null);
  const [projectAccentColors, setProjectAccentColors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProjects();
    const handleSync = () => fetchProjects();
    window.addEventListener("focus", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  async function fetchProjects() {
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("deleted_project_ids") || "[]");
    } catch {}

    let customProjects: Project[] = [];
    try {
      customProjects = JSON.parse(localStorage.getItem("user_custom_projects") || "[]");
    } catch {}

    const token = localStorage.getItem("token");
    let loaded: Project[] = [];
    try {
      const res = await fetch("/api/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        loaded = data.projects || [];
      }
    } catch {}

    const allMap = new Map<string, Project>();
    [...customProjects, ...loaded, ...DEFAULT_PROJECTS].forEach((p) => {
      if (p && p.id && !allMap.has(p.id)) {
        allMap.set(p.id, p);
      }
    });

    const combined = Array.from(allMap.values());
    const filtered = combined.filter((p) => !deletedIds.includes(p.id) && (!p.key || !deletedIds.includes(p.key)));
    setProjects(filtered);
    setLoading(false);
  }

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
    alert(`Project '${newProject.name}' created successfully!`);
    setWorkflowState("table_view");
  };

  const handleCopyLink = (proj: Project) => {
    const directUrl = `${window.location.origin}/projects/${proj.id}`;
    navigator.clipboard?.writeText(directUrl);
    alert(`Project link copied to clipboard!\n${directUrl}`);
    setActiveProjectMenuId(null);
  };

  const handleMoveToArchive = async (proj: Project) => {
    if (confirm(`Move project '${proj.name}' to Archived Projects?`)) {
      try {
        const deletedIds = JSON.parse(localStorage.getItem("deleted_project_ids") || "[]");
        if (!deletedIds.includes(proj.id)) deletedIds.push(proj.id);
        if (proj.key && !deletedIds.includes(proj.key)) deletedIds.push(proj.key);
        localStorage.setItem("deleted_project_ids", JSON.stringify(deletedIds));
      } catch {}

      setProjects((prev) => prev.filter((p) => p.id !== proj.id && p.key !== proj.key));
      const token = localStorage.getItem("token");
      await fetch(`/api/projects/${proj.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {});
      alert(`Project '${proj.name}' moved to Archive.`);
      setActiveProjectMenuId(null);
    }
  };

  const filtered = projects.filter((p) => {
    if (!p) return false;
    const matchesTab =
      topTab === "ACTIVE"
        ? p.status !== "ARCHIVED"
        : topTab === "ARCHIVED"
        ? p.status === "ARCHIVED"
        : topTab === "PUBLIC"
        ? true
        : true;
    const nameMatch = (p.name || "").toLowerCase().includes(search.toLowerCase());
    const keyMatch = (p.key || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && (nameMatch || keyMatch);
  });

  return (
    <div className="space-y-4 bg-slate-50 min-h-screen -m-6 p-6 font-sans">
      
      {/* Step 1: Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={workflowState === "gallery_modal"}
        onClose={() => setWorkflowState("table_view")}
        onSelectTemplate={(tplId) => setSelectedTemplateId(tplId)}
        onProceedToForm={() => setWorkflowState("form_modal")}
      />

      {/* Step 2: New Project Detailed Form Modal */}
      <NewProjectFormModal
        isOpen={workflowState === "form_modal"}
        onClose={() => setWorkflowState("table_view")}
        onBrowseTemplates={() => setWorkflowState("gallery_modal")}
        onProjectCreated={handleProjectCreated}
        existingProjects={projects}
        selectedTemplateId={selectedTemplateId}
      />

      {/* Step 4 Context Action Drawers & Modals */}
      <ProjectDetailDrawer
        project={detailDrawerProject}
        isOpen={!!detailDrawerProject}
        onClose={() => setDetailDrawerProject(null)}
      />

      <ProjectColorPickerModal
        project={colorModalProject}
        isOpen={!!colorModalProject}
        onClose={() => setColorModalProject(null)}
        onColorSelected={(colorHex) => {
          if (colorModalProject) {
            setProjectAccentColors((prev) => ({ ...prev, [colorModalProject.id]: colorHex }));
          }
        }}
      />

      <ProjectLayoutSwitcherModal
        project={layoutModalProject}
        isOpen={!!layoutModalProject}
        onClose={() => setLayoutModalProject(null)}
        onLayoutChanged={(newLayout) => {
          if (layoutModalProject) {
            alert(`Project '${layoutModalProject.name}' layout changed to '${newLayout}'`);
          }
        }}
      />

      {/* Step 3: Top Navigation Bar & Tabs */}
      <div className="border-b border-slate-200 bg-white -mx-6 -mt-6 px-6 pt-4 pb-0 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-slate-900">Projects</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWorkflowState("gallery_modal")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0066FF]/30 bg-blue-50/60 px-3.5 py-2 text-xs font-bold text-[#0066FF] hover:bg-blue-100/60 transition-colors cursor-pointer"
            >
              <LayoutGrid className="h-4 w-4 text-[#0066FF]" />
              <span>Browse Templates</span>
            </button>

            <button
              onClick={() => setWorkflowState("gallery_modal")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Top Header Tabs matching Screenshot 1 */}
        <div className="flex gap-6 border-b border-slate-200">
          {[
            { key: "ACTIVE", label: "Active Projects" },
            { key: "TEMPLATES", label: "Project Templates" },
            { key: "GROUPS", label: "Project Groups" },
            { key: "PUBLIC", label: "Public Projects" },
            { key: "ARCHIVED", label: "Archived Projects" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTopTab(tab.key as any)}
              className={`pb-2.5 text-xs font-extrabold border-b-2 transition-colors cursor-pointer ${
                topTab === tab.key
                  ? "border-[#0066FF] text-[#0066FF]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Header Toolbar Controls (All Projects ▾, Search, List/Kanban/Gantt, Automation) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer">
              <span>All Projects</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs focus:border-[#0066FF] focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5 shadow-xs">
            <button
              onClick={() => setViewType("LIST")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewType === "LIST" ? "bg-[#0066FF] text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewType("KANBAN")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewType === "KANBAN" ? "bg-[#0066FF] text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KanbanIcon className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType("GANTT")}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewType === "GANTT" ? "bg-[#0066FF] text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Gantt</span>
            </button>
          </div>

          <button
            onClick={() => alert("Task & Project Workflow Rules Automation")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold text-[#0066FF] hover:bg-blue-100 cursor-pointer shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
            <span>Automation</span>
          </button>

          <button
            onClick={() => setWorkflowState("gallery_modal")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </button>

          <button className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Step 3: Main Data Table / List View */}
      {viewType === "GANTT" ? (
        <ProjectGanttView projects={filtered} onProjectClick={() => {}} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">···</th>
                  <th className="py-3 px-4 w-20">ID</th>
                  <th className="py-3 px-4 min-w-[200px]">Project Name</th>
                  <th className="py-3 px-4 text-center w-16">%</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-center w-24">Status</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4 text-center">Phases</th>
                  <th className="py-3 px-4 text-center">Issues</th>
                  <th className="py-3 px-4 text-right">Start Date</th>
                  <th className="py-3 px-4 text-right">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 font-semibold">
                      Loading enterprise projects...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400 font-semibold">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((project, idx) => {
                    const ownerName = project.owner?.name || "Ravi Saini";
                    const ownerInitials = ownerName.substring(0, 2).toUpperCase();
                    const tasksTotal = (project as any)._count?.tasks || (project.tasks ? project.tasks.length : 0);
                    const progressPct = (project as any).pct !== undefined ? (project as any).pct : 0;
                    const isProjectMenuOpen = activeProjectMenuId === project.id;
                    const customAccent = projectAccentColors[project.id];

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      >
                        {/* Step 4 Context Action 3-Dots Button */}
                        <td className="py-3.5 px-3 text-center relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProjectMenuId(isProjectMenuOpen ? null : project.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Step 4 Context Menu (3-Dots Dropdown) matching Screenshot 2 */}
                          {isProjectMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-6 top-2 z-50 w-60 rounded-xl bg-white p-1.5 shadow-2xl border border-slate-200 text-xs font-semibold text-slate-800 text-left animate-fadeIn divide-y divide-slate-100"
                            >
                              <div className="py-1 space-y-0.5">
                                {/* 1. Access Project */}
                                <Link
                                  href={`/projects/${project.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0066FF] cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Access Project</span>
                                </Link>

                                {/* 2. Access Project in New Tab */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/projects/${project.id}`, "_blank");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0066FF] cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Access Project In New Tab</span>
                                </button>

                                {/* 3. View Details */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailDrawerProject(project);
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0066FF] cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-600" />
                                  <span>View Details</span>
                                </button>

                                {/* 4. View Details in New Tab */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/projects/${project.id}`, "_blank");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0066FF] cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                                  <span>View Details In New Tab</span>
                                </button>

                                {/* 5. Copy Link */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyLink(project);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0066FF] cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Copy Link</span>
                                </button>
                              </div>

                              <div className="py-1 space-y-0.5">
                                {/* 6. Color */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setColorModalProject(project);
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-teal-600 cursor-pointer"
                                >
                                  <Palette className="h-3.5 w-3.5 text-teal-600" />
                                  <span>Color</span>
                                </button>
                              </div>

                              <div className="py-1 space-y-0.5">
                                {/* 7. Edit Project */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTemplateId("BLANK");
                                    setWorkflowState("form_modal");
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Edit className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Edit Project</span>
                                </button>

                                {/* 8. Email Alias */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`Project Inbound Email Alias:\nproject-${project.key?.toLowerCase() || "dt31"}@taskpmp.local`);
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Mail className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Email Alias</span>
                                </button>

                                {/* 9. Change Layouts */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLayoutModalProject(project);
                                    setActiveProjectMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                  <Layers className="h-3.5 w-3.5 text-slate-600" />
                                  <span>Change Layouts</span>
                                </button>
                              </div>

                              <div className="py-1">
                                {/* 10. Move to Archive / Trash */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveToArchive(project);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-500 font-bold cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                  <span>Move to Archive / Trash</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ID Column */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {project.key || `DT-${31 - idx}`}
                        </td>

                        {/* Project Name Column with Custom Color Accent */}
                        <td className="py-3.5 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: customAccent || "#0066FF" }}
                            />
                            <Link
                              href={`/projects/${project.id}`}
                              className="text-xs font-bold text-slate-900 hover:text-[#0066FF] transition-colors"
                            >
                              {project.name}
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
                            <div className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 font-bold text-[10px] flex items-center justify-center border border-amber-300 shadow-2xs">
                              {ownerInitials}
                            </div>
                            <span className="text-slate-800 font-semibold">{ownerName}</span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-[#00C49F] text-white shadow-2xs">
                            Active
                          </span>
                        </td>

                        {/* Tasks Column */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-slate-600 font-semibold">
                            {tasksTotal === 0 ? "No Tasks" : `${tasksTotal} Tasks (${progressPct}%)`}
                          </span>
                        </td>

                        {/* Phases Column */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                            No Phases
                          </span>
                        </td>

                        {/* Issues Column */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                            No Issues
                          </span>
                        </td>

                        {/* Start Date Column */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-[11px]">
                          {project.startDate ? formatDate(project.startDate) : "01-09-2026"}
                        </td>

                        {/* End Date Column */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-[11px]">
                          {project.dueDate ? formatDate(project.dueDate) : "30-09-2026"}
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
    </div>
  );
}
