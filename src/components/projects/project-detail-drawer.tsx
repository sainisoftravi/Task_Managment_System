"use client";

import { X, Calendar, User, Tag, Lock, Globe, Layers, Clock, ShieldCheck, ExternalLink, Mail, Copy } from "lucide-react";
import { Project } from "@/types";
import { formatDate } from "@/lib/utils";

interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailDrawer({ project, isOpen, onClose }: ProjectDetailDrawerProps) {
  if (!isOpen || !project) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/projects/${project.id}`;
    navigator.clipboard?.writeText(link);
    alert("Project link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] font-mono">
                {project.key || "DT-31"}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">{project.name}</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-extrabold bg-[#00C49F] text-white shadow-2xs">
                  {project.status || "Active"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Tasks</span>
                <span className="text-sm font-extrabold text-slate-900 mt-1 block">
                  {(project as any)._count?.tasks || 0} Total
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                <span className="text-sm font-extrabold text-emerald-600 mt-1 block">
                  {(project as any).pct || 0}%
                </span>
              </div>
            </div>

            {/* Owner & Team */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Ownership</h3>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                <div className="h-8 w-8 rounded-full bg-amber-400 text-amber-900 font-extrabold text-xs flex items-center justify-center border border-amber-300">
                  {project.owner?.name?.substring(0, 2).toUpperCase() || "RS"}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{project.owner?.name || "Ravi Saini"}</h4>
                  <p className="text-[11px] text-slate-500">{project.owner?.email || "ravi@taskpmp.local"}</p>
                </div>
              </div>
            </div>

            {/* Timeline Dates */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>Start Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {project.startDate ? formatDate(project.startDate) : "01-07-2026"}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <Calendar className="h-3.5 w-3.5 text-rose-600" />
                    <span>Due Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {project.dueDate ? formatDate(project.dueDate) : "31-08-2026"}
                  </span>
                </div>
              </div>
            </div>

            {/* Inbound Email Alias */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inbound Email Alias</h3>
              <div className="p-3 rounded-lg border border-slate-200 bg-blue-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800">
                  <Mail className="h-4 w-4 text-[#0066FF]" />
                  <span>project-{project.key?.toLowerCase() || "dt31"}@taskpmp.local</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`project-${project.key?.toLowerCase() || "dt31"}@taskpmp.local`);
                    alert("Email alias copied!");
                  }}
                  className="p-1 rounded text-slate-500 hover:text-[#0066FF]"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </button>

            <a
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
            >
              <span>Access Project Workspace</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
