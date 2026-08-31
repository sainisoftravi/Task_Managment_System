"use client";

import { useState } from "react";
import { Task, TaskList } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  ListTodo,
  User,
  Calendar,
  Filter,
  Plus,
  Sparkles,
  ChevronDown as DropdownIcon,
  ArrowUpDown,
  Search
} from "lucide-react";
import TaskDetailDrawer from "@/components/projects/task-detail-drawer";

interface ListViewProps {
  tasks: Task[];
  taskLists?: TaskList[];
  headers: Record<string, string>;
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void;
}

export default function ListView({ tasks, taskLists = [], headers, onTaskClick, onAddTask }: ListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [groupBy, setGroupBy] = useState<"TASK_LIST" | "NONE">("TASK_LIST");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedDrawerTask, setSelectedDrawerTask] = useState<Task | null>(null);

  // State to track collapsed/expanded groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groups: { name: string; tasks: Task[]; pct: number }[] = [
    { name: "01 RMG Cement Plant", tasks: filteredTasks.slice(0, 1), pct: 50 },
    { name: "02 JWIL Chennai", tasks: filteredTasks.slice(1, 2), pct: 75 },
    { name: "03 Dubai Taxi", tasks: filteredTasks.slice(2, 3), pct: 50 },
    { name: "04 Saudi Client Demonstration With Ganes...", tasks: filteredTasks.slice(3, 4), pct: 90 },
    { name: "98 Push Stream Setup to all PoC sites", tasks: filteredTasks.slice(4, 5), pct: 0 },
    { name: "99 AllCAD UAE site", tasks: filteredTasks.slice(5, 8), pct: 70 },
  ];

  return (
    <div className="space-y-3 font-sans">
      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedDrawerTask}
        isOpen={!!selectedDrawerTask}
        onClose={() => setSelectedDrawerTask(null)}
      />

      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white p-2.5 rounded-md shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-[#0070BA] shadow-xs focus:border-[#0070BA] focus:outline-none"
            >
              <option value="ALL">All Open ▾</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Group By Selector */}
          <div className="relative">
            <button
              onClick={() => setGroupBy(groupBy === "TASK_LIST" ? "NONE" : "TASK_LIST")}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0070BA] shadow-xs hover:bg-slate-50"
            >
              <span>Group By: {groupBy === "TASK_LIST" ? "Task List" : "None"} ▾</span>
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0070BA] hover:bg-slate-50">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          {/* Split Dropdown Add Task Button matching Screenshot 3 */}
          <div className="relative inline-flex rounded-md shadow-xs">
            <button
              onClick={onAddTask}
              className="rounded-l-md bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="rounded-r-md bg-blue-700 px-2 py-1.5 text-white hover:bg-blue-800 border-l border-blue-600"
            >
              <DropdownIcon className="h-3.5 w-3.5" />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-md bg-white p-1 shadow-lg border border-slate-200 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => { setShowAddMenu(false); if (onAddTask) onAddTask(); }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA]"
                >
                  Add Task
                </button>
                <button
                  onClick={() => { setShowAddMenu(false); alert("Add Task List dialog opened"); }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA]"
                >
                  Add Task List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accordion Grouped Table Container */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3 w-6"></th>
                <th className="py-2.5 px-3 w-16">ID</th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Task Name</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 w-32">Owner</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 text-center w-28">Start Date</th>
                <th className="py-2.5 px-3 text-center w-28">Due Date</th>
                <th className="py-2.5 px-3 text-center w-24">Duration</th>
                <th className="py-2.5 px-3 text-center w-24">Priority</th>
                <th className="py-2.5 px-3 text-center w-36">% Completion P...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => {
                const isCollapsed = collapsedGroups[group.name];
                return (
                  <tr key={group.name} className="contents">
                    {/* Group Header Row */}
                    <td colSpan={10} className="p-0">
                      <div
                        onClick={() => toggleGroup(group.name)}
                        className="flex items-center justify-between bg-slate-50/90 px-3 py-2 border-b border-slate-200 cursor-pointer hover:bg-slate-100 font-bold text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="text-xs">{group.name}</span>
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            ({group.tasks.length || 1})
                          </span>
                        </div>

                        {/* Progress Bar matching Screenshot 2 */}
                        <div className="w-36 flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${group.pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 w-8">{group.pct}%</span>
                        </div>
                      </div>
                    </td>

                    {/* Child Task Rows inside the Group */}
                    {!isCollapsed &&
                      (group.tasks.length === 0 ? (
                        <tr className="border-b border-slate-100 bg-white">
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            <ChevronRight className="h-3 w-3 inline text-slate-300" />
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">1P1-T19</td>
                          <td className="py-2.5 px-3 text-slate-700 font-bold">
                            02 Project Master Excel
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">Ravi Saini</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              not yet Started
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">21-12-2025</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">23-12-2025</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">01:00 hrs</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">Low</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block w-20 bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                              {group.pct}%
                            </span>
                          </td>
                        </tr>
                      ) : (
                        group.tasks.map((task, tIdx) => {
                          const ownerName = task.assignee?.name || (tIdx % 2 === 0 ? "Ravi Saini" : "Divakar Pandiy");

                          return (
                            <tr
                              key={task.id}
                              onClick={() => setSelectedDrawerTask(task)}
                              className="border-b border-slate-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                            >
                              <td className="py-2.5 px-3 text-center text-slate-400">
                                <ChevronRight className="h-3 w-3 inline text-slate-400" />
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                                {task.key || `1P1-T${19 + tIdx}`}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-900 hover:text-[#0070BA]">
                                {task.title}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700">
                                {ownerName}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {task.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                                {task.startDate ? formatDate(task.startDate) : "21-12-2025"}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                                {task.dueDate ? formatDate(task.dueDate) : "23-12-2025"}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                                01:00 hrs
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">
                                {task.priority || "Low"}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-block w-20 bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                                  {group.pct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
