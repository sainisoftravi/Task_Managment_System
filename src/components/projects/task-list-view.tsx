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
  const [selectedDrawerTask, setSelectedDrawerTask] = useState<Task | null>(null);

  // State to track collapsed/expanded groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const groupByOptions = [
    { category: "Default Views", items: [
      { id: "Phases", label: "Phases", icon: Layers },
      { id: "Task List", label: "Task List", icon: ListTodo },
      { id: "None", label: "None", icon: Ban },
    ]},
    { category: "Default Fields", items: [
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
    ]}
  ];

  const sampleTasks = [
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

          {/* Group By Button with Popover Dialog matching Screenshots 1-4 */}
          <div className="relative">
            <button
              onClick={() => setShowGroupByPopover(!showGroupByPopover)}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0070BA] shadow-xs hover:bg-slate-50"
            >
              <ListTodo className="h-3.5 w-3.5 text-[#0070BA]" />
              <span>Group By: {selectedGroupBy} ▾</span>
            </button>

            {/* Floating Group By Popover */}
            {showGroupByPopover && (
              <div className="absolute left-0 top-full mt-1 z-40 w-72 rounded-lg bg-white p-3 shadow-2xl border border-slate-200 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="font-bold text-slate-800">Group By</span>
                  <button onClick={() => setShowGroupByPopover(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Dropdown Select Box */}
                <div className="relative mb-2">
                  <div className="w-full rounded border border-blue-500 p-1.5 text-xs font-bold text-slate-800 bg-blue-50/20 flex items-center justify-between">
                    <span>{selectedGroupBy}</span>
                    <DropdownIcon className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search field..."
                    value={groupBySearch}
                    onChange={(e) => setGroupBySearch(e.target.value)}
                    className="w-full rounded border border-slate-300 pl-7 pr-2 py-1 text-xs focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                {/* Categories List */}
                <div className="max-h-56 overflow-y-auto space-y-3 pt-1">
                  {groupByOptions.map((cat) => {
                    const filteredItems = cat.items.filter(i => i.label.toLowerCase().includes(groupBySearch.toLowerCase()));
                    if (filteredItems.length === 0) return null;
                    return (
                      <div key={cat.category}>
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 px-1">{cat.category}</div>
                        <div className="space-y-0.5">
                          {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedGroupBy === item.id;
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setSelectedGroupBy(item.id);
                                  setShowGroupByPopover(false);
                                }}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                                  isSelected ? "bg-blue-50 text-[#0070BA] font-bold" : "hover:bg-slate-100 text-slate-700 font-medium"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 text-slate-500" />
                                <span>{item.label}</span>
                              </div>
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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0070BA] hover:bg-slate-50">
            <Sparkles className="h-3.5 w-3.5 text-[#0070BA]" />
            <span>Automation</span>
          </button>

          {/* Split Dropdown Add Task Button */}
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
                  onClick={() => { setShowAddMenu(false); setShowAddTaskListModal(true); }}
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

      {/* Table Grid matching Screenshots 1-4 */}
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
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 text-center w-36">Start Date</th>
                <th className="py-2.5 px-3 text-center w-56">Due Date</th>
                <th className="py-2.5 px-3 text-center w-24">Duration</th>
                <th className="py-2.5 px-3 text-center w-24">Priority</th>
                <th className="py-2.5 px-3 text-center w-36">% Completion P...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {sampleTasks.map((task) => {
                const isOverdue = !!task.overdueText;

                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedDrawerTask(task as any)}
                    className="border-b border-slate-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400">
                      <input type="checkbox" className="rounded text-[#0070BA]" />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                      {task.key}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 hover:text-[#0070BA]">
                      {task.title}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[9px] flex items-center justify-center border border-slate-300">
                          {task.owner[0]?.toUpperCase()}
                        </div>
                        <span>{task.owner}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold text-white ${
                          task.status === "In Review"
                            ? "bg-[#64A5A5]"
                            : task.status === "in QA"
                            ? "bg-[#F97316]"
                            : "bg-[#94A3B8]"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {task.startDate || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {task.dueDate ? (
                        <div className="flex flex-col items-center">
                          <span className={isOverdue ? "text-red-500 font-bold" : "text-slate-600"}>
                            {task.dueDate}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] text-red-500 font-semibold">{task.overdueText}</span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {task.duration}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">
                      {task.priority}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-24 mx-auto flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${task.pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{task.pct}%</span>
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
