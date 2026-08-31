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
  CheckCircle2
} from "lucide-react";
import TaskDetailDrawer from "@/components/projects/task-detail-drawer";
import AddTaskListModal from "@/components/projects/add-task-list-modal";
import CloneTaskListModal from "@/components/projects/clone-task-list-modal";

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
  const [selectedDrawerTask, setSelectedDrawerTask] = useState<any | null>(null);

  // Default interactive demo tasks matching Screenshot 1 & 2
  const initialTasksList = [
    {
      id: "1P1-124",
      key: "1P1-124",
      title: "01 Jindal site incharge - Arun primary - Senthil secondary",
      owner: "Unassigned",
      status: "not yet Started",
      startDate: "",
      dueDate: "",
      overdueText: "",
      duration: "02:00 hrs",
      priority: "! Medium",
      pct: 0,
    },
    {
      id: "1P1-T19",
      key: "1P1-T19",
      title: "02 Project Master Excel",
      owner: "Ravi Saini",
      status: "not yet Started",
      startDate: "22-12-2025 07:00 PM",
      dueDate: "23-12-2025 11:00 AM",
      overdueText: "(178 day(s) and 10 hour)",
      duration: "01:00 hrs",
      priority: "! Low",
      pct: 0,
    },
    {
      id: "1P1-T26",
      key: "1P1-T26",
      title: "01 Digital Twin Support at Client Side",
      owner: "amin ibrahim",
      status: "in QA",
      startDate: "18-01-2026 10:00 AM",
      dueDate: "22-01-2026 07:00 PM",
      overdueText: "(156 day(s) and 3 hour)",
      duration: "41:00 hrs",
      priority: "! None",
      pct: 90,
    },
    {
      id: "1P1-T27",
      key: "1P1-T27",
      title: "Concurrent User Load Test for P...",
      owner: "kannadas A",
      status: "In Review",
      startDate: "",
      dueDate: "",
      overdueText: "",
      duration: "02:00 hrs",
      priority: "! High",
      pct: 95,
    },
    {
      id: "1P1-T28",
      key: "1P1-T28",
      title: "02 JWIL Chennai - 2 parts - post at 2 locati...",
      owner: "Unassigned",
      status: "In Review",
      startDate: "",
      dueDate: "",
      overdueText: "",
      duration: "01:00 hrs",
      priority: "! None",
      pct: 0,
    },
  ];

  // Dynamic Local Tasks State
  const [localTasks, setLocalTasks] = useState<any[]>(() => {
    if (tasks && tasks.length > 0) {
      return tasks.map((t) => ({
        id: t.id,
        key: t.key || `1P1-${t.id.slice(0, 4)}`,
        title: t.title,
        owner: t.assignee?.name || "Unassigned",
        status: t.status || "not yet Started",
        startDate: t.startDate ? formatDate(t.startDate) : "",
        dueDate: t.dueDate ? formatDate(t.dueDate) : "",
        overdueText: "",
        duration: "02:00 hrs",
        priority: t.priority ? `! ${t.priority}` : "! None",
        pct: (t as any).pct ?? 0,
      }));
    }
    return initialTasksList;
  });

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setLocalTasks(
        tasks.map((t) => ({
          id: t.id,
          key: t.key || `1P1-${t.id.slice(0, 4)}`,
          title: t.title,
          owner: t.assignee?.name || "Unassigned",
          status: t.status || "not yet Started",
          startDate: t.startDate ? formatDate(t.startDate) : "",
          dueDate: t.dueDate ? formatDate(t.dueDate) : "",
          overdueText: "",
          duration: "02:00 hrs",
          priority: t.priority ? `! ${t.priority}` : "! None",
          pct: (t as any).pct ?? 0,
        }))
      );
    }
  }, [tasks]);

  // Handler for updating task inline or from drawer
  const handleUpdateTask = (updatedTask: any) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );
    if (selectedDrawerTask && selectedDrawerTask.id === updatedTask.id) {
      setSelectedDrawerTask({ ...selectedDrawerTask, ...updatedTask });
    }
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
      startDate: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
      overdueText: "",
      duration: "04:00 hrs",
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
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none"
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
              className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              <span>Group By: {selectedGroupBy} ▾</span>
            </button>

            {/* Group By Popover Dialog */}
            {showGroupByPopover && (
              <div className="absolute left-0 mt-2 z-50 w-72 rounded-lg bg-white p-3 shadow-xl border border-slate-200 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-900">Group By</h4>
                  <button onClick={() => setShowGroupByPopover(false)} className="text-slate-400 hover:text-slate-700">
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
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
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
          <button className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          {/* Split Add Task Dropdown */}
          <div className="relative">
            <div className="inline-flex rounded-md shadow-xs">
              <button
                onClick={handleAddNewTask}
                className="rounded-l-md bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 border-r border-blue-600"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="rounded-r-md bg-[#0070BA] px-2 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                <DropdownIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {showAddMenu && (
              <div className="absolute right-0 mt-1 z-50 w-40 rounded-md bg-white p-1 shadow-lg border border-slate-200 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    handleAddNewTask();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA]"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false);
                    setShowAddTaskListModal(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA]"
                >
                  Add Task List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task List Modal */}
      <AddTaskListModal
        isOpen={showAddTaskListModal}
        onClose={() => setShowAddTaskListModal(false)}
        onAddTaskList={(data) => {
          alert(`Task List '${data.name}' added with Flag: ${data.flag}`);
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
                <th className="py-2.5 px-3 text-center w-36">Start Date</th>
                <th className="py-2.5 px-3 text-center w-56">Due Date</th>
                <th className="py-2.5 px-3 text-center w-24">Duration</th>
                <th className="py-2.5 px-3 text-center w-28">Priority</th>
                <th className="py-2.5 px-3 text-center w-36">% Completion P...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {localTasks.map((task) => {
                const isOverdue = !!task.overdueText;

                return (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors"
                  >
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

                    {/* Task Title */}
                    <td
                      onClick={() => setSelectedDrawerTask(task)}
                      className="py-2.5 px-3 font-bold text-slate-900 hover:text-[#0070BA] cursor-pointer"
                    >
                      {task.title}
                    </td>

                    {/* Owner Dropdown */}
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      <select
                        value={task.owner}
                        onChange={(e) => handleUpdateTask({ ...task, owner: e.target.value })}
                        className="w-full border border-transparent hover:border-slate-300 rounded px-1 py-0.5 text-xs bg-transparent focus:border-[#0070BA] focus:outline-none"
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

                    {/* Start Date */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      <input
                        type="text"
                        value={task.startDate || ""}
                        onChange={(e) => handleUpdateTask({ ...task, startDate: e.target.value })}
                        placeholder="—"
                        className="w-full text-center border border-transparent hover:border-slate-300 rounded text-xs bg-transparent focus:border-[#0070BA] focus:outline-none"
                      />
                    </td>

                    {/* Due Date */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          value={task.dueDate || ""}
                          onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                          placeholder="—"
                          className={`w-full text-center border border-transparent hover:border-slate-300 rounded text-xs bg-transparent focus:border-[#0070BA] focus:outline-none ${
                            isOverdue ? "text-red-500 font-bold" : "text-slate-600"
                          }`}
                        />
                        {isOverdue && (
                          <span className="text-[10px] text-red-500 font-semibold">{task.overdueText}</span>
                        )}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      <input
                        type="text"
                        value={task.duration}
                        onChange={(e) => handleUpdateTask({ ...task, duration: e.target.value })}
                        className="w-full text-center border border-transparent hover:border-slate-300 rounded text-xs bg-transparent focus:border-[#0070BA] focus:outline-none"
                      />
                    </td>

                    {/* Priority Dropdown */}
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={task.priority}
                        onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value })}
                        className="border border-transparent hover:border-slate-300 rounded px-1 py-0.5 text-xs font-semibold text-slate-700 bg-transparent focus:border-[#0070BA] focus:outline-none"
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
