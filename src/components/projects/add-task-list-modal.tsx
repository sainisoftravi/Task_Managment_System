"use client";

import { useState } from "react";
import { X, ListTodo, Copy, Calendar, Shield, Globe, Layers, ArrowRight } from "lucide-react";

interface AddTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTaskList: (data: {
    name: string;
    phaseId?: string;
    flag: "INTERNAL" | "EXTERNAL";
    cloneMode: "MANUAL" | "TASK_TEMPLATE" | "PROJECT_TEMPLATE";
    shiftDate?: string;
  }) => void;
}

export default function AddTaskListModal({ isOpen, onClose, onAddTaskList }: AddTaskListModalProps) {
  const [cloneMode, setCloneMode] = useState<"MANUAL" | "TASK_TEMPLATE" | "PROJECT_TEMPLATE">("MANUAL");
  const [name, setName] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [flag, setFlag] = useState<"INTERNAL" | "EXTERNAL">("EXTERNAL");
  const [template, setTemplate] = useState("IT_SDLC_TEMPLATE");
  const [shiftDate, setShiftDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cloneMode === "MANUAL" && !name.trim()) return;
    onAddTaskList({
      name: name || "Cloned Task List",
      phaseId,
      flag,
      cloneMode,
      shiftDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-[#0070BA]" />
            <h2 className="text-base font-bold text-slate-900">Add Task List</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clone Mode Switcher Links */}
        <div className="flex items-center gap-3 text-xs font-semibold mb-4 border-b border-slate-100 pb-2">
          <button
            onClick={() => setCloneMode("MANUAL")}
            className={`pb-1 border-b-2 transition-colors ${
              cloneMode === "MANUAL" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Enter Task List
          </button>

          <button
            onClick={() => setCloneMode("TASK_TEMPLATE")}
            className={`pb-1 border-b-2 transition-colors ${
              cloneMode === "TASK_TEMPLATE" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Clone from Task Template
          </button>

          <button
            onClick={() => setCloneMode("PROJECT_TEMPLATE")}
            className={`pb-1 border-b-2 transition-colors ${
              cloneMode === "PROJECT_TEMPLATE" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Clone from Project
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Manual Entry Mode */}
          {cloneMode === "MANUAL" && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task List Name *</label>
              <input
                type="text"
                placeholder="e.g. 05 Backend Architecture & API Routes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
              />
            </div>
          )}

          {/* Clone from Task Template */}
          {cloneMode === "TASK_TEMPLATE" && (
            <div className="space-y-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Task List Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="IT_SDLC_TEMPLATE">Standard IT SDLC Task Template (18 Tasks)</option>
                  <option value="CONSTRUCTION_WBS">Civil Engineering & Inspection Template (24 Tasks)</option>
                  <option value="AGILE_SPRINT">Agile Sprint Backlog Template (12 Tasks)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift Start Date (Automated Timeline)</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Automates task start dates as [Shift Date + Task Start After duration].
                </p>
              </div>
            </div>
          )}

          {/* Clone from Project / Template */}
          {cloneMode === "PROJECT_TEMPLATE" && (
            <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Source Project</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none">
                  <option>01 PoC Projects (DT-21)</option>
                  <option>06 Monthly Miscellaneous Tasks</option>
                  <option>07 Command Center Automation</option>
                </select>
              </div>
            </div>
          )}

          {/* Related Phase Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Related Phase / Milestone</label>
            <select
              value={phaseId}
              onChange={(e) => setPhaseId(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none"
            >
              <option value="">None (Standalone Task List)</option>
              <option value="phase-1">Phase 01: Requirement Analysis & Design</option>
              <option value="phase-2">Phase 02: Core Backend & API Development</option>
              <option value="phase-3">Phase 03: Final Deployment & Audit</option>
            </select>
          </div>

          {/* Task List Flag (Internal vs External) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Task List Access Flag</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setFlag("EXTERNAL")}
                className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer ${
                  flag === "EXTERNAL" ? "border-[#0070BA] bg-blue-50/50 text-[#0070BA]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Globe className="h-4 w-4" />
                <div>
                  <span className="block font-bold">External</span>
                  <span className="text-[10px] text-slate-500">Portal & Client users</span>
                </div>
              </label>

              <label
                onClick={() => setFlag("INTERNAL")}
                className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer ${
                  flag === "INTERNAL" ? "border-[#0070BA] bg-blue-50/50 text-[#0070BA]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Shield className="h-4 w-4" />
                <div>
                  <span className="block font-bold">Internal</span>
                  <span className="text-[10px] text-slate-500">Portal users only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#0070BA] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
            >
              Add Task List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
