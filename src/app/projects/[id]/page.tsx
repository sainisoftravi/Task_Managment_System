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

import ProjectDocumentsTab from "@/components/projects/project-documents-tab";
import ProjectPhasesTab from "@/components/projects/project-phases-tab";
import ProjectIssuesTab from "@/components/projects/project-issues-tab";
import ProjectForumsTab from "@/components/projects/project-forums-tab";
import ProjectUsersTab from "@/components/projects/project-users-tab";
import CreateTaskListModal from "@/components/projects/create-task-list-modal";
import TaskListChartView from "@/components/projects/task-list-chart-view";

export default function ProjectOverviewPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks" | "users" | "reports" | "documents" | "phases" | "issues" | "forums" | "time-logs" | "task-list" | "milestones">("tasks");
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "gantt" | "wbs">("list");
  const [showCreateTaskListModal, setShowCreateTaskListModal] = useState(false);

  const headers = getAuthHeaders();

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`, { headers });
      if (res.ok) {
        const data = await res.json();
        const proj = data.project;
        if (proj) {
          setProject(proj);
          const allTasks: Task[] = proj.tasks || [];
          setTasks(allTasks);
          setDependencies(proj.dependencies || extractDeps(allTasks));
          setTaskLists(proj.taskLists || []);
          setMilestones(proj.milestones || []);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend project API fetch error, checking local storage:", e);
    }

    // LocalStorage Fallback for user-created custom projects
    try {
      const customProjects: Project[] = JSON.parse(localStorage.getItem("user_custom_projects") || "[]");
      const found = customProjects.find(
        (p) =>
          p.id === id ||
          p.key === id ||
          (p.id && p.id.toLowerCase() === id.toLowerCase()) ||
          (p.key && p.key.toLowerCase() === id.toLowerCase())
      );

      if (found) {
        setProject(found);
        // Load custom tasks for this project
        const customTasks: Task[] = JSON.parse(
          localStorage.getItem(`user_custom_tasks_${found.id}`) || localStorage.getItem("user_custom_tasks") || "[]"
        );
        const matchingTasks = customTasks.filter(
          (t) => !t.projectId || t.projectId === found.id || t.projectId === id
        );
        setTasks(matchingTasks);
        setDependencies(extractDeps(matchingTasks));

        // Load custom task lists for this project
        const storedLists = JSON.parse(localStorage.getItem(`custom_task_lists_${found.id}`) || "[]");
        const defaultLists: TaskList[] = [
          { id: `tl-gen-${found.id}`, name: "General Tasks", projectId: found.id, sortOrder: 1, createdAt: new Date().toISOString(), tasks: [] } as any,
          { id: `tl-[#0070BA]-${found.id}`, name: "Development & Engineering", projectId: found.id, sortOrder: 2, createdAt: new Date().toISOString(), tasks: [] } as any,
        ];
        const rawFound = found as any;
        setTaskLists(storedLists.length > 0 ? storedLists : rawFound.taskLists && rawFound.taskLists.length > 0 ? rawFound.taskLists : defaultLists);
        setMilestones(rawFound.milestones || []);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("LocalStorage project lookup error:", err);
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
      {/* Top Project Sub-Header Bar */}
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

        {/* Horizontal Navigation Tabs */}
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
            onClick={() => setActiveTab("phases")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "phases" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Phases
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "issues" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Issues
          </button>
          <button
            onClick={() => setActiveTab("task-list")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "task-list" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Task List
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "milestones" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Milestones
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
            onClick={() => setActiveTab("forums")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "forums" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Forums
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
            onClick={() => setActiveTab("users")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "users" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Users
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

      {activeTab === "documents" && (
        <ProjectDocumentsTab project={project} />
      )}

      {activeTab === "phases" && (
        <ProjectPhasesTab project={project} milestones={milestones} />
      )}

      {activeTab === "issues" && (
        <ProjectIssuesTab project={project} />
      )}

      {activeTab === "forums" && (
        <ProjectForumsTab project={project} />
      )}

      {activeTab === "users" && (
        <ProjectUsersTab project={project} />
      )}

      {activeTab === "task-list" && (
        <div className="space-y-6 font-sans">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Task Lists & Milestone Progress</h3>
              <p className="text-xs text-slate-500">Group tasks by milestones, manage internal/external flags, and monitor completion progress</p>
            </div>

            <button
              onClick={() => setShowCreateTaskListModal(true)}
              className="rounded-md bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              + Add Task List
            </button>
          </div>

          <TaskListChartView />

          <ListView
            tasks={tasks}
            taskLists={taskLists}
            headers={headers}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        </div>
      )}

      {/* Create Task List Modal */}
      <CreateTaskListModal
        isOpen={showCreateTaskListModal}
        onClose={() => setShowCreateTaskListModal(false)}
        onSuccess={(newList) => {
          const updated = [newList, ...taskLists];
          setTaskLists(updated);
          try {
            const customLists = JSON.parse(localStorage.getItem("custom_task_lists") || "[]");
            localStorage.setItem("custom_task_lists", JSON.stringify([newList, ...customLists]));
          } catch {}
          setShowCreateTaskListModal(false);
          alert(`Task List '${newList.name}' created and added successfully!`);
        }}
      />

      {activeTab === "time-logs" && (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Project Time Logs ({project.name})</h2>
              <p className="text-xs text-slate-500">Track task and issue log hours specifically for this project</p>
            </div>

            <button
              onClick={() => {
                const columns = ["Date", "User", "Task / Issue", "Billing Type", "Approval Status", "Logged Hours"];
                const exportRows = [
                  {
                    "Date": "22-12-2025",
                    "User": "Ravi Saini",
                    "Task / Issue": "02 Project Master Excel",
                    "Billing Type": "Billable",
                    "Approval Status": "Approved",
                    "Logged Hours": "01:00 hrs"
                  }
                ];

                const headerRow = columns.join(",");
                const bodyRows = exportRows.map((row) =>
                  columns.map((col) => `"${String((row as any)[col] || "").replace(/"/g, '""')}"`).join(",")
                );
                const csvContent = "\uFEFF" + [headerRow, ...bodyRows].join("\n");

                const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `project_time_logs_${project.name.replace(/\s+/g, "_")}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5 text-slate-600" />
              <span>Export Project Time Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Task / Issue</th>
                  <th className="py-2.5 px-3 text-center">Billing Type</th>
                  <th className="py-2.5 px-3 text-center">Approval Status</th>
                  <th className="py-2.5 px-3 text-right">Logged Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr className="hover:bg-blue-50/20">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">22-12-2025</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Ravi Saini</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">02 Project Master Excel</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Billable
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">01:00 hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
