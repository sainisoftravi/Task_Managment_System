"use client"

import { useState } from "react";
import { Task, TaskList, Milestone, Project } from "@/types";
import { ChevronDown, ChevronRight, Plus, Calendar, User, CheckCircle2, Circle, Clock } from "lucide-react";
import { colorForPriority, colorForStatus, formatDate } from "@/lib/utils";

interface WBSViewProps {
  projectId: string;
  tasks: Task[];
  taskLists: TaskList[];
  milestones: Milestone[];
  headers: Record<string, string>;
}

export function WBSView({ projectId, tasks, taskLists, milestones, headers }: WBSViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskListName, setNewTaskListName] = useState("");

  const toggleNode = (id: string) => {
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNodes(newSet);
  };

  const tasksByList = (taskListId: string) => tasks.filter((t) => t.taskListId === taskListId);

  const handleAddTaskList = async () => {
    if (!newTaskListName.trim()) return;
    await fetch("/api/task-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ projectId, name: newTaskListName }),
    });
    setNewTaskListName("");
    window.location.reload();
  };

  const handleAddTask = async (taskListId: string) => {
    if (!newTaskTitle.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ projectId, title: newTaskTitle, taskListId }),
    });
    setNewTaskTitle("");
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Work Breakdown Structure</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="+ New Task List"
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTaskList()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {taskLists.map((list) => {
          const isExpanded = expandedNodes.has(list.id);
          const listTasks = tasksByList(list.id);
          const completedCount = listTasks.filter((t) => t.status === "DONE").length;

          return (
            <div key={list.id} className="rounded-lg border border-slate-200 bg-white">
              <div
                className="flex cursor-pointer items-center gap-2 p-3"
                onClick={() => toggleNode(list.id)}
              >
                <button className="text-slate-500 hover:text-slate-700">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <span className="font-medium text-slate-900">{list.name}</span>
                <span className="text-xs text-slate-500">
                  ({completedCount}/{listTasks.length} done)
                </span>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 px-4 py-2 space-y-1">
                  {listTasks.map((task) => (
                    <TaskRow key={task.id} task={task} level={1} headers={headers} expandedNodes={expandedNodes} toggleNode={toggleNode} />
                  ))}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="+ Add task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTask(list.id)}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {taskLists.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            <p>No task lists yet. Create one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  level,
  headers,
  expandedNodes,
  toggleNode,
}: {
  task: Task;
  level: number;
  headers: Record<string, string>;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
}) {
  const isExpanded = expandedNodes.has(task.id);
  const hasChildren = task.subtasks && task.subtasks.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 ${level === 1 ? "" : "ml-6 border-l-2 border-slate-100 pl-2"}`}
      >
        {hasChildren && (
          <button
            onClick={() => toggleNode(task.id)}
            className="text-slate-500 hover:text-slate-700"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        {task.status === "DONE" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <Circle className="h-4 w-4 text-slate-400" />
        )}

        <span className="text-sm font-medium text-slate-900">{task.title}</span>

        <span className={`text-xs ${colorForPriority(task.priority)}`}>
          {task.priority}
        </span>

        {task.assignee && (
          <span className="text-xs text-slate-500">
            <User className="h-3 w-3 inline mr-1" />
            {task.assignee.name || task.assignee.email}
          </span>
        )}

        {task.dueDate && (
          <span className="text-xs text-slate-500">
            <Calendar className="h-3 w-3 inline mr-1" />
            {formatDate(task.dueDate)}
          </span>
        )}

        {(task.estimatedHours || task.loggedHours) && (
          <span className="text-xs text-slate-500">
            <Clock className="h-3 w-3 inline mr-1" />
            {task.loggedHours ?? 0}/{task.estimatedHours ?? 0}h
          </span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-6 pl-2">
          {task.subtasks.map((child) => (
            <TaskRow
              key={child.id}
              task={child as Task}
              level={level + 1}
              headers={headers}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
