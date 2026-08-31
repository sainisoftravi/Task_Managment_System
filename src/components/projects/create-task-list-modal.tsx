"use client";

import { useState } from "react";
import { X, Calendar, Info, HelpCircle } from "lucide-react";

interface CreateTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (taskList: any) => void;
  milestones?: any[];
}

export default function CreateTaskListModal({
  isOpen,
  onClose,
  onSuccess,
  milestones = [],
}: CreateTaskListModalProps) {
  // Mode: "NORMAL" | "TEMPLATE" | "PROJECT" matching Screenshots 1 & 2
  const [mode, setMode] = useState<"NORMAL" | "TEMPLATE" | "PROJECT">("NORMAL");

  // Form Fields matching Screenshots 1 & 2
  const [taskListName, setTaskListName] = useState("Production");
  const [selectedTemplateList, setSelectedTemplateList] = useState("Launch Checklist");
  const [selectedProjectTemplate, setSelectedProjectTemplate] = useState("Zylker Solutions Template");

  const [relatedMilestone, setRelatedMilestone] = useState("None");
  const [taskListFlag, setTaskListFlag] = useState<"Internal" | "External">("Internal");
  const [tags, setTags] = useState<string[]>(["software", "taskpmp"]);
  const [tagInput, setTagInput] = useState("");

  const [shiftDate, setShiftDate] = useState("2023-10-25T08:00");

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = (addMore = false) => {
    const finalName = mode === "NORMAL" ? taskListName.trim() : selectedTemplateList;
    if (!finalName) {
      alert("Please specify a Task List Name");
      return;
    }

    onSuccess({
      id: `tl-${Date.now()}`,
      name: finalName,
      milestone: relatedMilestone,
      flag: taskListFlag,
      tags,
      shiftDate: mode !== "NORMAL" ? shiftDate : null,
      mode,
    });

    alert(`Task list '${finalName}' added successfully (${taskListFlag}).`);

    if (addMore) {
      setTaskListName("");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight text-xs font-sans">
        {/* Drawer Header matching Screenshots 1 & 2 */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">New Task List</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body matching Screenshots 1 & 2 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode 1: NORMAL MODE (Screenshot 1) */}
          {mode === "NORMAL" && (
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Task List<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={taskListName}
                onChange={(e) => setTaskListName(e.target.value)}
                className="w-full rounded border border-slate-300 p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-none"
              />

              {/* Mode Switch Links matching Screenshot 1 */}
              <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("TEMPLATE")}
                  className="text-orange-600 hover:underline cursor-pointer"
                >
                  Clone from Task Template
                </button>
                <button
                  type="button"
                  onClick={() => setMode("PROJECT")}
                  className="text-orange-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Clone from a Project or Project Template</span>
                  <Info className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: CLONE FROM TASK TEMPLATE (Screenshot 2) */}
          {mode === "TEMPLATE" && (
            <div>
              <label className="block font-bold text-slate-800 mb-1">Task List</label>
              <select
                value={selectedTemplateList}
                onChange={(e) => setSelectedTemplateList(e.target.value)}
                className="w-full rounded border border-slate-300 p-2.5 text-xs bg-white focus:border-orange-500 cursor-pointer font-semibold"
              >
                <option value="Launch Checklist">Launch Checklist</option>
                <option value="Architecture Floor Plan & Elevation">Architecture Floor Plan & Elevation</option>
                <option value="HR Employee Onboarding Checklist">HR Employee Onboarding Checklist</option>
                <option value="QA Software Testing Suite">QA Software Testing Suite</option>
              </select>

              {/* Toggle back link matching Screenshot 2 */}
              <div className="mt-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("NORMAL")}
                  className="text-orange-600 hover:underline cursor-pointer"
                >
                  Enter Task List
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: CLONE FROM PROJECT OR PROJECT TEMPLATE */}
          {mode === "PROJECT" && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Project Template</label>
                <select
                  value={selectedProjectTemplate}
                  onChange={(e) => setSelectedProjectTemplate(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2.5 text-xs bg-white focus:border-orange-500 cursor-pointer font-semibold"
                >
                  <option value="Zylker Solutions Template">Zylker Solutions Template</option>
                  <option value="ERP Software Master Template">ERP Software Master Template</option>
                  <option value="Donnelly Apartments WBS Template">Donnelly Apartments WBS Template</option>
                </select>
              </div>

              <div className="mt-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("NORMAL")}
                  className="text-orange-600 hover:underline cursor-pointer"
                >
                  Enter Task List
                </button>
              </div>
            </div>
          )}

          {/* Field 2: Related Milestone matching Screenshots 1 & 2 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Related Milestone</label>
            <select
              value={relatedMilestone}
              onChange={(e) => setRelatedMilestone(e.target.value)}
              className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer"
            >
              <option value="None">None</option>
              <option value="Planning">Planning</option>
              <option value="Design">Design</option>
              <option value="Build">Build</option>
              <option value="Testing">Testing</option>
              <option value="Cleaning and final walk-through work items">Cleaning and final walk-through work items</option>
            </select>
          </div>

          {/* Field 3: Task List Flag ⓘ matching Screenshots 1 & 2 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span>Task List Flag</span>
              <span title="Internal: Portal users only. External: Portal & Client users.">
                <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
              </span>
            </label>
            <select
              value={taskListFlag}
              onChange={(e) => setTaskListFlag(e.target.value as any)}
              className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer font-medium"
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>

          {/* Field 4: Tags Input matching Screenshots 1 & 2 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tags</label>
            <div className="flex flex-wrap items-center gap-1.5 rounded border border-orange-400 p-2 bg-white min-h-[38px]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-[#38bdf8] text-white px-2 py-0.5 rounded-full text-[11px] font-bold shadow-2xs"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-slate-200 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 min-w-[100px] border-none text-xs focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Field 5: Shift Date DateTime Picker matching Screenshot 2 */}
          {mode !== "NORMAL" && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Shift Date</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs font-mono bg-white focus:border-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Buttons matching Screenshots 1 & 2 */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="rounded bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="rounded border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Add More
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
