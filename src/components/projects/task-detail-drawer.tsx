"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Play,
  Pause,
  Square,
  Send,
  UserCheck,
  Check,
  Trash2
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TaskDetailDrawerProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (updatedTask: any) => void;
}

export default function TaskDetailDrawer({ task, isOpen, onClose, onUpdateTask }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "subtasks" | "documents" | "forums" | "dependency" | "activity">("comments");
  const [descOpen, setDescOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  // Live Task Timer Controls
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1845); // 00:30:45
  const [showCommentSuccessToast, setShowCommentSuccessToast] = useState(false);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Available Project Users for Owner Selection
  const availableOwners = [
    { name: "Ravi Saini", initials: "RS", color: "bg-rose-100 text-rose-800" },
    { name: "Sushil Verma", initials: "SV", color: "bg-blue-100 text-blue-800" },
    { name: "amin ibrahim", initials: "AI", color: "bg-emerald-100 text-emerald-800" },
    { name: "kannadas A", initials: "KA", color: "bg-amber-100 text-amber-800" },
    { name: "Arun primary - Senthil secondary", initials: "AS", color: "bg-purple-100 text-purple-800" },
    { name: "Unassigned", initials: "U", color: "bg-slate-100 text-slate-600" },
  ];

  // Form Fields
  const [owner, setOwner] = useState("Ravi Saini");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [status, setStatus] = useState("not yet Started");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("2025-12-22T19:00");
  const [dueDate, setDueDate] = useState("2025-12-23T11:00");
  const [duration, setDuration] = useState("01:00 hrs");
  const [reminder, setReminder] = useState("On Same Day");
  const [completionPct, setCompletionPct] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [commentsList, setCommentsList] = useState<Array<{ id: string; author: string; time: string; text: string }>>([
    { id: "c1", author: "Ravi Saini", time: "Today at 10:30 AM", text: "Initial task requirement analysis verified." }
  ]);
  const [activities, setActivities] = useState<Array<{ id: string; user: string; action: string; time: string }>>([
    { id: "a1", user: "Sushil Verma", action: "created task", time: "22-12-2025 07:00 PM" }
  ]);

  // Sync state when task prop changes
  useEffect(() => {
    if (task) {
      setOwner(task.owner || task.assignee?.name || "Ravi Saini");
      setStatus(task.status || "not yet Started");
      setPriority(task.priority ? task.priority.replace("! ", "") : "Medium");
      setStartDate(task.startDate ? parseToDateTimeInput(task.startDate) : "2025-12-22T19:00");
      setDueDate(task.dueDate ? parseToDateTimeInput(task.dueDate) : "2025-12-23T11:00");
      setDuration(task.duration || "01:00 hrs");
      setCompletionPct(task.pct ?? task.completionPct ?? 0);
      setDescriptionText(task.description || "");

      if (task.commentsList && task.commentsList.length > 0) {
        setCommentsList(task.commentsList);
      } else {
        // Load stored comments from localStorage if available
        try {
          const stored = localStorage.getItem(`task_comments_${task.id || task.key}`);
          if (stored) {
            setCommentsList(JSON.parse(stored));
          }
        } catch {}
      }
    }
  }, [task]);

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

  if (!isOpen || !task) return null;

  const handleFieldChange = (field: string, value: any) => {
    const updated = {
      ...task,
      [field]: value,
      commentsList,
    };

    if (field === "owner") setOwner(value);
    if (field === "status") setStatus(value);
    if (field === "priority") setPriority(value);
    if (field === "startDate") {
      setStartDate(value);
      calculateDuration(value, dueDate);
    }
    if (field === "dueDate") {
      setDueDate(value);
      calculateDuration(startDate, value);
    }
    if (field === "duration") setDuration(value);
    if (field === "pct") setCompletionPct(value);
    if (field === "description") setDescriptionText(value);

    // Notify parent
    if (onUpdateTask) {
      onUpdateTask(updated);
    }

    // Record Activity
    setActivities((prev) => [
      {
        id: String(Date.now()),
        user: owner || "Current User",
        action: `updated ${field} to "${value}"`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    // Async backend update if ID exists
    if (task.id && !task.id.startsWith("1P1-")) {
      fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      }).catch(() => {});
    }
  };

  const calculateDuration = (startIso: string, dueIso: string) => {
    try {
      const start = new Date(startIso).getTime();
      const due = new Date(dueIso).getTime();
      if (due > start) {
        const diffMs = due - start;
        const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
        setDuration(`${String(diffHrs).padStart(2, "0")}:00 hrs`);
      }
    } catch {}
  };

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToAdd = commentText.trim();
    if (!textToAdd) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newComment = {
      id: String(Date.now()),
      author: owner || "Ravi Saini",
      time: `Today at ${nowStr}`,
      text: textToAdd,
    };

    const updatedComments = [newComment, ...commentsList];
    setCommentsList(updatedComments);
    setCommentText("");
    setActiveTab("comments");
    setShowCommentSuccessToast(true);
    setTimeout(() => setShowCommentSuccessToast(false), 3000);

    // Persist to localStorage for persistence across reloads
    try {
      localStorage.setItem(`task_comments_${task.id || task.key}`, JSON.stringify(updatedComments));
    } catch {}

    const updatedTask = {
      ...task,
      owner,
      status,
      commentsList: updatedComments,
      commentsCount: updatedComments.length,
    };

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }

    // Persist comment to backend database API if task.id exists
    if (task.id && !task.id.startsWith("1P1-")) {
      fetch(`/api/tasks/${task.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "task.commented",
          text: textToAdd,
          details: JSON.stringify({ author: owner, text: textToAdd }),
        }),
      }).catch(() => {});
    }

    setActivities((prev) => [
      {
        id: String(Date.now()),
        user: owner || "Ravi Saini",
        action: `added comment: "${textToAdd.slice(0, 30)}..."`,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  // Rich Text Formatting helper
  const applyTextFormat = (prefix: string, suffix: string) => {
    setCommentText((prev) => `${prev}${prefix}formatted text${suffix}`);
  };

  const currentOwnerObj = availableOwners.find((o) => o.name === owner) || availableOwners[0];

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
              {task.key || task.id || "1P1-124"}
            </span>
          </div>

          {/* Live Timer Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-200/80 px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-800">
              <Clock className="h-3.5 w-3.5 text-[#0070BA]" />
              <span>{formatTimer(timerSeconds)}</span>
              {!timerRunning ? (
                <button
                  type="button"
                  onClick={() => { setTimerRunning(true); setTimerPaused(false); }}
                  className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  title="Start Live Timer"
                >
                  <Play className="h-3 w-3 fill-current" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTimerPaused(!timerPaused)}
                    className="p-1 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                    title={timerPaused ? "Resume Timer" : "Pause Timer"}
                  >
                    {timerPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      alert(`Timer stopped! Recorded ${formatTimer(timerSeconds)} to project timesheet.`);
                    }}
                    className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                    title="Stop Timer and Log Effort"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </button>
                </div>
              )}
            </div>

            {/* Trash Task Action Button */}
            <button
              type="button"
              onClick={async () => {
                if (confirm(`Move task '${task.title || task.key}' to Trash?`)) {
                  try {
                    const deletedTaskIds = JSON.parse(localStorage.getItem("deleted_task_ids") || "[]");
                    if (task.id && !deletedTaskIds.includes(task.id)) deletedTaskIds.push(task.id);
                    if (task.key && !deletedTaskIds.includes(task.key)) deletedTaskIds.push(task.key);
                    localStorage.setItem("deleted_task_ids", JSON.stringify(deletedTaskIds));
                  } catch {}

                  onClose();
                  const token = localStorage.getItem("token");
                  await fetch(`/api/tasks/${task.id}`, {
                    method: "DELETE",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  }).catch(() => {});
                  if (onUpdateTask) {
                    onUpdateTask({ ...task, isDeleted: true });
                  }
                  alert("Task moved to Trash.");
                }
              }}
              className="p-1.5 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              title="Move Task to Trash"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>

            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Task Title & Meta */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <input
            type="text"
            value={task.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="text-xl font-bold text-slate-900 w-full border-b border-transparent hover:border-slate-300 focus:border-[#0070BA] focus:outline-none"
          />
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span>By <strong className="text-slate-700 font-semibold">{task.creator?.name || "Sushil Verma"}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
              <FileText className="h-3.5 w-3.5" />
              {task.projectName || "01 PoC Projects"}
            </span>
          </div>

          {/* Interactive Status Badge under title */}
          <div className="mt-3">
            <select
              value={status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 focus:border-[#0070BA] focus:outline-none cursor-pointer"
            >
              <option value="not yet Started">not yet Started</option>
              <option value="In Progress">In Progress</option>
              <option value="in QA">in QA</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
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
              <div className="p-3">
                <textarea
                  rows={3}
                  value={descriptionText}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="NO DESCRIPTION AVAILABLE"
                  className="w-full text-xs font-mono text-slate-600 p-2 border border-slate-200 rounded focus:border-[#0070BA] focus:outline-none"
                />
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
                {/* Owner Field matching Screenshot 2 */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Owner</label>
                  <div
                    onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                    className="flex items-center justify-between rounded-md border border-slate-300 px-3 py-1.5 bg-white cursor-pointer hover:border-[#0070BA]"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-5 w-5 rounded-full font-bold text-[9px] flex items-center justify-center ${currentOwnerObj.color}`}>
                        {currentOwnerObj.initials}
                      </div>
                      <span className="font-bold text-slate-800">{owner}</span>
                    </div>
                    <X
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFieldChange("owner", "Unassigned");
                      }}
                      className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    />
                  </div>

                  {/* Owner Dropdown Menu */}
                  {showOwnerDropdown && (
                    <div className="absolute left-0 mt-1 z-50 w-full rounded-md bg-white p-1 shadow-lg border border-slate-200 font-sans">
                      {availableOwners.map((o) => (
                        <div
                          key={o.name}
                          onClick={() => {
                            handleFieldChange("owner", o.name);
                            setShowOwnerDropdown(false);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-blue-50 cursor-pointer text-xs font-semibold"
                        >
                          <div className={`h-5 w-5 rounded-full font-bold text-[9px] flex items-center justify-center ${o.color}`}>
                            {o.initials}
                          </div>
                          <span>{o.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Start Date Picker Calendar */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Start Date</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => handleFieldChange("startDate", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="not yet Started">not yet Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="in QA">in QA</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Duration Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => handleFieldChange("duration", e.target.value)}
                    placeholder="e.g. 01:00 hrs"
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                  />
                </div>

                {/* Due Date Picker Calendar */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Due Date</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Reminder Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Reminder</label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="On Same Day">On Same Day</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>

                {/* Priority Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => handleFieldChange("priority", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="None">None</option>
                  </select>
                </div>

                {/* Completion Percentage Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Completion Percentage</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={completionPct}
                      onChange={(e) => handleFieldChange("pct", Number(e.target.value))}
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
              type="button"
              onClick={() => setActiveTab("comments")}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "comments" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Comments ({commentsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "activity" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Activity Stream ({activities.length})
            </button>
          </div>

          {/* Comments Rich Text Editor Tab */}
          {activeTab === "comments" && (
            <form onSubmit={handleAddComment} className="rounded-md border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              {/* Success Notification Banner */}
              {showCommentSuccessToast && (
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Comment posted and saved successfully!</span>
                </div>
              )}

              {/* Existing Comments List */}
              <div className="space-y-2 mb-3 max-h-56 overflow-y-auto pr-1">
                {commentsList.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span className="text-[#0070BA]">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-slate-600">
                <button type="button" onClick={() => applyTextFormat("**", "**")} className="p-1.5 rounded hover:bg-slate-100 font-bold" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("*", "*")} className="p-1.5 rounded hover:bg-slate-100 italic" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("_", "_")} className="p-1.5 rounded hover:bg-slate-100 underline" title="Underline"><Underline className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("~", "~")} className="p-1.5 rounded hover:bg-slate-100 line-through" title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></button>
                <span className="h-4 border-r border-slate-200 mx-1" />
                <button type="button" onClick={() => applyTextFormat("\n- ", "")} className="p-1.5 rounded hover:bg-slate-100" title="Bullet List"><List className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("\n1. ", "")} className="p-1.5 rounded hover:bg-slate-100" title="Numbered List"><ListOrdered className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("`", "`")} className="p-1.5 rounded hover:bg-slate-100" title="Code"><Code className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => applyTextFormat("[", "](url)")} className="p-1.5 rounded hover:bg-slate-100" title="Insert Link"><LinkIcon className="h-3.5 w-3.5" /></button>
              </div>

              {/* Text Area */}
              <textarea
                rows={4}
                placeholder="Type your comment or update here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleAddComment(e);
                  }
                }}
                className="w-full rounded-md border border-slate-200 p-3 text-xs focus:border-[#0070BA] focus:outline-none"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#0070BA] hover:underline cursor-pointer flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  To add Task Comment via email
                </span>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="rounded-md bg-[#0070BA] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </form>
          )}

          {/* Activity Stream Tab */}
          {activeTab === "activity" && (
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs space-y-2 max-h-60 overflow-y-auto">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center gap-2 text-xs border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">{act.user}</span>
                  <span className="text-slate-600">{act.action}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
