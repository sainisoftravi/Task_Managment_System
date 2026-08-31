"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  MoreHorizontal,
  Copy,
  FolderInput,
  Layers,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Edit,
  Eye,
  Download,
  Sliders,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Tag
} from "lucide-react";

interface TaskDetailDrawerProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (updatedTask: any) => void;
}

export default function TaskDetailDrawer({ task, isOpen, onClose, onUpdateTask }: TaskDetailDrawerProps) {
  // Main Sub-Tab selection matching Screenshot 1 & 2
  const [activeTab, setActiveTab] = useState<
    "comments" | "subtasks" | "loghours" | "documents" | "invoices" | "forums" | "dependency" | "timeline" | "issues"
  >("comments");

  // Accordion toggles
  const [descOpen, setDescOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  // Live Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(21720); // 06:02:00
  const [showTimerLogModal, setShowTimerLogModal] = useState(false);
  const [timerCostPerHour, setTimerCostPerHour] = useState("50");
  const [timerBillable, setTimerBillable] = useState(true);
  const [timerNotes, setTimerNotes] = useState("Installation work logged");

  // Form Fields matching Screenshots 1, 2, 3, 4
  const [taskTitle, setTaskTitle] = useState("");
  const [taskKey, setTaskKey] = useState("DC-T1197");
  const [status, setStatus] = useState("Open");
  const [nextTransition, setNextTransition] = useState("D&P analysis");
  const [associatedTeams, setAssociatedTeams] = useState<string[]>(["User experience"]);
  const [owners, setOwners] = useState<string[]>(["John Marsh", "Lin Lin Brenn"]);
  const [workHours, setWorkHours] = useState("08:00 hrs");
  const [startDate, setStartDate] = useState("2024-02-13T08:00");
  const [dueDate, setDueDate] = useState("2024-05-30T09:00");
  const [duration, setDuration] = useState("609:00 hours");
  const [priority, setPriority] = useState("Medium");
  const [completionPct, setCompletionPct] = useState(35);
  const [tags, setTags] = useState<string[]>(["Construction", "Checklist"]);
  const [reminder, setReminder] = useState("None");
  const [recurrence, setRecurrence] = useState("Weekly");
  const [billingType, setBillingType] = useState("Billable");
  const [descriptionText, setDescriptionText] = useState("The quality of the ceramic tiles will be checked once in a week.");

  // Modals & Overlay States
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showEmailCommentModal, setShowEmailCommentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [showManageFieldsModal, setShowManageFieldsModal] = useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [showAssociateIssuesModal, setShowAssociateIssuesModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showAnnotateModal, setShowAnnotateModal] = useState(false);
  const [annotatingFile, setAnnotatingFile] = useState<any | null>(null);

  // Email Comment State
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Recurrence State matching Screenshots 1 & 2
  const [repeatType, setRepeatType] = useState("Monthly");
  const [basedOn, setBasedOn] = useState("Due Date");
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatEndsType, setRepeatEndsType] = useState("On");
  const [repeatEndsDate, setRepeatEndsDate] = useState("2026-12-03");
  const [onHolidays, setOnHolidays] = useState("Execute on previous working day");
  const [recurrenceTrigger, setRecurrenceTrigger] = useState("On Completion");
  const [recurringIncludedFields, setRecurringIncludedFields] = useState<string[]>([
    "Billing Type", "Followers", "Description", "Tags", "Attachments", "Associated Teams"
  ]);

  // Reminder Modal State matching Screenshot 3
  const [reminderType, setReminderType] = useState<"Daily" | "On a Date" | "Before a Date" | "After a Date" | "Before" | "After">("Before");
  const [reminderDate, setReminderDate] = useState("2025-12-25T10:00");
  const [reminderDaysCount, setReminderDaysCount] = useState(2);
  const [reminderUnit, setReminderUnit] = useState("days");
  const [reminderReference, setReminderReference] = useState("Due Date");
  const [reminderTime, setReminderTime] = useState("10:00");
  const [reminderUsers, setReminderUsers] = useState<string[]>(["Team-1", "Ravi Saini"]);
  const [reminderTemplate, setReminderTemplate] = useState("None");

  // Associate Blueprint State
  const [selectedBlueprint, setSelectedBlueprint] = useState("Budget Approval Process");
  const [blueprintStatusMap, setBlueprintStatusMap] = useState("Open");

  // Associate Issues State
  const [issueSearchQuery, setIssueSearchQuery] = useState("");
  const [associatedIssues, setAssociatedIssues] = useState([
    { id: "ISS-401", title: "Concrete tile moisture variance exceeds 4%", status: "OPEN", priority: "HIGH" }
  ]);

  // Comments State
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<Array<{ id: string; author: string; time: string; text: string }>>([
    { id: "c1", author: "taylor.brooks", time: "Feb 14 at 10:30 AM", text: "Please check the transition and update this task." }
  ]);

  // Documents State matching Screenshot 3
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; size: string; type: string }>>([
    { id: "doc-1", name: "Screenshot 2023-11-14 at 8.54.13 AM.png", size: "584KB", type: "image/png" }
  ]);

  // Subtasks State
  const [subtasks, setSubtasks] = useState([
    { id: "sub-1", title: "Initial inspection checklist review", completed: true },
    { id: "sub-2", title: "Tile moisture & hardness test", completed: false },
  ]);

  // Time Logs List
  const [timeLogs, setTimeLogs] = useState([
    { id: "tl-1", user: "Monica Hemsworth", hours: "06:02", date: "2024-02-14", notes: "Tile testing and site inspection", billable: true }
  ]);

  // Chat Conversations State
  const [chatMessages, setChatMessages] = useState([
    { id: "msg-1", sender: "Monica Hemsworth", time: "10:15 AM", text: "Initial inspection files uploaded to Documents." },
    { id: "msg-2", sender: "John Marsh", time: "10:20 AM", text: "Checked the tile moisture report. Looks good." }
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  // Sync with prop task
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "Ceramic Tile Check");
      setTaskKey(task.key || task.id || "DC-T1197");
      setStatus(task.status || "Open");
      setPriority(task.priority ? task.priority.replace("! ", "") : "Medium");
      if (task.description) setDescriptionText(task.description);
      if (task.owner) setOwners([task.owner]);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const emailAlias = `task-${taskKey.toLowerCase()}@reply.taskpmp.app`;

  const handleSaveField = (field: string, value: any) => {
    const updated = { ...task, [field]: value };
    if (onUpdateTask) onUpdateTask(updated);
  };

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    const newC = {
      id: String(Date.now()),
      author: owners[0] || "Ravi Saini",
      time: "Just now",
      text: commentText.trim(),
    };

    setCommentsList([newC, ...commentsList]);
    setCommentText("");
    alert("Comment added successfully!");
  };

  const handleSendEmailComment = () => {
    if (!emailBody.trim()) {
      alert("Please write an email message body.");
      return;
    }
    const newC = {
      id: String(Date.now()),
      author: "Email User (" + emailAlias + ")",
      time: "Just now",
      text: `[Via Email: ${emailSubject || "Task Comment"}]\n${emailBody}`,
    };
    setCommentsList([newC, ...commentsList]);
    setShowEmailCommentModal(false);
    setEmailSubject("");
    setEmailBody("");
    alert(`Email sent! Comment added to task ${taskKey}.`);
  };

  const handleSetReminder = () => {
    setReminder(`${reminderType} (${reminderTemplate})`);
    setShowReminderModal(false);
    alert(`Reminder configured successfully for ${reminderUsers.join(", ")}!`);
  };

  const handleMapBlueprint = () => {
    setStatus(blueprintStatusMap);
    setShowBlueprintModal(false);
    alert(`Blueprint '${selectedBlueprint}' associated. Task status mapped to '${blueprintStatusMap}'.`);
  };

  const handleAssociateIssue = () => {
    if (!issueSearchQuery.trim()) return;
    setAssociatedIssues([
      ...associatedIssues,
      { id: `ISS-${Date.now()}`, title: issueSearchQuery.trim(), status: "OPEN", priority: "MEDIUM" }
    ]);
    setIssueSearchQuery("");
    alert("Associated issue to task successfully!");
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: `msg-${Date.now()}`, sender: "Ravi Saini", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: newChatMessage.trim() }
    ]);
    setNewChatMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs font-sans text-xs">
      <div className="h-full w-full max-w-5xl bg-white shadow-2xl border-l border-slate-200 flex flex-row overflow-hidden animate-slideLeft">
        
        {/* Left Side Task Checklist Bar matching Screenshot 1 & 2 */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between font-bold text-slate-800">
            <span>Checklist 1</span>
            <Sliders className="h-3.5 w-3.5 text-orange-500 cursor-pointer" />
          </div>

          <div className="p-2 space-y-2 overflow-y-auto flex-1">
            <div className="p-3 bg-white rounded-lg border border-orange-300 shadow-xs space-y-1.5 cursor-pointer">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-500">{taskKey}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0070BA] font-bold text-[10px] border border-blue-200">
                  {status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{taskTitle}</h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>{owners.join(", ")}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-orange-500" />
                  <AlertCircle className="h-3 w-3 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Other Tasks in Checklist */}
            <div className="p-3 bg-white/70 rounded-lg border border-slate-200 space-y-1 cursor-pointer hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-400">DA8-T29</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">Open</span>
              </div>
              <h4 className="font-semibold text-slate-800 text-xs">Termite treatment</h4>
              <p className="text-[10px] text-slate-400">Lin Lin Brenn</p>
            </div>

            <div className="p-3 bg-white/70 rounded-lg border border-slate-200 space-y-1 cursor-pointer hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-400">DA8-T30</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">New</span>
              </div>
              <h4 className="font-semibold text-slate-800 text-xs">Pour basement slab</h4>
              <p className="text-[10px] text-slate-400">Kavitha Raj, Lin Lin Brenn</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Top Header Band matching Screenshot 1 & 2 */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Task
                </span>
                <span className="bg-blue-50 text-[#0070BA] font-mono font-bold text-xs px-2 py-0.5 rounded border border-blue-200">
                  {taskKey}
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900">{taskTitle}</h1>
              
              {/* Metadata Toolbar Icons */}
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="hover:text-orange-600 cursor-pointer flex items-center gap-1 text-orange-500"
                  title="Set Reminder"
                >
                  <Bell className="h-3.5 w-3.5" />
                </button>
                <span>By <strong className="text-slate-800">Monica Hemsworth</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  Donnelly Residential Apartments Construction
                </span>
                <span className="flex items-center gap-2 text-slate-400 ml-2">
                  <span title="Start Discussion" onClick={() => setShowChatDrawer(true)} className="hover:text-blue-600 cursor-pointer">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </span>
                  <span title="Attachments" onClick={() => setActiveTab("documents")} className="hover:text-blue-600 cursor-pointer">
                    <Paperclip className="h-3.5 w-3.5" />
                  </span>
                  <span title="Start Timer / Log Hours" onClick={() => setShowTimerLogModal(true)} className="hover:text-orange-600 cursor-pointer">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] font-bold text-amber-600">-(1)</span>
                </span>
              </div>
            </div>

            {/* Right Action Icons matching Screenshot 1 & 2 */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 font-bold text-lg cursor-pointer"
                  title="More Options"
                >
                  •••
                </button>

                {showMoreActions && (
                  <div className="absolute right-0 top-8 z-50 w-52 bg-white rounded-md shadow-xl border border-slate-200 p-1 space-y-0.5 text-xs font-semibold">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Task link copied to clipboard!");
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5 text-blue-600" /> Copy Link
                    </button>
                    <button
                      onClick={() => {
                        alert("You are now following this task.");
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Follow Task
                    </button>
                    <button
                      onClick={() => {
                        setShowBlueprintModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-orange-600" /> Associate Blueprint
                    </button>
                    <button
                      onClick={() => {
                        alert("Macro Rule Executed successfully!");
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer"
                    >
                      <Sliders className="h-3.5 w-3.5 text-purple-600" /> Execute Macro Rule
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this task?")) {
                          onClose();
                        }
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Task
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => alert("Added followers to task")}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Add Followers"
              >
                +👤
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status & Blueprint Banner matching Screenshot 1 & 4 */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT STATUS</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="font-bold text-xs text-[#0070BA] bg-transparent border-b border-dashed border-[#0070BA] focus:outline-none cursor-pointer"
                >
                  <option value="Open">Open 🔒</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">NEXT TRANSITIONS</span>
                <button
                  onClick={() => {
                    setStatus("In Progress");
                    alert("Transitioned status to D&P Analysis!");
                  }}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded text-xs cursor-pointer shadow-2xs"
                >
                  {nextTransition}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500">Budget Approval Process</span>
              <p className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer">
                Blueprint- Preview
              </p>
            </div>
          </div>

          {/* Sub-Tabs Bar matching Screenshot 1 */}
          <div className="flex items-center gap-6 border-b border-slate-200 px-6 pt-2 text-xs font-bold bg-white">
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "comments" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Comments ({commentsList.length})
            </button>

            <button
              onClick={() => setActiveTab("subtasks")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "subtasks" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Subtasks ({subtasks.length})
            </button>

            <button
              onClick={() => setActiveTab("loghours")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "loghours" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Log Hours (06:02)
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "documents" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Documents ({documents.length})
            </button>

            <button
              onClick={() => setActiveTab("dependency")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "dependency" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Dependency (1)
            </button>

            <button
              onClick={() => setActiveTab("issues")}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "issues" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Issues ({associatedIssues.length})
            </button>
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Description Accordion matching Screenshot 2 */}
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div
                onClick={() => setDescOpen(!descOpen)}
                className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 cursor-pointer font-bold text-xs text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${descOpen ? "rotate-90" : ""}`} />
                  <span>Description</span>
                  <Edit className="h-3.5 w-3.5 text-[#0070BA]" />
                </div>
              </div>
              {descOpen && (
                <div className="p-4">
                  <textarea
                    rows={2}
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 p-2.5 border border-slate-200 rounded focus:border-[#0070BA] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Task Information Form matching Screenshot 2 */}
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-2xs">
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
                  {/* Associated Team */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Associated Team</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {associatedTeams.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
                          {t}
                          <X onClick={() => setAssociatedTeams(associatedTeams.filter(x => x !== t))} className="h-3 w-3 cursor-pointer hover:text-rose-900" />
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const t = prompt("Enter team name:");
                          if (t) setAssociatedTeams([...associatedTeams, t]);
                        }}
                        className="text-[11px] font-bold text-[#0070BA] hover:underline"
                      >
                        + Select Teams
                      </button>
                    </div>
                  </div>

                  {/* Owner Field matching Screenshot 2 */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Owner</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {owners.map((o) => (
                        <span key={o} className="px-2.5 py-1 rounded bg-orange-50 text-orange-900 font-bold border border-orange-200 flex items-center gap-1">
                          <User className="h-3 w-3 text-orange-600" />
                          {o}
                          <X onClick={() => setOwners(owners.filter(x => x !== o))} className="h-3 w-3 cursor-pointer hover:text-orange-900" />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded border border-slate-300 px-3 py-1.5 font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="To be Tested">To be Tested</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Closed">Closed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>

                  {/* Duration (Max 10 Years Validation) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Duration (Max 10 Yrs)</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 609:00 hours or 5 Days"
                      className="w-full rounded border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded border border-slate-300 px-3 py-1.5 font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Completion Percentage */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Completion Percentage</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={completionPct}
                        onChange={(e) => setCompletionPct(Number(e.target.value))}
                        className="w-full rounded border border-slate-300 px-3 py-1.5 font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none"
                      />
                      <span className="font-bold text-slate-500">%</span>
                    </div>
                  </div>

                  {/* Reminder */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Reminder</label>
                    <button
                      type="button"
                      onClick={() => setShowReminderModal(true)}
                      className="w-full text-left rounded border border-slate-300 px-3 py-1.5 font-semibold text-[#0070BA] hover:bg-blue-50 cursor-pointer"
                    >
                      {reminder !== "None" ? reminder : "Set Reminder..."}
                    </button>
                  </div>

                  {/* Recurrence matching Screenshot 1 & 2 */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Recurrence</label>
                    <button
                      type="button"
                      onClick={() => setShowRecurrenceModal(!showRecurrenceModal)}
                      className="w-full text-left rounded border border-slate-300 px-3 py-1.5 font-semibold text-[#0070BA] hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                    >
                      <span>{recurrence !== "None" ? recurrence : "Set Recurrence..."}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SUB-TAB CONTENT 1: COMMENTS TAB matching Screenshot 1 */}
            {activeTab === "comments" && (
              <div className="space-y-4">
                <form onSubmit={handleAddComment} className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
                  {/* Rich Text Toolbar matching Screenshot 1 */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-slate-700">
                    <button type="button" onClick={() => setCommentText(prev => prev + " **bold**")} className="p-1.5 rounded hover:bg-slate-100 font-bold">B</button>
                    <button type="button" onClick={() => setCommentText(prev => prev + " *italic*")} className="p-1.5 rounded hover:bg-slate-100 italic">I</button>
                    <button type="button" onClick={() => setCommentText(prev => prev + " _underline_")} className="p-1.5 rounded hover:bg-slate-100 underline">U</button>
                    <button type="button" onClick={() => setCommentText(prev => prev + " ~strike~")} className="p-1.5 rounded hover:bg-slate-100 line-through">S</button>
                    <span className="h-4 border-r border-slate-300 mx-1" />
                    <button type="button" className="px-2 py-0.5 text-xs font-semibold rounded border border-slate-200">Roboto ▾</button>
                    <button type="button" className="px-2 py-0.5 text-xs font-semibold rounded border border-slate-200">13 ▾</button>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Add a comment to this task..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 rounded border border-slate-200 text-xs focus:border-[#0070BA] focus:outline-none"
                  />

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    {/* Red Highlighted Link matching Screenshot 1 */}
                    <button
                      type="button"
                      onClick={() => setShowEmailCommentModal(true)}
                      className="text-orange-600 font-bold hover:underline cursor-pointer border border-orange-300 bg-orange-50 px-3 py-1.5 rounded flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>To add Task Comment via email 📋</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCommentText("")}
                        className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded shadow-xs cursor-pointer"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3">
                  {commentsList.map((c) => (
                    <div key={c.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span className="text-[#0070BA]">{c.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB CONTENT 2: SUBTASKS TAB */}
            {activeTab === "subtasks" && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Subtasks List</h3>
                  <button
                    onClick={() => {
                      const t = prompt("Enter subtask title:");
                      if (t) setSubtasks([...subtasks, { id: `sub-${Date.now()}`, title: t, completed: false }]);
                    }}
                    className="bg-[#0070BA] text-white px-3 py-1.5 rounded font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    + Add Subtask
                  </button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={(e) =>
                          setSubtasks(subtasks.map((s) => (s.id === st.id ? { ...s, completed: e.target.checked } : s)))
                        }
                        className="h-4 w-4 text-[#0070BA] rounded cursor-pointer"
                      />
                      <span className={`font-semibold ${st.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB CONTENT 3: LOG HOURS TAB */}
            {activeTab === "loghours" && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Logged Work Hours (Total: 06:02)</h3>
                  <button
                    onClick={() => setShowTimerLogModal(true)}
                    className="bg-orange-600 text-white px-3 py-1.5 rounded font-bold hover:bg-orange-700 cursor-pointer"
                  >
                    + Log Hours
                  </button>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">USER</th>
                      <th className="py-2.5 px-3">HOURS</th>
                      <th className="py-2.5 px-3">DATE</th>
                      <th className="py-2.5 px-3">NOTES</th>
                      <th className="py-2.5 px-3">BILLING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {timeLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{log.user}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-orange-600">{log.hours}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{log.date}</td>
                        <td className="py-2.5 px-3 text-slate-700">{log.notes}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {log.billable ? "Billable" : "Non-Billable"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-TAB CONTENT 4: DOCUMENTS & ANNOTATION TAB matching Screenshot 3 */}
            {activeTab === "documents" && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex gap-4 font-bold text-slate-600">
                    <span className="text-orange-600 border-b-2 border-orange-600 pb-1">Desktop</span>
                    <span className="hover:text-slate-900 cursor-pointer">WorkDrive</span>
                    <span className="hover:text-slate-900 cursor-pointer">Google Drive</span>
                    <span className="hover:text-slate-900 cursor-pointer">SharePoint</span>
                    <span className="hover:text-slate-900 cursor-pointer">Dropbox</span>
                  </div>
                </div>

                {/* Files List with Annotate Icon matching Screenshot 3 */}
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Paperclip className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                        </div>
                      </div>

                      {/* Annotate Button matching Screenshot 3 */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAnnotatingFile(doc);
                            setShowAnnotateModal(true);
                          }}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Annotate File 📝</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Dropzone */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-2 bg-slate-50/50">
                  <Download className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 text-xs">Paste an image, drag and drop files, or click here to upload.</p>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Enter attachment file name:");
                      if (name) setDocuments([...documents, { id: `doc-${Date.now()}`, name, size: "1.2MB", type: "file" }]);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer text-xs"
                  >
                    Attach Files
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB CONTENT 5: DEPENDENCY TAB */}
            {activeTab === "dependency" && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Task Dependency Status</h3>
                <p className="text-slate-600 text-xs">
                  Displays whether this task is <strong>waiting for</strong> other tasks or <strong>blocking</strong> downstream tasks.
                </p>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold text-xs">Waiting For:</span>
                  <p className="text-xs text-amber-800 font-mono">DC-T1196 Site Preparation (Status: Closed)</p>
                </div>
              </div>
            )}

            {/* SUB-TAB CONTENT 6: ISSUES TAB */}
            {activeTab === "issues" && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Associated Issues</h3>
                  <button
                    onClick={() => setShowAssociateIssuesModal(true)}
                    className="bg-orange-600 text-white px-3 py-1.5 rounded font-bold hover:bg-orange-700 cursor-pointer text-xs"
                  >
                    + Associate Issue
                  </button>
                </div>

                <div className="space-y-2">
                  {associatedIssues.map((iss) => (
                    <div key={iss.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#0070BA] text-xs">{iss.id}</span>
                        <p className="font-bold text-slate-900 text-xs">{iss.title}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">
                        {iss.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Floating Right Side Navigation Icons matching Screenshots 1, 2, 4 */}
        <div className="w-12 bg-slate-900 text-slate-400 flex flex-col items-center py-4 space-y-6 flex-shrink-0 border-l border-slate-800">
          <button
            onClick={() => setShowChatDrawer(true)}
            className="p-2 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Task Discussion Chat"
          >
            <MessageSquare className="h-5 w-5 text-blue-400" />
          </button>
          <button
            onClick={() => setShowBlueprintModal(true)}
            className="p-2 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Blueprint Mapping"
          >
            <Sparkles className="h-5 w-5 text-orange-400" />
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className="p-2 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Task Documents & Attachments"
          >
            <Download className="h-5 w-5 text-emerald-400" />
          </button>
        </div>

      </div>

      {/* MODAL 1: EMAIL COMMENT MODAL (Red Link Trigger) */}
      {showEmailCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Task Comment Via Email</h3>
              <button onClick={() => setShowEmailCommentModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded bg-blue-50 border border-blue-200 space-y-1">
              <span className="font-bold text-[#0070BA]">Task Email Alias:</span>
              <div className="flex items-center justify-between font-mono bg-white p-2 rounded border border-blue-200 text-slate-800">
                <span>{emailAlias}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(emailAlias);
                    alert("Copied email alias to clipboard!");
                  }}
                  className="text-[#0070BA] font-bold hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:border-[#0070BA] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Type your email response..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:border-[#0070BA] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSendEmailComment}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer"
              >
                Send Email &amp; Post Comment
              </button>
              <button
                type="button"
                onClick={() => setShowEmailCommentModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SET REMINDER MODAL matching Screenshot 3 */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Set Task Reminder</h3>
              <button onClick={() => setShowReminderModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Reminder Type</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded font-bold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="Before">Before</option>
                  <option value="After">After</option>
                  <option value="On due date">On due date</option>
                  <option value="On a Date">On a Date</option>
                </select>
              </div>

              {reminderType === "Before" || reminderType === "After" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={reminderDaysCount}
                    onChange={(e) => setReminderDaysCount(Number(e.target.value))}
                    className="w-20 p-2 border border-slate-300 rounded font-bold text-slate-800 text-center"
                  />
                  <select
                    value={reminderUnit}
                    onChange={(e) => setReminderUnit(e.target.value)}
                    className="p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                  >
                    <option value="days">days</option>
                    <option value="hours">hours</option>
                  </select>
                  <span className="font-semibold text-slate-500">From</span>
                  <select
                    value={reminderReference}
                    onChange={(e) => setReminderReference(e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                  >
                    <option value="Due Date">Due Date</option>
                    <option value="Start Date">Start Date</option>
                    <option value="Created Date">Created Date</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">Time</label>
                <input
                  type="text"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  placeholder="10:00"
                  className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Notify users associated with the Task <span className="text-rose-500">*</span>
                </label>
                <div className="p-2 border border-slate-300 rounded bg-white flex flex-wrap gap-1.5 min-h-[38px] items-center">
                  {reminderUsers.map((u) => (
                    <span key={u} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-bold text-slate-700 text-xs flex items-center gap-1">
                      {u}
                      <X onClick={() => setReminderUsers(reminderUsers.filter(x => x !== u))} className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-700" />
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const u = prompt("Enter username or team:");
                      if (u) setReminderUsers([...reminderUsers, u]);
                    }}
                    className="text-xs font-bold text-[#0070BA] hover:underline px-1"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Email Template</label>
                  <button
                    type="button"
                    onClick={() => alert("Redirecting to Create Email Template in Setup...")}
                    className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Create mail template
                  </button>
                </div>
                <select
                  value={reminderTemplate}
                  onChange={(e) => setReminderTemplate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
                >
                  <option value="None">None</option>
                  <option value="Default Task Deadline Template">Default Task Deadline Template</option>
                  <option value="Urgent Escalation Template">Urgent Escalation Template</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSetReminder}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer shadow-2xs"
              >
                Set Reminder
              </button>
              <button
                type="button"
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RECURRENCE POPOVER & MODAL matching Screenshots 1 & 2 */}
      {showRecurrenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Task Recurrence Schedule</h3>
              <button onClick={() => setShowRecurrenceModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Repeat Type</label>
                  <select
                    value={repeatType}
                    onChange={(e) => setRepeatType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="After">After</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Based On</label>
                  <select
                    value={basedOn}
                    onChange={(e) => setBasedOn(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                  >
                    <option value="Due Date">Due Date</option>
                    <option value="Start Date">Start Date</option>
                    <option value="Schedule">Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Repeat Every</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={repeatEvery}
                      onChange={(e) => setRepeatEvery(Number(e.target.value))}
                      className="w-20 p-2 border border-slate-300 rounded font-bold text-slate-800 text-center"
                    />
                    <span className="font-semibold text-slate-700">month(s)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ends</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={repeatEndsType}
                      onChange={(e) => setRepeatEndsType(e.target.value)}
                      className="p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                    >
                      <option value="On">On</option>
                      <option value="After">After</option>
                      <option value="Never">Never</option>
                    </select>
                    {repeatEndsType === "On" && (
                      <input
                        type="date"
                        value={repeatEndsDate}
                        onChange={(e) => setRepeatEndsDate(e.target.value)}
                        className="flex-1 p-2 border border-slate-300 rounded font-mono font-bold text-slate-800"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">On holidays</label>
                  <select
                    value={onHolidays}
                    onChange={(e) => setOnHolidays(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
                  >
                    <option value="Execute on previous working day">Execute on previous working day</option>
                    <option value="Execute on next working day">Execute on next working day</option>
                    <option value="Skip holiday">Skip holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Trigger</label>
                  <select
                    value={recurrenceTrigger}
                    onChange={(e) => setRecurrenceTrigger(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                  >
                    <option value="On Completion">On Completion</option>
                    <option value="On Schedule">On Schedule</option>
                    <option value="First to Occur">First to Occur</option>
                  </select>
                </div>

                {/* Red Highlighted Link matching Screenshots 1 & 2 */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowManageFieldsModal(true)}
                    className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Manage fields for recurring task ({recurringIncludedFields.length})
                  </button>
                </div>
              </div>

              {/* Right Mini Calendar Widget matching Screenshot 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>&laquo; &lt;</span>
                    <span>Mar 2026</span>
                    <span>&gt; &raquo;</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                    {[23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((day, idx) => (
                      <span
                        key={idx}
                        className={`py-1 rounded ${
                          day === 12
                            ? "bg-orange-600 text-white font-bold rounded-full"
                            : "hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setRecurrence(`${repeatType} (${basedOn})`);
                      setShowRecurrenceModal(false);
                      alert(`Task recurrence set to '${repeatType}' based on '${basedOn}'`);
                    }}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md shadow-2xs cursor-pointer text-xs"
                  >
                    Set Recurrence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: INCLUDE IN RECURRING TASK MODAL matching Screenshot 2 */}
      {showManageFieldsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Include in recurring task</h4>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRecurringIncludedFields([
                        "Comments", "Subtasks", "Billing Type", "Followers", "Description", "Tags", "Attachments", "Associated Teams"
                      ]);
                    } else {
                      setRecurringIncludedFields([]);
                    }
                  }}
                  className="rounded text-orange-600 focus:ring-0 cursor-pointer"
                />
                <span>Select All</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700 font-semibold">
              {[
                "Comments", "Subtasks", "Billing Type",
                "Followers", "Description", "Tags",
                "Attachments", "Associated Teams"
              ].map((f) => {
                const isChecked = recurringIncludedFields.includes(f);
                return (
                  <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRecurringIncludedFields([...recurringIncludedFields, f]);
                        } else {
                          setRecurringIncludedFields(recurringIncludedFields.filter(x => x !== f));
                        }
                      }}
                      className="rounded text-orange-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{f}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowManageFieldsModal(false)}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer shadow-2xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowManageFieldsModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSOCIATE BLUEPRINT MODAL matching Screenshot 4 */}
      {showBlueprintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Associate Blueprint</h3>
              <button onClick={() => setShowBlueprintModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Blueprint *</label>
                <select
                  value={selectedBlueprint}
                  onChange={(e) => setSelectedBlueprint(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                >
                  <option value="Budget Approval Process">Budget Approval Process</option>
                  <option value="RTA">RTA</option>
                  <option value="Software QA Lifecycle">Software QA Lifecycle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Status *</label>
                <select
                  value={blueprintStatusMap}
                  onChange={(e) => setBlueprintStatusMap(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                >
                  <option value="Open">Open</option>
                  <option value="D&P Analysis">D&amp;P Analysis</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleMapBlueprint}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer"
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setShowBlueprintModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FILE ANNOTATION CANVAS MODAL */}
      {showAnnotateModal && annotatingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Annotate File: {annotatingFile.name}</h3>
              <button onClick={() => setShowAnnotateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 h-64 flex items-center justify-center relative">
              <div className="text-center space-y-2">
                <Edit className="h-12 w-12 text-orange-600 mx-auto" />
                <p className="font-bold text-slate-800">Image Canvas Markup Engine Active</p>
                <p className="text-slate-500 text-xs">Draw, add text highlights, or obscure sensitive areas on attachment.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  alert("File annotations saved successfully!");
                  setShowAnnotateModal(false);
                }}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: CHAT CONVERSATIONS DRAWER */}
      {showChatDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col font-sans text-xs animate-slideLeft">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span>Task Discussion</span>
            </h3>
            <button onClick={() => setShowChatDrawer(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span className="text-[#0070BA]">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                </div>
                <p className="text-slate-700">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a message..."
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendChatMessage(); }}
              className="flex-1 p-2 border border-slate-300 rounded text-xs focus:border-[#0070BA] focus:outline-none"
            />
            <button
              onClick={handleSendChatMessage}
              className="p-2 bg-[#0070BA] hover:bg-blue-700 text-white rounded font-bold cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: ASSOCIATE ISSUES MODAL */}
      {showAssociateIssuesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans text-xs">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Associate Issues to Task</h3>
              <button onClick={() => setShowAssociateIssuesModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-slate-800">Search Existing Issue Title or ID</label>
              <input
                type="text"
                placeholder="Enter issue title or issue ID..."
                value={issueSearchQuery}
                onChange={(e) => setIssueSearchQuery(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded font-semibold focus:border-[#0070BA] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAssociateIssue}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded cursor-pointer"
              >
                Associate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
