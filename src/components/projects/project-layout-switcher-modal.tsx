"use client";

import { useState } from "react";
import { X, Layers, Check } from "lucide-react";
import { Project } from "@/types";

interface ProjectLayoutSwitcherModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onLayoutChanged: (newLayoutName: string) => void;
}

export default function ProjectLayoutSwitcherModal({
  project,
  isOpen,
  onClose,
  onLayoutChanged,
}: ProjectLayoutSwitcherModalProps) {
  const [selectedLayout, setSelectedLayout] = useState<string>("Standard Layout");

  if (!isOpen || !project) return null;

  const layouts = [
    {
      id: "Standard Layout",
      name: "Standard Layout",
      description: "Default project layout with tasks, milestones, time logs, and standard fields.",
    },
    {
      id: "Agile Software Layout",
      name: "Agile Software Layout",
      description: "Tailored for software engineering sprints, story points, bug trackers, and code reviews.",
    },
    {
      id: "Construction WBS Layout",
      name: "Construction WBS Layout",
      description: "Tailored for civil works, inspection checklists, vendor tracking, and material quality logs.",
    },
  ];

  const handleSave = () => {
    onLayoutChanged(selectedLayout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border border-slate-200 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#0066FF]" />
            <span>Change Project Layout Template</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-500">
            Select a project field layout template for <strong className="text-slate-900">{project.name}</strong>:
          </p>

          {layouts.map((l) => {
            const isSelected = selectedLayout === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setSelectedLayout(l.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#0066FF] bg-blue-50/40 ring-1 ring-[#0066FF]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{l.name}</h4>
                  {isSelected && <Check className="h-4 w-4 text-[#0066FF]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{l.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}
