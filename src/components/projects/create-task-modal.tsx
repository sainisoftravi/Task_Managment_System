"use client";

import { useState, useEffect } from "react";
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Image,
  Upload,
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Maximize2
} from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: any) => void;
  taskLists?: Array<{ id: string; name: string }>;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onAddTask,
  taskLists = [
    { id: "tl1", name: "General Task List" },
  ],
}: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTaskList, setSelectedTaskList] = useState(taskLists[0]?.name || "General Task List");
  const [owner, setOwner] = useState("Select User");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState("01:00 hrs");
  const [priority, setPriority] = useState("None");
  const [reminder, setReminder] = useState("None");
  const [layout, setLayout] = useState("Standard Layout");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(true);

  useEffect(() => {
    if (taskLists && taskLists.length > 0) {
      setSelectedTaskList(taskLists[0].name);
    }
  }, [taskLists]);

  if (!isOpen) return null;

  const handleApplyFormat = (tagPrefix: string, tagSuffix: string) => {
    setDescription((prev) => `${prev}${tagPrefix}formatted text${tagSuffix}`);
  };

  const handleSubmit = (keepOpen = false) => {
    if (!taskName.trim()) {
      alert("Please enter a Task Name");
      return;
    }

    const newTask = {
      id: `1P1-T${Date.now().toString().slice(-3)}`,
      key: `1P1-T${Date.now().toString().slice(-3)}`,
      title: taskName.trim(),
      description: description.trim(),
      taskList: selectedTaskList,
      owner: owner === "Select User" ? "Unassigned" : owner,
      status: "not yet Started",
      startDate: startDate || "2025-12-22T19:00",
      dueDate: dueDate || "2025-12-23T11:00",
      duration: duration || "01:00 hrs",
      priority: priority === "None" ? "! None" : `! ${priority}`,
      pct: 0,
    };

    onAddTask(newTask);

    // Reset form
    setTaskName("");
    setDescription("");
    setStartDate("");
    setDueDate("");

    if (!keepOpen) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Top Header matching Screenshot 1 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900">New Task</h2>
          <div className="flex items-center gap-3">
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1 focus:border-[#0070BA] focus:outline-none cursor-pointer"
            >
              <option value="Standard Layout">Standard Layout</option>
              <option value="Software BugTracker">Software BugTracker</option>
              <option value="Construction WBS">Construction WBS</option>
            </select>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body matching Screenshot 1 & 2 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Task Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Task Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full rounded-md border border-[#0070BA]/50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0070BA] focus:ring-1 focus:ring-[#0070BA] focus:outline-none bg-white shadow-2xs"
            />
          </div>

          {/* Add Description Rich Text Editor matching Screenshot 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 cursor-pointer">
              <ChevronDown className="h-3.5 w-3.5" />
              <span>Add Description</span>
            </div>

            <div className="rounded-md border border-slate-300 bg-white overflow-hidden shadow-2xs">
              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 bg-slate-50/50 text-slate-600 text-xs">
                <button type="button" onClick={() => handleApplyFormat("**", "**")} className="p-1.5 rounded hover:bg-slate-200 font-bold" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("*", "*")} className="p-1.5 rounded hover:bg-slate-200 italic" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("_", "_")} className="p-1.5 rounded hover:bg-slate-200 underline" title="Underline"><Underline className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("~", "~")} className="p-1.5 rounded hover:bg-slate-200 line-through" title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></button>
                <span className="h-4 border-r border-slate-300 mx-1" />
                <span className="text-xs font-semibold px-2">Puvi</span>
                <span className="h-4 border-r border-slate-300 mx-1" />
                <span className="text-xs font-mono font-semibold px-1">13</span>
                <span className="h-4 border-r border-slate-300 mx-1" />
                <button type="button" onClick={() => handleApplyFormat("\n- ", "")} className="p-1.5 rounded hover:bg-slate-200" title="Bullet List"><List className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("\n1. ", "")} className="p-1.5 rounded hover:bg-slate-200" title="Numbered List"><ListOrdered className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("`", "`")} className="p-1.5 rounded hover:bg-slate-200" title="Code"><Code className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleApplyFormat("[", "](url)")} className="p-1.5 rounded hover:bg-slate-200" title="Link"><LinkIcon className="h-3.5 w-3.5" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Image"><Image className="h-3.5 w-3.5" /></button>
                <div className="ml-auto flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700 cursor-pointer" />
                </div>
              </div>

              {/* Description Textarea */}
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type task description details here..."
                className="w-full p-3 text-xs focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Task List Selector matching Screenshot 1 & 2 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Task List</label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                Choose Completed List
              </button>
            </div>
            <select
              value={selectedTaskList}
              onChange={(e) => setSelectedTaskList(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2 text-xs font-semibold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none cursor-pointer"
            >
              {taskLists.map((tl) => (
                <option key={tl.id} value={tl.name}>{tl.name}</option>
              ))}
            </select>
          </div>

          {/* Attachment Drop Zone matching Screenshot 1 & 2 */}
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2 cursor-pointer">
                <Upload className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600 font-semibold hover:underline">Drop files or add attachments here...</span>
              </div>
              <span className="text-[11px] text-slate-400">Maximum 30 files</span>
            </div>
          </div>

          {/* Task Information Accordion matching Screenshot 1 & 2 */}
          <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
            <div
              onClick={() => setIsTaskInfoOpen(!isTaskInfoOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 cursor-pointer font-bold text-xs text-slate-800"
            >
              <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${isTaskInfoOpen ? "rotate-90" : ""}`} />
              <span>Task Information</span>
            </div>

            {isTaskInfoOpen && (
              <div className="p-4 space-y-4 text-xs font-sans">
                {/* Owner Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Owner</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none cursor-pointer"
                  >
                    <option value="Select User">Select User</option>
                    <option value="Ravi Saini">Ravi Saini</option>
                    <option value="Sushil Verma">Sushil Verma</option>
                    <option value="amin ibrahim">amin ibrahim</option>
                    <option value="kannadas A">kannadas A</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                {/* Start Date & Due Date Calendar Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-600">Due Date</label>
                      <button
                        type="button"
                        onClick={() => {
                          const val = prompt("Enter duration (e.g. 02:00 hrs, 2 days):", duration);
                          if (val) setDuration(val);
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Enter Duration
                      </button>
                    </div>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Reminder</label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:border-[#0070BA] focus:outline-none cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="On Same Day">On Same Day</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar matching Screenshot 1 */}
        <div className="flex items-center gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!taskName.trim()}
            className="rounded-md bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={!taskName.trim()}
            className="rounded-md border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            Add More
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
