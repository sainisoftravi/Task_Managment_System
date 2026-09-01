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
  // Mode: "NORMAL" | "TEMPLATE" | "PROJECT"
  const [mode, setMode] = useState<"NORMAL" | "TEMPLATE" | "PROJECT">("NORMAL");

  // Form Fields matching Screenshot 1
  const [taskListName, setTaskListName] = useState("01 POC TEST");
  const [selectedTemplateList, setSelectedTemplateList] = useState("Launch Checklist");
  const [selectedProjectTemplate, setSelectedProjectTemplate] = useState("Standard Master Template");

  const [relatedPhase, setRelatedPhase] = useState("None");
  const [taskListFlag, setTaskListFlag] = useState<"Internal" | "External" | "Public">("Internal");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [shiftDate, setShiftDate] = useState("2026-09-01T08:00");

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
      alert("Please enter a Task List Name");
      return;
    }

    const newList = {
      id: `tl-${Date.now()}`,
      name: finalName,
      milestone: relatedPhase,
      flag: taskListFlag,
      tags,
      shiftDate: mode !== "NORMAL" ? shiftDate : null,
      mode,
    };

    onSuccess(newList);

    if (addMore) {
      setTaskListName("");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight text-xs font-sans">
        
        {/* Header matching Screenshot 1 */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">New Task List</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body matching Screenshot 1 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode 1: NORMAL MODE */}
          {mode === "NORMAL" && (
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Task List<span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 01 POC TEST"
                value={taskListName}
                onChange={(e) => setTaskListName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none shadow-2xs"
                autoFocus
              />

              {/* Clone links matching Screenshot 1 */}
              <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("PROJECT")}
                  className="text-[#0066FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Clone from a Project or Project Template</span>
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: CLONE FROM PROJECT */}
          {mode === "PROJECT" && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Template</label>
                <select
                  value={selectedProjectTemplate}
                  onChange={(e) => setSelectedProjectTemplate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs bg-white focus:border-[#0066FF] cursor-pointer font-semibold"
                >
                  <option value="Standard Master Template">Standard Master Template</option>
                  <option value="Agile SDLC Template">Agile SDLC Template</option>
                  <option value="Civil WBS Template">Civil WBS Template</option>
                </select>
              </div>

              <div className="mt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("NORMAL")}
                  className="text-[#0066FF] hover:underline cursor-pointer"
                >
                  ← Enter Custom Task List Name
                </button>
              </div>
            </div>
          )}

          {/* Related Phase matching Screenshot 1 */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Related Phase</label>
            <select
              value={relatedPhase}
              onChange={(e) => setRelatedPhase(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs bg-white focus:border-[#0066FF] focus:outline-none cursor-pointer font-semibold text-slate-800"
            >
              <option value="None">None</option>
              <option value="Phase 1: Planning">Phase 1: Planning</option>
              <option value="Phase 2: Execution">Phase 2: Execution</option>
              <option value="Phase 3: QA & Testing">Phase 3: QA & Testing</option>
            </select>
          </div>

          {/* Task List Flag ℹ matching Screenshot 1 */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1">
              <span>Task List Flag</span>
              <span title="Internal: Portal users only. External: Public or client access.">
                <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
              </span>
            </label>
            <select
              value={taskListFlag}
              onChange={(e) => setTaskListFlag(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs bg-white focus:border-[#0066FF] focus:outline-none cursor-pointer font-semibold text-slate-800"
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
              <option value="Public">Public</option>
            </select>
          </div>

          {/* Tags Input matching Screenshot 1 */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Tags</label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 p-2 bg-white min-h-[42px] focus-within:border-[#0066FF]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-blue-100 text-[#0066FF] px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-blue-200"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-blue-900 font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Enter a tag name..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 min-w-[140px] border-none text-xs text-slate-800 focus:outline-none px-1"
              />
            </div>
          </div>
        </div>

        {/* Footer Action Buttons matching Screenshot 1 */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={!taskListName.trim()}
            className="rounded-lg bg-[#0066FF] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={!taskListName.trim()}
            className="rounded-lg border border-[#0066FF] bg-white px-4 py-2 text-xs font-bold text-[#0066FF] hover:bg-blue-50 cursor-pointer disabled:opacity-50"
          >
            Add More
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
