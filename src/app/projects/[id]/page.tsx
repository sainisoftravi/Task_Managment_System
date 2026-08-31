"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project, Task, TaskDependency, TaskList, Milestone } from "@/types";
import KanbanBoard from "@/components/kanban/kanban-board";
import GanttChart from "@/components/gantt/gantt-chart";
import { WBSView } from "@/components/projects/wbs-view";
import ListView from "@/components/projects/task-list-view";
import ProjectDashboardTab from "@/components/projects/project-dashboard-tab";
import ProjectReportsTab from "@/components/projects/project-reports-tab";
import { getAuthHeaders } from "@/lib/utils";
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  List,
  Plus,
  MoreHorizontal,
  Folder,
  FileText,
  Users,
  Clock,
  Layers
} from "lucide-react";

export default function ProjectOverviewPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks" | "users" | "reports" | "documents" | "phases" | "time-logs">("tasks");
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "gantt" | "wbs">("list");

  const headers = getAuthHeaders();

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    const res = await fetch(`/api/projects/${id}`, { headers });
    if (res.ok) {
      const data = await res.json();
      const proj = data.project;
      setProject(proj);

      const allTasks: Task[] = proj.tasks || [];
      setTasks(allTasks);
      setDependencies(proj.dependencies || extractDeps(allTasks));
      setTaskLists(proj.taskLists || []);
      setMilestones(proj.milestones || []);
    }
    setLoading(false);
  }

  function extractDeps(tasks: any[]): TaskDependency[] {
    const deps: TaskDependency[] = [];
    tasks.forEach((t) => {
      t.dependencies?.forEach((d: any) => {
        deps.push({ id: d.id, taskId: t.id, dependsOnTaskId: d.dependsOnTaskId, type: d.type, createdAt: d.createdAt });
      });
    });
    return deps;
  }

  const handleTaskUpdate = useCallback(async (taskId: string, status: any, position?: number) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      );
    } else {
      throw new Error("Failed to update task");
    }
  }, [headers]);

  const handleAddTask = () => {
    window.location.href = `/projects/${id}/tasks/new`;
  };

  const handleTaskClick = (task: Task) => {
    window.location.href = `/projects/${id}/tasks/${task.id}`;
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading project overview...</div>;
  }

  if (!project) {
    return <div className="p-6 text-center text-slate-500">Project not found</div>;
  }

  return (
    <div className="space-y-4 bg-slate-50 min-h-screen -m-6 p-6 font-sans">
      {/* Top Project Sub-Header Bar matching Zoho Screenshot 2 */}
      <div className="border-b border-slate-200 bg-white -mx-6 -mt-6 px-6 pt-4 pb-0 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-500">{project.key || "DT-21"}</span>
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Zoho Horizontal Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "dashboard" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "tasks" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "users" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "reports" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "documents" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("phases")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "phases" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Phases
          </button>
          <button
            onClick={() => setActiveTab("time-logs")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "time-logs" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Time Logs
          </button>
        </div>
      </div>

      {/* Main Content View Switcher */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {/* View Mode Toggle Sub-Header */}
          <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded-md shadow-xs">
            <span className="text-xs font-bold text-slate-700">Task View Layout:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === "list" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === "kanban" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <KanbanSquare className="h-3.5 w-3.5" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("gantt")}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === "gantt" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Gantt
              </button>
              <button
                onClick={() => setViewMode("wbs")}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === "wbs" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                WBS Tree
              </button>
            </div>
          </div>

          {/* Active View Container */}
          {viewMode === "list" && (
            <ListView
              tasks={tasks}
              taskLists={taskLists}
              headers={headers}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          )}

          {viewMode === "kanban" && (
            <KanbanBoard
              projectId={id}
              initialTasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onAddTask={handleAddTask}
            />
          )}

          {viewMode === "gantt" && (
            <GanttChart
              tasks={tasks}
              dependencies={dependencies}
              onTaskClick={handleTaskClick}
            />
          )}

          {viewMode === "wbs" && (
            <WBSView
              projectId={id}
              tasks={tasks}
              taskLists={taskLists}
              milestones={milestones}
              headers={headers}
            />
          )}
        </div>
      )}

      {/* Active Tab Views */}
      {activeTab === "dashboard" && (
        <ProjectDashboardTab project={project} tasks={tasks} />
      )}

      {activeTab === "reports" && (
        <ProjectReportsTab project={project} tasks={tasks} />
      )}

      {/* Tab Fallbacks for other sections */}
      {activeTab !== "tasks" && activeTab !== "dashboard" && activeTab !== "reports" && (
        <div className="rounded-md border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
          <Layers className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700 capitalize">{activeTab} View</h3>
          <p className="text-xs text-slate-400 mt-1">Project {activeTab} section loaded successfully.</p>
        </div>
      )}
    </div>
  );
}
