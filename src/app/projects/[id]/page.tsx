"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project, Task, TaskDependency, TaskList, Milestone } from "@/types";
import KanbanBoard from "@/components/kanban/kanban-board";
import GanttChart from "@/components/gantt/gantt-chart";
import { WBSView } from "@/components/projects/wbs-view";
import ListView from "@/components/projects/task-list-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthHeaders } from "@/lib/utils";
import { LayoutDashboard, KanbanSquare, BarChart3, List, Plus, Search } from "lucide-react";

export default function ProjectOverviewPage() {
   const params = useParams<{ id: string }>();
   const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="p-6">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-6 text-center text-slate-500">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-600">Key: {project.key}</p>
        </div>
        <button
          onClick={() => (window.location.href = `/projects/${id}/tasks/new`)}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {project.description && <p className="text-slate-600">{project.description}</p>}

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-4 bg-slate-100 p-1">
          <TabsTrigger value="kanban" className="flex items-center gap-1">
            <KanbanSquare className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Gantt
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="wbs" className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            WBS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <KanbanBoard
            projectId={id}
            initialTasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onAddTask={handleAddTask}
          />
        </TabsContent>

        <TabsContent value="gantt">
          <GanttChart
            tasks={tasks}
            dependencies={dependencies}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="list">
          <ListView tasks={tasks} onTaskClick={handleTaskClick} headers={headers} />
        </TabsContent>

        <TabsContent value="wbs">
          <WBSView projectId={id} tasks={tasks} taskLists={taskLists} milestones={milestones} headers={headers} />
        </TabsContent>
      </Tabs>
    </div>
  );
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
