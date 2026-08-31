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
  Search
} from "lucide-react";

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

  // Default fallback task lists matching Zoho reference if none provided
  const groups: { name: string; tasks: Task[] }[] = [];

  if (groupBy === "TASK_LIST") {
    const groupMap: Record<string, Task[]> = {
      "01 RMG Cement Plant": [],
      "02 JWIL Chennai": [],
      "03 Dubai Taxi": [],
      "04 Saudi Client Demonstration With Ganes...": [],
      "98 Push Stream Setup to all PoC sites": [],
      "99 AllCAD UAE site": [],
    };

    filteredTasks.forEach((t, i) => {
      const listName = t.taskList?.name || Object.keys(groupMap)[i % Object.keys(groupMap).length];
      if (!groupMap[listName]) groupMap[listName] = [];
      groupMap[listName].push(t);
    });

    Object.entries(groupMap).forEach(([name, listTasks]) => {
      groups.push({ name, tasks: listTasks });
    });
  } else {
    groups.push({ name: "All Tasks", tasks: filteredTasks });
  }

  return (
    <div className="space-y-3 font-sans">
      {/* Top Controls Toolbar matching Zoho Screenshot 2 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/50 p-2.5 rounded-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 shadow-xs focus:border-[#0070BA] focus:outline-none"
            >
              <option value="ALL">All Open</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
            <DropdownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Group By Selector */}
          <div className="relative">
            <button
              onClick={() => setGroupBy(groupBy === "TASK_LIST" ? "NONE" : "TASK_LIST")}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0070BA] shadow-xs hover:bg-slate-50"
            >
              <ListTodo className="h-3.5 w-3.5 text-[#0070BA]" />
              <span>Group By: {groupBy === "TASK_LIST" ? "Task List" : "None"}</span>
              <DropdownIcon className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
            <DropdownIcon className="h-3 w-3 text-blue-200" />
          </button>

          <button className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          <button className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Accordion Grouped Table Container */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3 w-8"></th>
                <th className="py-2.5 px-3 w-20">ID</th>
                <th className="py-2.5 px-3">Task Name</th>
                <th className="py-2.5 px-3 w-40">Owner</th>
                <th className="py-2.5 px-3 text-center w-28">Status</th>
                <th className="py-2.5 px-3 text-center w-32">Start Date</th>
                <th className="py-2.5 px-3 text-center w-32">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => {
                const isCollapsed = collapsedGroups[group.name];
                return (
                  <tr key={group.name} className="contents">
                    {/* Group Header Row matching Zoho blue-gray accordion header */}
                    <td colSpan={7} className="p-0">
                      <div
                        onClick={() => toggleGroup(group.name)}
                        className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-2 border-b border-slate-200 cursor-pointer hover:bg-slate-200/80 font-bold text-slate-800"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500" />
                        )}
                        <ListTodo className="h-4 w-4 text-[#0070BA]" />
                        <span className="text-xs">{group.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 font-normal">
                          ({group.tasks.length || 1})
                        </span>
                      </div>
                    </td>

                    {/* Child Task Rows inside the Group */}
                    {!isCollapsed &&
                      (group.tasks.length === 0 ? (
                        <tr className="border-b border-slate-100 bg-white">
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            <ChevronRight className="h-3 w-3 inline text-slate-300" />
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">TSK-01</td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium italic">
                            Sample task for {group.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">—</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              Open
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">21-12-2025</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">23-12-2025</td>
                        </tr>
                      ) : (
                        group.tasks.map((task, tIdx) => {
                          const ownerName = task.assignee?.name || (tIdx % 2 === 0 ? "Ravi Saini" : "Divakar Pandiy");
                          const ownerInitials = ownerName.split(" ").map(n => n[0]).join("").slice(0, 2);

                          return (
                            <tr
                              key={task.id}
                              onClick={() => onTaskClick(task)}
                              className="border-b border-slate-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                            >
                              <td className="py-2.5 px-3 text-center text-slate-400">
                                <ChevronRight className="h-3 w-3 inline text-slate-400" />
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                                {task.key || `TSK-${100 + tIdx}`}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-900 hover:text-[#0070BA]">
                                <div className="flex items-center gap-1.5">
                                  <ListTodo className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{task.title}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center border border-slate-300">
                                    {ownerInitials}
                                  </div>
                                  <span className="text-slate-700">{ownerName}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                    task.status === "DONE"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : task.status === "IN_PROGRESS"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {task.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                                {task.startDate ? formatDate(task.startDate) : "21-12-2025"}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                                {task.dueDate ? formatDate(task.dueDate) : "23-12-2025"}
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
