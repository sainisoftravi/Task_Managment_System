"use client";

import { GripVertical, Layers } from "lucide-react";

export default function MyPhasesWidget() {
  const phases = [
    { title: "Hardware installation", project: "Donnelly Apartments Construction", status: "Overdue" },
    { title: "Contracts and Agreements", project: "Collaboration Hall Construction", status: "Overdue" },
    { title: "Insulation", project: "Collaboration Hall Construction", status: "Overdue" },
    { title: "Scope and Estimate", project: "Nexus 1.0 Repository", status: "Overdue" },
    { title: "Briefing", project: "Software Recruit Project", status: "Overdue" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs font-sans space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 text-slate-800">
          <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-orange-500" />
            <span>My Phases</span>
          </h3>
        </div>
      </div>

      <div className="space-y-2 font-sans text-xs">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-slate-100"
          >
            <div>
              <span className="font-bold text-slate-900 block">{p.title}</span>
              <span className="text-[11px] text-slate-400 block">{p.project}</span>
            </div>
            <span className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
