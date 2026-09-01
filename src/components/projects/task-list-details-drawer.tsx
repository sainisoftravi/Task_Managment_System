"use client";

import { useState } from "react";
import {
  X,
  ExternalLink,
  MessageSquare,
  BarChart3,
  ListTodo,
  Paperclip,
  Send,
  Info,
  Tag,
  Plus,
  Filter,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Copy
} from "lucide-react";

interface TaskListDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskList: any;
  onAddTaskToTaskList?: (taskListId: string, taskTitle: string) => void;
}

export default function TaskListDetailsDrawer({
  isOpen,
  onClose,
  taskList,
  onAddTaskToTaskList,
}: TaskListDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"Tasks" | "Comments" | "Chart View">("Tasks");
  const [inlineTaskTitle, setInlineTaskTitle] = useState("");
  const [showInlineAdd, setShowInlineAdd] = useState(false);

  const [drawerTasks, setDrawerTasks] = useState<any[]>([
    {
      id: "OD1-T1",
      title: "02 Task Creation",
      owner: "Unassigned",
      status: "Open",
      tags: [],
      duration: "-",
      priority: "! None",
      pct: 20,
      timelog: "0:00",
    },
  ]);

  const [comments, setComments] = useState([
    { id: "c1", user: "Ravi Saini", time: "2 hours ago", text: "Task list created for 01 POC TEST." },
  ]);
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !taskList) return null;

  const handleAddInlineTask = () => {
    if (!inlineTaskTitle.trim()) return;
    const newTask = {
      id: `OD1-T${drawerTasks.length + 1}`,
      title: inlineTaskTitle.trim(),
      owner: "Unassigned",
      status: "Open",
      tags: [],
      duration: "-",
      priority: "! None",
      pct: 0,
      timelog: "0:00",
    };
    setDrawerTasks([...drawerTasks, newTask]);
    if (onAddTaskToTaskList) {
      onAddTaskToTaskList(taskList.id, inlineTaskTitle.trim());
    }
    setInlineTaskTitle("");
    setShowInlineAdd(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: `c-${Date.now()}`, user: "Ravi Saini", time: "Just now", text: newComment.trim() },
    ]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="w-full max-w-4xl h-full bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight text-xs font-sans">
        
        {/* Drawer Header matching Screenshots 4 & 5 */}
        <div className="p-5 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Progress Ring 0% */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-50 text-slate-700 font-extrabold text-xs shadow-2xs">
                0%
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                    TaskList
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{taskList.name || "01 POC TEST"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                <b className="text-slate-900">{drawerTasks.length}</b> Open &nbsp;
                <b className="text-slate-400">0</b> Closed
              </span>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tags & Sub-header */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
            <Tag className="h-3.5 w-3.5 text-[#0066FF]" />
            <span>Tags:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold text-slate-700">
              {taskList.flag || "Internal"}
            </span>
          </div>

          {/* Sub-Tabs matching Screenshots 4 & 5 */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-extrabold pt-2">
            {(["Tasks", "Comments", "Chart View"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-[#0066FF] text-[#0066FF]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: TASKS LIST (Screenshots 4 & 5) */}
          {activeTab === "Tasks" && (
            <div className="space-y-4 font-sans">
              
              {/* Sub-bar Controls */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">All Open ▾</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInlineAdd(true)}
                    className="rounded-lg bg-[#0066FF] hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Task</span>
                  </button>
                  <button className="p-1.5 rounded-lg border border-slate-300 text-slate-500 hover:text-slate-800">
                    <Filter className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-slate-300 text-slate-500 hover:text-slate-800">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Table inside TaskList Details Drawer */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 w-8 text-center">
                          <input type="checkbox" className="rounded text-[#0066FF]" />
                        </th>
                        <th className="py-2.5 px-3 w-20">ID</th>
                        <th className="py-2.5 px-3 min-w-[160px]">Task Name</th>
                        <th className="py-2.5 px-3">Owner</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Duration</th>
                        <th className="py-2.5 px-3 text-center">Priority</th>
                        <th className="py-2.5 px-3 text-center">% Completion</th>
                        <th className="py-2.5 px-3 text-right">Timelog Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {drawerTasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-center">
                            <input type="checkbox" className="rounded text-[#0066FF]" />
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{t.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{t.title}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                              <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                                U
                              </span>
                              {t.owner}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#00C49F] text-white">
                              {t.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{t.duration}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-600">{t.priority}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center gap-1.5 justify-center">
                              <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${t.pct}%` }} />
                              </div>
                              <span className="font-bold font-mono text-[10px] text-slate-700">{t.pct}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">{t.timelog}</td>
                        </tr>
                      ))}

                      {/* Inline Task Creation Row matching Screenshot 4 */}
                      {showInlineAdd ? (
                        <tr className="bg-blue-50/40">
                          <td colSpan={2} className="py-2 px-3 text-center font-mono text-[#0066FF] font-bold">
                            New
                          </td>
                          <td colSpan={7} className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Enter Task Name (e.g. 02 Task Creation)..."
                                value={inlineTaskTitle}
                                onChange={(e) => setInlineTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddInlineTask();
                                }}
                                className="w-full rounded border border-blue-300 px-3 py-1.5 text-xs font-semibold focus:border-[#0066FF] focus:outline-none bg-white"
                                autoFocus
                              />
                              <button
                                onClick={handleAddInlineTask}
                                className="px-3 py-1.5 rounded bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setShowInlineAdd(false)}
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-2.5 px-4 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setShowInlineAdd(true)}
                                className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>Add Task</span>
                              </button>
                              <span className="text-slate-300">|</span>
                              <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                <span>Suggestions</span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inbound Email Link matching Screenshot 4 */}
              <div className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`tasklist-${taskList.id}@taskpmp.local`);
                    alert(`Email alias copied: tasklist-${taskList.id}@taskpmp.local`);
                  }}
                  className="text-[#0066FF] hover:underline font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>To add Task via email to this Task list</span>
                  <Copy className="h-3.5 w-3.5 text-[#0066FF]" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMMENTS */}
          {activeTab === "Comments" && (
            <div className="space-y-4 font-sans">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <textarea
                  rows={3}
                  placeholder="Enter your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-[#0066FF] focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    <span>Attach File</span>
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="rounded bg-[#0066FF] hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Add Comment</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{c.user}</span>
                      <span className="text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-700">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHART VIEW */}
          {activeTab === "Chart View" && (
            <div className="space-y-6 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Tasks By User</h4>
                  <div className="flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0066FF" strokeWidth="20" strokeDasharray="180 70" />
                    </svg>
                  </div>
                  <div className="text-center font-semibold text-xs text-slate-600">
                    Unassigned ({drawerTasks.length})
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Tasks By Status</h4>
                  <div className="flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00C49F" strokeWidth="20" strokeDasharray="200 50" />
                    </svg>
                  </div>
                  <div className="text-center font-bold text-xs text-slate-700">
                    Open - {drawerTasks.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
