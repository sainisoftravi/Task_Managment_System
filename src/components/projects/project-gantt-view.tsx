"use client";

import { useState } from "react";
import { Project } from "@/types";
import { Calendar, Maximize2, Download, Printer, Filter, Settings, FileText, ChevronRight, User, MoreVertical, Archive, Trash2, Copy } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectGanttViewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onArchiveProject?: (project: Project) => void;
}

export default function ProjectGanttView({
  projects,
  onProjectClick,
  onEditProject,
  onArchiveProject,
}: ProjectGanttViewProps) {
  const [showOptions, setShowOptions] = useState({ showDates: true, showOwner: true, showProgress: true });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplateProject, setSelectedTemplateProject] = useState<Project | null>(null);
  const [templateName, setTemplateName] = useState("");

  const months = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];

  const calculateGanttPosition = (startDateStr?: string | null, dueDateStr?: string | null) => {
    const start = startDateStr ? new Date(startDateStr) : new Date("2026-01-01");
    const end = dueDateStr ? new Date(dueDateStr) : new Date("2026-06-30");

    const yearStart = new Date("2026-01-01").getTime();
    const yearEnd = new Date("2026-12-31").getTime();
    const totalDuration = yearEnd - yearStart;

    const left = Math.max(0, Math.min(100, ((start.getTime() - yearStart) / totalDuration) * 100));
    const width = Math.max(5, Math.min(100 - left, ((end.getTime() - start.getTime()) / totalDuration) * 100));

    return { left: `${left}%`, width: `${width}%` };
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleCreateTemplate = () => {
    if (!selectedTemplateProject || !templateName) return;
    alert(`Project Template "${templateName}" created successfully from ${selectedTemplateProject.name}!`);
    setSelectedTemplateProject(null);
    setTemplateName("");
  };

  return (
    <div className={`space-y-3 font-sans ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : ""}`}>
      {/* Top Gantt Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white p-3 rounded-md shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#0070BA]" />
          <h2 className="text-sm font-bold text-slate-900">Project Timeline Gantt Chart</h2>
          <span className="text-xs text-slate-400">({projects.length} Scheduled Projects)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => setShowOptions((prev) => ({ ...prev, showOwner: !prev.showOwner }))}
            className={`inline-flex items-center gap-1 rounded border px-2.5 py-1.5 text-xs font-semibold ${
              showOptions.showOwner ? "border-[#0070BA] bg-blue-50 text-[#0070BA]" : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Show Options</span>
          </button>
        </div>
      </div>

      {/* Main Gantt Grid Container */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Projects Metadata Roster Panel */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex-shrink-0">
          <div className="h-10 border-b border-slate-200 px-4 flex items-center font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-100/70">
            Project Title & Key
          </div>
          <div className="divide-y divide-slate-200">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onProjectClick(proj)}
                className="h-14 px-4 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-200/60 px-1 py-0.2 rounded">
                      {proj.key || "DT-31"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{proj.name}</h3>
                  </div>
                  {showOptions.showOwner && (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      {proj.owner?.name || "Project Manager"}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplateProject(proj);
                    setTemplateName(`${proj.name} Template`);
                  }}
                  title="Create Template from Project"
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Timeline Timeline Chart Sheet */}
        <div className="flex-1 overflow-x-auto">
          {/* Months Header Timeline Bar */}
          <div className="h-10 border-b border-slate-200 bg-slate-100/70 flex items-center font-semibold text-[11px] text-slate-600 divide-x divide-slate-200 min-w-[700px]">
            {months.map((m) => (
              <div key={m} className="flex-1 text-center py-2">
                {m}
              </div>
            ))}
          </div>

          {/* Timeline Row Bars */}
          <div className="divide-y divide-slate-200 min-w-[700px]">
            {projects.map((proj) => {
              const pos = calculateGanttPosition(proj.startDate, proj.dueDate);
              return (
                <div
                  key={proj.id}
                  className="h-14 relative flex items-center px-2 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Gantt Bar */}
                  <div
                    onClick={() => onProjectClick(proj)}
                    className="absolute h-7 rounded-md bg-gradient-to-r from-[#0070BA] to-blue-500 text-white text-[11px] font-bold px-3 flex items-center justify-between shadow-xs cursor-pointer hover:brightness-110 transition-all"
                    style={{ left: pos.left, width: pos.width }}
                  >
                    <span className="truncate">{proj.name}</span>
                    {showOptions.showDates && (
                      <span className="font-mono text-[10px] font-normal opacity-90 ml-2">
                        {proj.startDate ? formatDate(proj.startDate) : "Jan 1"} - {proj.dueDate ? formatDate(proj.dueDate) : "Jun 30"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Template Modal */}
      {selectedTemplateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Copy className="h-5 w-5 text-[#0070BA]" />
              <span>Create Project Template</span>
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source Project</label>
                <input
                  type="text"
                  disabled
                  value={selectedTemplateProject.name}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="addClosedAsOpen" defaultChecked className="rounded text-[#0070BA] h-4 w-4" />
                <label htmlFor="addClosedAsOpen" className="text-xs text-slate-700 font-medium">
                  Add closed tasks as open tasks in the new template
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedTemplateProject(null)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Add Project Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
