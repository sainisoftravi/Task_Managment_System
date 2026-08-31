"use client";

import { useState } from "react";
import { X, Copy, Layers, GitFork, ArrowRight } from "lucide-react";

interface CloneTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskListName?: string;
  onCloneConfirm: (data: {
    cloneDependencies: "CURRENT_ONLY" | "INCLUDE_DEPENDENTS";
    instancesCount: number;
  }) => void;
}

export default function CloneTaskListModal({
  isOpen,
  onClose,
  taskListName = "01 RMG Cement Plant",
  onCloneConfirm,
}: CloneTaskListModalProps) {
  const [cloneDependencies, setCloneDependencies] = useState<"CURRENT_ONLY" | "INCLUDE_DEPENDENTS">("CURRENT_ONLY");
  const [instancesCount, setInstancesCount] = useState<number>(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCloneConfirm({
      cloneDependencies,
      instancesCount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-[#0070BA]" />
            <h2 className="text-base font-bold text-slate-900">Clone Task List</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Target Task List: <strong className="text-slate-900">{taskListName}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Dependency Option Radio Group */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Dependency Handling Options</label>
            <div className="space-y-2">
              <label
                onClick={() => setCloneDependencies("CURRENT_ONLY")}
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer ${
                  cloneDependencies === "CURRENT_ONLY"
                    ? "border-[#0070BA] bg-blue-50/50 text-[#0070BA]"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="cloneDep"
                  checked={cloneDependencies === "CURRENT_ONLY"}
                  onChange={() => setCloneDependencies("CURRENT_ONLY")}
                  className="mt-0.5 text-[#0070BA]"
                />
                <div>
                  <span className="block font-bold">Clone current task list</span>
                  <span className="text-[11px] text-slate-500">
                    Clone current task list without including dependent task lists.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setCloneDependencies("INCLUDE_DEPENDENTS")}
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer ${
                  cloneDependencies === "INCLUDE_DEPENDENTS"
                    ? "border-[#0070BA] bg-blue-50/50 text-[#0070BA]"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="cloneDep"
                  checked={cloneDependencies === "INCLUDE_DEPENDENTS"}
                  onChange={() => setCloneDependencies("INCLUDE_DEPENDENTS")}
                  className="mt-0.5 text-[#0070BA]"
                />
                <div>
                  <span className="block font-bold">Clone dependent task lists within the project</span>
                  <span className="text-[11px] text-slate-500">
                    Clone current task list and all linked dependent task lists.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Number of Instances Input */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Number of Instances</label>
            <input
              type="number"
              min={1}
              max={10}
              value={instancesCount}
              onChange={(e) => setInstancesCount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-bold focus:border-[#0070BA] focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">Specify how many duplicate copies to generate.</p>
          </div>

          {/* Actions */}
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
              Clone Task List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
