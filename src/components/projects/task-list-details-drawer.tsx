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
  DollarSign,
  PieChart as PieIcon,
  RotateCw
} from "lucide-react";

interface TaskListDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskList: any;
}

export default function TaskListDetailsDrawer({
  isOpen,
  onClose,
  taskList,
}: TaskListDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"Tasks" | "Comments" | "Chart View">("Chart View");
  const [comments, setComments] = useState([
    { id: "c1", user: "Monica Hemsworth", time: "2 hours ago", text: "Concrete pouring completed for structural section A." },
    { id: "c2", user: "Eduardo Vargas", time: "30 mins ago", text: "Quality checks passed. Moving to cure testing phase." },
  ]);
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !taskList) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: `c-${Date.now()}`, user: "Ravi Saini", time: "Just now", text: newComment.trim() },
    ]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl h-full bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight text-xs font-sans">
        {/* Top Header matching Screenshot 2 */}
        <div className="p-6 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Progress Ring 40% */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-50 text-orange-600 font-bold text-xs shadow-2xs">
                40%
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TaskList</span>
                <h2 className="text-lg font-bold text-slate-900">{taskList.name || "Concrete work in progress"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                <b className="text-slate-800">14</b> Open &nbsp;<b className="text-slate-800">4</b> Closed
              </span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sub-header tags and metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold text-slate-700">
              {taskList.flag || "External"}
            </span>
            <span className="flex items-center gap-1 text-orange-600 font-semibold">
              📁 Donnelly Apartments Construction
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Tag className="h-3.5 w-3.5 text-orange-400" />
              <span>Tags: software, construction</span>
            </span>
          </div>

          {/* Cost & Budget Metrics Bar matching Screenshot 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-[10px] font-sans font-bold text-slate-400 block">PLANNED COST</span>
              <span className="text-blue-600 font-bold text-sm">$6,77,347.50</span>
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold text-slate-400 block">ACTUAL COST</span>
              <span className="text-emerald-600 font-bold text-sm">$2,194.76</span>
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold text-slate-400 block">BUDGET BALANCE</span>
              <span className="text-slate-900 font-bold text-sm">$6,75,152.74</span>
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold text-slate-400 block">FORECASTED COST</span>
              <span className="text-orange-600 font-bold text-sm">$2,96,251.47</span>
            </div>
          </div>

          {/* Horizontal Tabs matching Screenshot 2 */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold pt-2">
            {(["Tasks", "Comments", "Chart View"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-600"
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
          {/* TAB 1: CHART VIEW (Screenshot 2) */}
          {activeTab === "Chart View" && (
            <div className="space-y-6 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual SVG Pie Chart 1: Tasks By User matching Screenshot 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Tasks By User</h4>
                  <div className="flex items-center justify-center p-4">
                    {/* Multi-colored Pie Chart Graphic */}
                    <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#38bdf8" strokeWidth="20" strokeDasharray="60 190" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0284c7" strokeWidth="20" strokeDasharray="40 210" strokeDashoffset="-60" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="20" strokeDasharray="30 220" strokeDashoffset="-100" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="20" strokeDasharray="50 200" strokeDashoffset="-130" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="70 180" strokeDashoffset="-180" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />Monica Hemsworth (4)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />Fathima Yilmaz (1)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />Eduardo Vargas (2)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />Aravind Rajkumar (2)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />Lin Lin Brenn (3)</span>
                  </div>
                </div>

                {/* Visual SVG Pie Chart 2: Tasks By Status matching Screenshot 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Tasks By Status</h4>
                  <div className="flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="180 70" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" strokeWidth="20" strokeDasharray="20 230" strokeDashoffset="-180" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f43f5e" strokeWidth="20" strokeDasharray="50 200" strokeDashoffset="-200" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />Open - 13</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />In Progress - 1</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />Closed - 4</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TASKS LIST matching Screenshot 4 */}
          {activeTab === "Tasks" && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">Tasks in this Task List (18)</h4>
                <button
                  onClick={() => {
                    const taskName = prompt("Enter Task Title:");
                    if (taskName) {
                      alert(`Added task '${taskName}' to task list '${taskList.name}'.`);
                    }
                  }}
                  className="rounded bg-orange-500 hover:bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Add Task
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <div className="divide-y divide-slate-100 text-xs">
                  {["COA9-T93 Secure financing", "COA9-T94 Construction Loan settlement", "COA9-T95 Supply contract plans", "COA9-T96 Supply contract site plan"].map((t) => (
                    <div key={t} className="py-2.5 flex items-center justify-between">
                      <span className="font-bold text-slate-800">{t}</span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">On Track</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      const taskName = prompt("Enter Task Title:");
                      if (taskName) alert(`Added task '${taskName}'.`);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    + Add Task
                  </button>
                </div>
              </div>

              {/* Bottom email alias link matching Screenshot 4 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText("tasklist-coa9@taskpmp.local");
                    alert("Copied email address: tasklist-coa9@taskpmp.local");
                  }}
                  className="text-orange-600 hover:underline font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>To add Task via email to this Task list</span>
                  <span>📋</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COMMENTS */}
          {activeTab === "Comments" && (
            <div className="space-y-4 font-sans">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <textarea
                  rows={3}
                  placeholder="Enter your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-orange-500 focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    <span>Attach File</span>
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="rounded bg-orange-500 hover:bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Add Comment</span>
                  </button>
                </div>
              </div>

              {/* Comment Stream */}
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
        </div>
      </div>
    </div>
  );
}
