"use client";

import { useState } from "react";
import { Task } from "@/types";
import {
  X,
  User,
  Calendar,
  Clock,
  Bell,
  Percent,
  CheckCircle,
  MessageSquare,
  FileText,
  Paperclip,
  Share2,
  Lock,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Image,
  Table,
  Quote,
  Smile,
  Maximize2,
  Mail,
  Plus
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "subtasks" | "documents" | "forums" | "dependency" | "activity">("comments");
  const [descOpen, setDescOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  // Form Fields
  const [owner, setOwner] = useState(task?.assignee?.name || "Ravi Saini");
  const [status, setStatus] = useState(task?.status || "not yet Started");
  const [priority, setPriority] = useState(task?.priority || "Low");
  const [startDate, setStartDate] = useState(task?.startDate || "2025-12-22T19:00");
  const [dueDate, setDueDate] = useState(task?.dueDate || "2025-12-23T11:00");
  const [duration, setDuration] = useState("01:00 hrs");
  const [reminder, setReminder] = useState("None");
  const [completionPct, setCompletionPct] = useState((task as any)?.completionPct ?? 0);
  const [commentText, setCommentText] = useState("");

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="h-full w-full max-w-4xl bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Header Band */}
        <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#0070BA] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
              Task
            </span>
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
              {task.key || "1P1-T19"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Task Title & Meta */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <h1 className="text-xl font-bold text-slate-900">{task.title || "02 Project Master Excel"}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span>By <strong className="text-slate-700 font-semibold">{(task as any).creator?.name || "Sushil Verma"}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
              <FileText className="h-3.5 w-3.5" />
              {(task as any).projectName || "01 PoC Projects"}
            </span>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              {status}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Accordion: Description */}
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div
              onClick={() => setDescOpen(!descOpen)}
              className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 cursor-pointer font-bold text-xs text-slate-800"
            >
              <div className="flex items-center gap-1.5">
                <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${descOpen ? "rotate-90" : ""}`} />
                <span>Description</span>
                <Plus className="h-3.5 w-3.5 text-[#0070BA]" />
              </div>
            </div>
            {descOpen && (
              <div className="p-4 text-xs font-mono text-slate-400">
                {task.description || "NO DESCRIPTION AVAILABLE"}
              </div>
            )}
          </div>

          {/* Accordion: Task Information Grid */}
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div
              onClick={() => setInfoOpen(!infoOpen)}
              className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 cursor-pointer font-bold text-xs text-slate-800"
            >
              <div className="flex items-center gap-1.5">
                <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${infoOpen ? "rotate-90" : ""}`} />
                <span>Task Information</span>
              </div>
            </div>

            {infoOpen && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Owner</label>
                  <div className="flex items-center justify-between rounded-md border border-slate-300 px-3 py-1.5 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-rose-200 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                        RS
                      </div>
                      <span className="font-bold text-slate-800">{owner}</span>
                    </div>
                    <X className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-slate-700" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Start Date</label>
                  <input
                    type="text"
                    value="22-12-2025 07:00 PM"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="not yet Started">not yet Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono text-slate-800 focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Due Date</label>
                  <input
                    type="text"
                    value="23-12-2025 11:00 AM"
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Reminder</label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="None">None</option>
                    <option value="On Same Day">On Same Day</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Completion Percentage</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={completionPct}
                      onChange={(e) => setCompletionPct(Number(e.target.value))}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Tabs Bar */}
          <div className="border-b border-slate-200 text-xs font-bold flex items-center gap-6 pt-2">
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "comments" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab("subtasks")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "subtasks" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Subtasks
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "documents" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab("forums")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "forums" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Forums
            </button>
            <button
              onClick={() => setActiveTab("dependency")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "dependency" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Dependency
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "activity" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Activity Stream
            </button>
          </div>

          {/* Comments Rich Text Editor Tab */}
          {activeTab === "comments" && (
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-slate-600">
                <button className="p-1.5 rounded hover:bg-slate-100 font-bold"><Bold className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 italic"><Italic className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 underline"><Underline className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 line-through"><Strikethrough className="h-3.5 w-3.5" /></button>
                <span className="h-4 border-r border-slate-200 mx-1" />
                <button className="p-1.5 rounded hover:bg-slate-100"><List className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><ListOrdered className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><Code className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><LinkIcon className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><Image className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><Table className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><Quote className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100"><Smile className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 ml-auto"><Maximize2 className="h-3.5 w-3.5" /></button>
              </div>

              {/* Text Area */}
              <textarea
                rows={5}
                placeholder="Type your comment or update here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-md border border-slate-200 p-3 text-xs focus:border-[#0070BA] focus:outline-none"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#0070BA] hover:underline cursor-pointer flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  To add Task Comment via email
                </span>
                <button className="rounded-md bg-[#0070BA] px-4 py-1.5 font-bold text-white hover:bg-blue-700">
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
