"use client";

import { useState } from "react";
import { Project, Milestone } from "@/types";
import { Layers, Plus, Calendar, CheckCircle2, User, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

import MilestoneDetailsDrawer from "@/components/projects/milestone-details-drawer";

interface ProjectPhasesTabProps {
  project: Project;
  milestones?: Milestone[];
}

export default function ProjectPhasesTab({ project, milestones = [] }: ProjectPhasesTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMilestoneDrawer, setSelectedMilestoneDrawer] = useState<any | null>(null);

  const samplePhases = [
    { name: "Pre-Construction & Research Phase", dri: "Divakar Pandiy", status: "Completed", progress: 100, startDate: "2026-01-15", endDate: "2026-03-30", tasksCount: 12 },
    { name: "Design & Layout Procurement Phase", dri: "Ravi Saini", status: "In Progress", progress: 65, startDate: "2026-04-01", endDate: "2026-07-15", tasksCount: 18 },
    { name: "Development & Coding Phase", dri: "Sushil Verma", status: "In Progress", progress: 40, startDate: "2026-07-16", endDate: "2026-10-30", tasksCount: 24 },
    { name: "Testing, QA & Launch Phase", dri: "Aman Besham", status: "Planning", progress: 0, startDate: "2026-11-01", endDate: "2026-12-31", tasksCount: 8 },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Sub-Header Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 rounded-md shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#0070BA]" />
            <span>Project Phases & Milestones (WBS)</span>
          </h2>
          <p className="text-xs text-slate-500">Track major project deliverables and DRI milestones.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Phase / Milestone</span>
        </button>
      </div>

      {/* Phases Table List View */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Phase Name</th>
              <th className="py-3 px-4 w-40">DRI (Owner)</th>
              <th className="py-3 px-4 text-center w-28">Status</th>
              <th className="py-3 px-4 w-48">Completion Progress</th>
              <th className="py-3 px-4 text-center w-32">Start Date</th>
              <th className="py-3 px-4 text-center w-32">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {samplePhases.map((phase, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedMilestoneDrawer(phase)}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-4 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#0070BA]" />
                    <span className="hover:text-[#0070BA] font-bold">{phase.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({phase.tasksCount} Tasks)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>{phase.dri}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      phase.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : phase.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {phase.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 w-8 text-[11px]">{phase.progress}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-600">{phase.startDate}</td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-600">{phase.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Milestone Details Drawer matching Screenshot 2 */}
      <MilestoneDetailsDrawer
        isOpen={!!selectedMilestoneDrawer}
        onClose={() => setSelectedMilestoneDrawer(null)}
        milestone={selectedMilestoneDrawer || { name: "Contracts and Agreements" }}
      />
    </div>
  );
}
