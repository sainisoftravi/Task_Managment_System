"use client";

import { useState, useEffect } from "react";
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
  Search,
  X,
  Clock,
  Tag,
  Percent,
  Layers,
  Ban,
  CheckCircle2,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Palette,
  Move,
  CopyPlus,
  Trash2,
  Eye
} from "lucide-react";
import TaskDetailDrawer from "@/components/projects/task-detail-drawer";
import CreateTaskListModal from "@/components/projects/create-task-list-modal";
import CloneTaskListModal from "@/components/projects/clone-task-list-modal";
import CreateTaskModal from "@/components/projects/create-task-modal";
import TaskListDetailsDrawer from "@/components/projects/task-list-details-drawer";
import EditTaskListModal from "@/components/projects/edit-task-list-modal";
import MoveTaskListModal from "@/components/projects/move-task-list-modal";

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
  const [selectedGroupBy, setSelectedGroupBy] = useState<string>("None");
  const [showGroupByPopover, setShowGroupByPopover] = useState(false);
  const [groupBySearch, setGroupBySearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddTaskListModal, setShowAddTaskListModal] = useState(false);
  const [showCloneTaskListModal, setShowCloneTaskListModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedDrawerTask, setSelectedDrawerTask] = useState<any | null>(null);
  const [showTaskListDetailsDrawer, setShowTaskListDetailsDrawer] = useState(false);
  const [showEditTaskListModal, setShowEditTaskListModal] = useState(false);
  const [showMoveTaskListModal, setShowMoveTaskListModal] = useState(false);
  const [activeTaskListHeader, setActiveTaskListHeader] = useState<any | null>(null);

  // Active duration popover row ID & active row context menu ID
  const [activeDurationPopoverId, setActiveDurationPopoverId] = useState<string | null>(null);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // Default interactive demo tasks matching Screenshot 1 & 2
  const initialTasksList = [
    {
      id: "1P1-124",
      key: "1P1-124",
      title: "01 Jindal site incharge - Arun primary - Senthil secondary",
      owner: "Unassigned",
      status: "not yet Started",
      startDate: "2025-12-20T09:00",
      dueDate: "2025-12-20T11:00",
      overdueText: "(254 day(s) and 7 hour)",
      duration: "02:00 hrs",
      durationUnit: "hrs",
      durationValue: 2,
      priority: "! Medium",
      pct: 0,
    },
    {
      id: "1P1-T19",
      key: "1P1-T19",
      title: "02 Project Master Excel",
      owner: "Ravi Saini",
      status: "not yet Started",
      startDate: "2025-12-22T19:00",
      dueDate: "2025-12-23T11:00",
      overdueText: "(178 day(s) and 10 hour)",
      duration: "01:00 hrs",
      durationUnit: "hrs",
      durationValue: 1,
      priority: "! Low",
      pct: 0,
    },
    {
      id: "1P1-T26",
      key: "1P1-T26",
      title: "01 Digital Twin Support at Client Side",
      owner: "amin ibrahim",
      status: "in QA",
      startDate: "2026-01-18T10:00",
      dueDate: "2026-01-22T19:00",
      overdueText: "(156 day(s) and 3 hour)",
      duration: "41:00 hrs",
      durationUnit: "hrs",
      durationValue: 41,
      priority: "! None",
      pct: 90,
    },
    {
      id: "1P1-T27",
      key: "1P1-T27",
      title: "Concurrent User Load Test for P...",
      owner: "kannadas A",
      status: "In Review",
      startDate: "2026-02-01T09:00",
      dueDate: "2026-02-01T11:00",
      overdueText: "(211 day(s) and 7 hour)",
      duration: "02:00 hrs",
      durationUnit: "hrs",
      durationValue: 2,
      priority: "! High",
      pct: 95,
    },
    {
      id: "1P1-T28",
      key: "1P1-T28",
      title: "02 JWIL Chennai - 2 parts - post at 2 locati...",
      owner: "Unassigned",
      status: "In Review",
      startDate: "2026-02-05T10:00",
      dueDate: "2026-02-05T11:00",
      overdueText: "(207 day(s) and 7 hour)",
      duration: "01:00 hrs",
      durationUnit: "hrs",
      durationValue: 1,
      priority: "! None",
      pct: 0,
    },
  ];

  // Dynamic Local Tasks State
  const [localTasks, setLocalTasks] = useState<any[]>(() => {
    if (Array.isArray(tasks)) {
      return tasks.map((t) => ({
        id: t.id,
        key: t.key || `1P1-${t.id.slice(0, 4)}`,
        title: t.title,
        owner: t.assignee?.name || "Unassigned",
        status: t.status || "not yet Started",
        startDate: t.startDate ? parseToDateTimeInput(t.startDate) : "2025-12-22T19:00",
        dueDate: t.dueDate ? parseToDateTimeInput(t.dueDate) : "2025-12-23T11:00",
        overdueText: "(178 day(s) and 10 hour)",
        duration: "01:00 hrs",
        durationUnit: "hrs",
        durationValue: 1,
        priority: t.priority ? `! ${t.priority}` : "! None",
        pct: (t as any).pct ?? 0,
      }));
    }
    return initialTasksList;
  });

  useEffect(() => {
    if (Array.isArray(tasks)) {
      setLocalTasks(
        tasks.map((t) => ({
          id: t.id,
          key: t.key || `1P1-${t.id.slice(0, 4)}`,
          title: t.title,
          owner: t.assignee?.name || "Unassigned",
          status: t.status || "not yet Started",
          startDate: t.startDate ? parseToDateTimeInput(t.startDate) : "2025-12-22T19:00",
          dueDate: t.dueDate ? parseToDateTimeInput(t.dueDate) : "2025-12-23T11:00",
          overdueText: "(178 day(s) and 10 hour)",
          duration: "01:00 hrs",
          durationUnit: "hrs",
          durationValue: 1,
          priority: t.priority ? `! ${t.priority}` : "! None",
          pct: (t as any).pct ?? 0,
        }))
      );
    }
  }, [tasks]);

  function parseToDateTimeInput(dateStr: string) {
    if (!dateStr) return "2025-12-22T19:00";
    if (dateStr.includes("T")) return dateStr;
    if (dateStr.includes("-") && dateStr.includes(":")) {
      const parts = dateStr.split(" ");
      if (parts.length >= 2) {
        const [d, m, y] = parts[0].split("-");
        let time = parts[1];
        if (parts[2] === "PM") {
          const [h, min] = time.split(":");
          time = `${(parseInt(h) % 12) + 12}:${min}`;
        }
        return `${y}-${m}-${d}T${time}`;
      }
    }
    return "2025-12-22T19:00";
  }

  function formatDisplayDateTime(isoStr: string) {
    if (!isoStr) return "—";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      let hours = d.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${mins} ${ampm}`;
    } catch {
      return isoStr;
    }
  }

  // Auto calculate Duration and Overdue text from Start and Due dates
  const calculateTaskDates = (startIso: string, dueIso: string) => {
    let computedDuration = "01:00 hrs";
    let computedOverdue = "";

    try {
      const start = new Date(startIso);
      const due = new Date(dueIso);

      if (!isNaN(start.getTime()) && !isNaN(due.getTime())) {
        const diffMs = due.getTime() - start.getTime();
        if (diffMs > 0) {
          const totalHrs = Math.floor(diffMs / (1000 * 60 * 60));
          computedDuration = `${String(totalHrs).padStart(2, "0")}:00 hrs`;
        }

        // Calculate Overdue / Days counter
        const now = new Date();
        const overdueMs = now.getTime() - due.getTime();
        if (overdueMs > 0) {
          const days = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          computedOverdue = `(${days} day(s) and ${hours} hour)`;
        }
      }
    } catch {}

    return { duration: computedDuration, overdueText: computedOverdue };
  };

  // Format Duration string from number + unit
  const formatDurationString = (val: number, unit: string) => {
    if (unit === "hrs") {
      return `${String(val).padStart(2, "0")}:00 hrs`;
    }
    if (unit === "days") {
      return `${val} ${val === 1 ? "day" : "days"}`;
    }
    if (unit === "cdays") {
      return `${val} ${val === 1 ? "cday" : "cdays"}`;
    }
    if (unit === "chrs") {
      return `${val} chrs`;
    }
    if (unit === "mins") {
      return `${val} mins`;
    }
    return `${val} ${unit}`;
  };

  // Handler for updating task inline or from drawer
  const handleUpdateTask = (updatedTask: any) => {
    const dateCalcs = calculateTaskDates(updatedTask.startDate, updatedTask.dueDate);
    const finalTask = {
      ...updatedTask,
      duration: updatedTask.duration || dateCalcs.duration,
      overdueText: dateCalcs.overdueText || updatedTask.overdueText || "",
    };

    setLocalTasks((prev) =>
      prev.map((t) => (t.id === finalTask.id ? { ...t, ...finalTask } : t))
    );
    if (selectedDrawerTask && selectedDrawerTask.id === finalTask.id) {
      setSelectedDrawerTask({ ...selectedDrawerTask, ...finalTask });
    }

    // PATCH to backend API if DB task ID
    if (finalTask.id && !finalTask.id.startsWith("1P1-")) {
      fetch(`/api/tasks/${finalTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: finalTask.title }),
      }).catch(() => {});
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Move this task to Trash?")) return;
    setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedDrawerTask?.id === taskId) {
      setSelectedDrawerTask(null);
    }
    const token = localStorage.getItem("token");
    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
    alert("Task moved to Trash.");
  };

  // Add new task dynamically
  const handleAddNewTask = () => {
    const newId = `1P1-T${Date.now().toString().slice(-3)}`;
    const newTask = {
      id: newId,
      key: newId,
      title: "New Interactive Task Item",
      owner: "Ravi Saini",
      status: "not yet Started",
      startDate: "2025-12-22T19:00",
      dueDate: "2025-12-23T11:00",
      overdueText: "(178 day(s) and 10 hour)",
      duration: "01:00 hrs",
      durationUnit: "hrs",
      durationValue: 1,
      priority: "! Medium",
      pct: 0,
    };
    setLocalTasks([newTask, ...localTasks]);
    setSelectedDrawerTask(newTask);
  };

  // Grouping Options
  const groupByOptions = [
    {
      category: "Default Views",
      items: [
        { id: "Phases", label: "Phases", icon: Layers },
        { id: "Task List", label: "Task List", icon: ListTodo },
        { id: "None", label: "None", icon: Ban },
      ],
    },
    {
      category: "Default Fields",
      items: [
        { id: "Created By", label: "Created By", icon: User },
        { id: "Created On", label: "Created On", icon: Calendar },
        { id: "Last Modified Time", label: "Last Modified Time", icon: Clock },
        { id: "Owner", label: "Owner", icon: User },
        { id: "Status", label: "Status", icon: CheckCircle2 },
        { id: "Completed on", label: "Completed on", icon: Calendar },
        { id: "Start Date", label: "Start Date", icon: Calendar },
        { id: "Due Date", label: "Due Date", icon: Calendar },
        { id: "Priority", label: "Priority", icon: Tag },
        { id: "Tags", label: "Tags", icon: Tag },
        { id: "Completion Percentage", label: "Completion Percentage", icon: Percent },
      ],
    },
  ];

  const durationUnits = [
    { id: "days", label: "days (Work Days)" },
    { id: "hrs", label: "hrs (Work Hours)" },
    { id: "cdays", label: "cdays (Calendar Days)" },
    { id: "chrs", label: "chrs (Calendar Hours)" },
    { id: "mins", label: "mins (Minutes)" },
  ];

  return (
    <div className="space-y-3 font-sans">
      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedDrawerTask}
        isOpen={!!selectedDrawerTask}
        onClose={() => setSelectedDrawerTask(null)}
        onUpdateTask={handleUpdateTask}
      />

      {/* Control Bar matching Screenshot 3 & 4 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-md border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Open ▾</option>
            <option value="not yet Started">not yet Started</option>
            <option value="In Progress">In Progress</option>
            <option value="in QA">in QA</option>
            <option value="In Review">In Review</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Group By Trigger Button */}
          <div className="relative">
            <button
              onClick={() => setShowGroupByPopover(!showGroupByPopover)}
              className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              <span>Group By: {selectedGroupBy} ▾</span>
            </button>

            {/* Group By Popover Dialog */}
            {showGroupByPopover && (
              <div className="absolute left-0 mt-2 z-50 w-72 rounded-lg bg-white p-3 shadow-xl border border-slate-200 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-900">Group By</h4>
                  <button onClick={() => setShowGroupByPopover(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search field..."
                    value={groupBySearch}
                    onChange={(e) => setGroupBySearch(e.target.value)}
                    className="w-full rounded-md border border-slate-200 pl-8 pr-3 py-1 text-xs focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-3 text-xs">
                  {groupByOptions.map((cat) => {
                    const filteredItems = cat.items.filter((item) =>
                      item.label.toLowerCase().includes(groupBySearch.toLowerCase())
                    );
                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={cat.category} className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {cat.category}
                        </span>
                        <div className="space-y-0.5">
                          {filteredItems.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = selectedGroupBy === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedGroupBy(item.id);
                                  setShowGroupByPopover(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-50 text-[#0070BA] font-bold"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-3.5 w-3.5 text-slate-500" />
                                  <span>{item.label}</span>
                                </div>
                                {isSelected && <ChevronRight className="h-3.5 w-3.5 text-[#0070BA]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Buttons: Split Add Task Dropdown */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          {/* Split Add Task Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-md shadow-xs">
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="rounded-l-md bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 border-r border-blue-600 cursor-pointer"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="rounded-r-md bg-[#0070BA] px-2 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <DropdownIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {showAddMenu && (
              <div className="absolute right-0 mt-1 z-50 w-40 rounded-md bg-white p-1 shadow-lg border border-slate-200 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    setShowCreateTaskModal(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    setShowAddTaskListModal(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                >
                  Add Task List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full New Task Modal Form matching Screenshots 1 & 2 */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onAddTask={(newTaskData) => {
          setLocalTasks([newTaskData, ...localTasks]);
        }}
      />

      {/* Clone Task List Modal */}
      <CloneTaskListModal
        isOpen={showCloneTaskListModal}
        onClose={() => setShowCloneTaskListModal(false)}
        taskListName="01 RMG Cement Plant"
        onCloneConfirm={(data) => {
          alert(`Cloned ${data.instancesCount} instance(s) with dependency mode: ${data.cloneDependencies}`);
        }}
      />

      {/* Interactive Table Grid matching Screenshot 1 & 2 */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-2 w-8 text-center">...</th>
                <th className="py-2.5 px-3 w-6"></th>
                <th className="py-2.5 px-3 w-20">ID</th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Task Name</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 w-36">Owner</th>
                <th className="py-2.5 px-3 w-32 text-center">Status</th>
                <th className="py-2.5 px-3 text-center w-48">Start Date</th>
                <th className="py-2.5 px-3 text-center w-56">Due Date</th>

                {/* Duration Header matching Screenshot */}
                <th className="py-2.5 px-3 text-center w-32">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#0070BA]" />
                    <span>Duration</span>
                  </div>
                </th>

                <th className="py-2.5 px-3 text-center w-28">Priority</th>
                <th className="py-2.5 px-3 text-center w-36">% Completion P...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {localTasks.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ListTodo className="h-8 w-8 text-slate-300" />
                      <p className="font-bold text-sm text-slate-700">No tasks in this project yet</p>
                      <p className="text-xs text-slate-400">Click &quot;Add Task&quot; above to create your first task for this project.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                localTasks.map((task) => {
                  const isOverdue = !!task.overdueText;
                  const isDurationPopoverOpen = activeDurationPopoverId === task.id;
                  const isRowMenuOpen = activeRowMenuId === task.id;

                return (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Row Context Menu (...) matching Screenshot 2 */}
                    <td className="py-2.5 px-2 text-center relative">
                      <button
                        type="button"
                        onClick={() => setActiveRowMenuId(isRowMenuOpen ? null : task.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Task Options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Row Action Dropdown Menu matching Screenshot 2 */}
                      {isRowMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-6 top-2 z-50 w-48 rounded-md bg-white p-1.5 shadow-xl border border-slate-200 text-xs font-semibold text-slate-700 text-left"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrawerTask(task);
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/projects/${task.projectId || "p1"}`, "_blank");
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>View Details in New Tab</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard?.writeText(window.location.href);
                              alert("Task link copied!");
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Link</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <Palette className="h-3.5 w-3.5" />
                            <span>Color</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <Move className="h-3.5 w-3.5" />
                            <span>Move</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddNewTask();
                              setActiveRowMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                          >
                            <CopyPlus className="h-3.5 w-3.5" />
                            <span>Clone</span>
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveRowMenuId(null);
                              handleDeleteTask(task.id);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-600 font-bold cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Trash</span>
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center text-slate-400">
                      <input type="checkbox" className="rounded text-[#0070BA]" />
                    </td>

                    {/* ID */}
                    <td
                      onClick={() => setSelectedDrawerTask(task)}
                      className="py-2.5 px-3 font-mono font-bold text-slate-600 cursor-pointer hover:underline"
                    >
                      {task.key || task.id}
                    </td>

                    {/* Interactive Task Name Cell (Directly Editable Inline Name Input) */}
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleUpdateTask({ ...task, title: e.target.value })}
                        className="w-full rounded border border-transparent hover:border-slate-300 focus:border-[#0070BA] focus:outline-none px-1.5 py-0.5 text-xs font-bold text-slate-900 bg-transparent"
                        placeholder="Task title..."
                      />
                    </td>

                    {/* Owner Dropdown */}
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      <select
                        value={task.owner}
                        onChange={(e) => handleUpdateTask({ ...task, owner: e.target.value })}
                        className="w-full border border-transparent hover:border-slate-300 rounded px-1 py-0.5 text-xs bg-transparent focus:border-[#0070BA] focus:outline-none cursor-pointer"
                      >
                        <option value="Ravi Saini">Ravi Saini</option>
                        <option value="amin ibrahim">amin ibrahim</option>
                        <option value="kannadas A">kannadas A</option>
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask({ ...task, status: e.target.value })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold text-white cursor-pointer border-none focus:outline-none ${
                          task.status === "In Review"
                            ? "bg-[#64A5A5]"
                            : task.status === "in QA"
                            ? "bg-[#F97316]"
                            : task.status === "In Progress"
                            ? "bg-blue-600"
                            : task.status === "Completed"
                            ? "bg-emerald-600"
                            : "bg-[#94A3B8]"
                        }`}
                      >
                        <option value="not yet Started" className="bg-slate-600 text-white">not yet Started</option>
                        <option value="In Progress" className="bg-blue-600 text-white">In Progress</option>
                        <option value="in QA" className="bg-orange-500 text-white">in QA</option>
                        <option value="In Review" className="bg-teal-600 text-white">In Review</option>
                        <option value="Completed" className="bg-emerald-600 text-white">Completed</option>
                      </select>
                    </td>

                    {/* Start Date Picker Calendar Cell */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      <div className="flex flex-col items-center">
                        <input
                          type="datetime-local"
                          value={task.startDate || ""}
                          onChange={(e) => {
                            const newStart = e.target.value;
                            const calcs = calculateTaskDates(newStart, task.dueDate);
                            handleUpdateTask({
                              ...task,
                              startDate: newStart,
                              duration: calcs.duration,
                              overdueText: calcs.overdueText,
                            });
                          }}
                          className="w-full text-center border border-slate-200 hover:border-[#0070BA] rounded text-[11px] font-semibold bg-white py-1 px-1 focus:border-[#0070BA] focus:outline-none cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatDisplayDateTime(task.startDate)}
                        </span>
                      </div>
                    </td>

                    {/* Due Date Picker Calendar Cell */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      <div className="flex flex-col items-center">
                        <input
                          type="datetime-local"
                          value={task.dueDate || ""}
                          onChange={(e) => {
                            const newDue = e.target.value;
                            const calcs = calculateTaskDates(task.startDate, newDue);
                            handleUpdateTask({
                              ...task,
                              dueDate: newDue,
                              duration: calcs.duration,
                              overdueText: calcs.overdueText,
                            });
                          }}
                          className={`w-full text-center border border-slate-200 hover:border-[#0070BA] rounded text-[11px] font-semibold bg-white py-1 px-1 focus:border-[#0070BA] focus:outline-none cursor-pointer ${
                            isOverdue ? "text-red-500 font-bold border-red-300" : "text-slate-600"
                          }`}
                        />
                        <span className={`text-[10px] mt-0.5 ${isOverdue ? "text-red-500 font-bold" : "text-slate-500"}`}>
                          {formatDisplayDateTime(task.dueDate)}
                        </span>
                        {task.overdueText && (
                          <span className="text-[10px] text-red-500 font-semibold">{task.overdueText}</span>
                        )}
                      </div>
                    </td>

                    {/* Interactive Duration Unit Popover Cell matching Screenshot */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 relative">
                      <div
                        onClick={() =>
                          setActiveDurationPopoverId(isDurationPopoverOpen ? null : task.id)
                        }
                        className="cursor-pointer border border-transparent hover:border-[#0070BA] px-2 py-1 rounded bg-slate-50 hover:bg-white text-xs text-[#0070BA] flex items-center justify-center gap-1"
                      >
                        <span>{task.duration || "01:00 hrs"}</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </div>

                      {/* Duration Unit Popover Menu matching Screenshot */}
                      {isDurationPopoverOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-1 z-50 w-52 rounded-lg bg-white p-2.5 shadow-xl border border-slate-200 text-xs font-sans text-left">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Duration Options
                          </div>
                          <div className="text-[10px] text-slate-500 mb-2 font-mono bg-slate-100 p-1 rounded">
                            days / hrs / cdays / chrs / mins
                          </div>

                          <div className="space-y-1 mb-2">
                            <label className="block text-[10px] font-bold text-slate-600">Value</label>
                            <input
                              type="number"
                              min={1}
                              defaultValue={task.durationValue || 1}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const newStr = formatDurationString(val, task.durationUnit || "hrs");
                                handleUpdateTask({
                                  ...task,
                                  durationValue: val,
                                  duration: newStr,
                                });
                              }}
                              className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold focus:border-[#0070BA] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-600">Unit Type</label>
                            <div className="grid grid-cols-1 gap-1">
                              {durationUnits.map((u) => (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => {
                                    const val = task.durationValue || 1;
                                    const newStr = formatDurationString(val, u.id);
                                    handleUpdateTask({
                                      ...task,
                                      durationUnit: u.id,
                                      duration: newStr,
                                    });
                                    setActiveDurationPopoverId(null);
                                  }}
                                  className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                                    task.durationUnit === u.id
                                      ? "bg-blue-50 text-[#0070BA] font-bold"
                                      : "hover:bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {u.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Priority Dropdown */}
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={task.priority}
                        onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value })}
                        className="border border-transparent hover:border-slate-300 rounded px-1 py-0.5 text-xs font-semibold text-slate-700 bg-transparent focus:border-[#0070BA] focus:outline-none cursor-pointer"
                      >
                        <option value="! Low">! Low</option>
                        <option value="! Medium">! Medium</option>
                        <option value="! High">! High</option>
                        <option value="! None">! None</option>
                      </select>
                    </td>

                    {/* Completion Percentage Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-28 mx-auto flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${task.pct}%` }}
                          />
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={task.pct}
                          onChange={(e) => handleUpdateTask({ ...task, pct: Number(e.target.value) })}
                          className="w-10 text-center font-bold text-slate-700 border border-slate-200 rounded text-[10px] py-0.5"
                        />
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task List Drawer Modal matching Screenshots 1 & 2 */}
      <CreateTaskListModal
        isOpen={showAddTaskListModal}
        onClose={() => setShowAddTaskListModal(false)}
        onSuccess={(newList) => {
          alert(`Added new Task List '${newList.name}' (${newList.flag}).`);
        }}
      />

      {/* Task List Details Drawer matching Screenshot 2 */}
      <TaskListDetailsDrawer
        isOpen={showTaskListDetailsDrawer}
        onClose={() => setShowTaskListDetailsDrawer(false)}
        taskList={activeTaskListHeader || { name: "Concrete work in progress", flag: "External" }}
      />

      {/* Edit Task List Modal matching Screenshot 1 */}
      <EditTaskListModal
        isOpen={showEditTaskListModal}
        onClose={() => setShowEditTaskListModal(false)}
        taskList={activeTaskListHeader || { name: "Walk-through check list", milestone: "None", flag: "Internal" }}
        onSave={(updated) => {
          setActiveTaskListHeader(updated);
        }}
      />

      {/* Move Task List Modal */}
      <MoveTaskListModal
        isOpen={showMoveTaskListModal}
        onClose={() => setShowMoveTaskListModal(false)}
        taskList={activeTaskListHeader || { name: "Walk-through check list" }}
        onMove={(project, milestone) => {
          alert(`Moved task list to project ${project}`);
        }}
      />
    </div>
  );
}
