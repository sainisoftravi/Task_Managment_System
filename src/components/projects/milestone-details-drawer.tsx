"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Tag,
  MoreHorizontal,
  Eye,
  ExternalLink,
  Copy,
  Edit2,
  Trash2,
  Move,
  BarChart3,
  MessageSquare,
  Activity
} from "lucide-react";
import CreateTaskListModal from "@/components/projects/create-task-list-modal";
import CloneTaskListModal from "@/components/projects/clone-task-list-modal";

interface MilestoneDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: any;
}

export default function MilestoneDetailsDrawer({
  isOpen,
  onClose,
  milestone,
}: MilestoneDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "Task Lists" | "Issues" | "Release Notes" | "Comments" | "Fields" | "Chart View" | "Status Timeline" | "Activity Stream"
  >("Task Lists");

  const [taskLists, setTaskLists] = useState([
    { id: "tl-1", name: "Financing", tag: "agenda", completed: "0 (0%)", total: 1 },
    { id: "tl-2", name: "installation", tag: "installation", completed: "0 (0%)", total: 3 },
  ]);

  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [showAddTaskListModal, setShowAddTaskListModal] = useState(false);
  const [showCloneTaskListModal, setShowCloneTaskListModal] = useState(false);
  const [targetCloneListName, setTargetCloneListName] = useState("");

  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl h-full bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight text-xs font-sans">
        {/* Header matching Screenshot 2 */}
        <div className="p-6 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Progress Ring 0% */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-50 text-slate-600 font-bold text-xs">
                0%
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestone</span>
                <h2 className="text-lg font-bold text-slate-900">{milestone.name || "Contracts and Agreements"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                <b className="text-slate-800">4</b> Tasks &nbsp;<b className="text-slate-800">2</b> Task Lists
              </span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
            <span className="text-slate-500 font-semibold">Flag: <b>Internal</b></span>
          </div>

          {/* Sub-tabs matching Screenshot 2 */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold pt-2 overflow-x-auto">
            {[
              "Task Lists",
              "Issues",
              "Release Notes",
              "Comments (1)",
              "Fields",
              "Chart View",
              "Status Timeline",
              "Activity Stream",
            ].map((tab) => {
              const tabKey = tab.split(" ")[0] as any;
              const isSelected = activeTab.startsWith(tabKey);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabKey)}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Body matching Screenshot 2 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "Task Lists" && (
            <div className="space-y-4">
              {/* Add Task List Top Right Button matching Screenshot 2 */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddTaskListModal(true)}
                  className="rounded-md bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Add Task List
                </button>
              </div>

              {/* Task Lists Table matching Screenshot 2 */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-2 w-8 text-center">...</th>
                      <th className="py-2.5 px-3">Task Lists</th>
                      <th className="py-2.5 px-3 w-40">Tags</th>
                      <th className="py-2.5 px-3 w-32 text-center">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {taskLists.map((item) => {
                      const isMenuOpen = activeRowMenuId === item.id;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 relative">
                          <td className="py-2.5 px-2 text-center relative">
                            <button
                              type="button"
                              onClick={() => setActiveRowMenuId(isMenuOpen ? null : item.id)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                            {/* Dropdown Options Menu matching Screenshot 2 */}
                            {isMenuOpen && (
                              <div className="absolute left-6 top-2 z-50 w-48 rounded-md bg-white p-1.5 shadow-xl border border-slate-200 text-xs font-semibold text-slate-700 text-left">
                                <button
                                  type="button"
                                  onClick={() => setActiveRowMenuId(null)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Open Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveRowMenuId(null)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  <span>Open Details in New Tab</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(window.location.href);
                                    alert("Task List link copied!");
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Link</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveRowMenuId(null)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  <span>Edit</span>
                                </button>
                                {/* Clone Link (Highlighted Red in Screenshot 2) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetCloneListName(item.name);
                                    setShowCloneTaskListModal(true);
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded bg-orange-50 text-orange-600 font-bold border border-orange-200 cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 text-orange-600" />
                                  <span>Clone</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveRowMenuId(null);
                                    if (confirm(`Move task list '${item.name}' to Trash?`)) {
                                      setTaskLists((prev) => prev.filter((t) => t.id !== item.id));
                                      alert(`Task list '${item.name}' moved to Trash.`);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-600 font-bold cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Trash</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveRowMenuId(null)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] cursor-pointer"
                                >
                                  <Move className="h-3.5 w-3.5" />
                                  <span>Move</span>
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#38bdf8] text-white font-bold text-[10px]">
                              {item.tag}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                            {item.completed} of {item.total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Task List Modal */}
      <CreateTaskListModal
        isOpen={showAddTaskListModal}
        onClose={() => setShowAddTaskListModal(false)}
        onSuccess={(newList) => {
          setTaskLists([...taskLists, { id: `tl-${Date.now()}`, name: newList.name, tag: "general", completed: "0 (0%)", total: 1 }]);
        }}
      />

      {/* Clone Task List Modal matching Screenshots 1 & 2 */}
      <CloneTaskListModal
        isOpen={showCloneTaskListModal}
        onClose={() => setShowCloneTaskListModal(false)}
        taskListName={targetCloneListName || "Financing"}
        onCloneConfirm={(data) => {
          const clonedName = `${targetCloneListName} (Copy)`;
          setTaskLists([...taskLists, { id: `tl-${Date.now()}`, name: clonedName, tag: "cloned", completed: "0 (0%)", total: 1 }]);
          alert(`Cloned task list '${targetCloneListName}' into '${clonedName}' with dependency mode '${data.cloneDependencies}'!`);
        }}
      />
    </div>
  );
}
