"use client";

import { useState } from "react";
import { X, ArrowRightLeft, Folder } from "lucide-react";

interface MoveTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskList: any;
  onMove: (targetProject: string, targetMilestone: string) => void;
}

export default function MoveTaskListModal({
  isOpen,
  onClose,
  taskList,
  onMove,
}: MoveTaskListModalProps) {
  const [selectedProject, setSelectedProject] = useState("01 PoC Projects");
  const [selectedMilestone, setSelectedMilestone] = useState("Milestone-1 Baseline");

  if (!isOpen || !taskList) return null;

  const handleMoveConfirm = () => {
    onMove(selectedProject, selectedMilestone);
    alert(`Moved Task List '${taskList.name}' to project '${selectedProject}'.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn text-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-orange-500" />
            <h3 className="font-bold text-slate-900 text-base">Move Task List</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-slate-600 font-medium">
            Select target project and milestone to relocate <b className="text-slate-900">{taskList.name}</b>:
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full rounded border border-slate-300 p-2.5 text-xs bg-white focus:border-orange-500 cursor-pointer font-semibold"
            >
              <option value="01 PoC Projects">01 PoC Projects</option>
              <option value="Donnelly Apartments Construction">Donnelly Apartments Construction</option>
              <option value="Social Media Project">Social Media Project</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Automobile Spare Manufacturing">Automobile Spare Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Milestone</label>
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer"
            >
              <option value="Milestone-1 Baseline">Milestone-1 Baseline</option>
              <option value="Cleaning and final walk-through work items">Cleaning and final walk-through work items</option>
              <option value="Phase 2 Deployment">Phase 2 Deployment</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={handleMoveConfirm}
            className="rounded-md bg-orange-500 hover:bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Move
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-orange-400 bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
