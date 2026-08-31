"use client";

import { useState } from "react";
import { Project } from "@/types";
import { Folder, FileText, Upload, Plus, Download, Mail, Copy, Check, FileCode, HardDrive } from "lucide-react";

interface ProjectDocumentsTabProps {
  project: Project;
}

export default function ProjectDocumentsTab({ project }: ProjectDocumentsTabProps) {
  const [copiedAlias, setCopiedAlias] = useState<string | null>(null);
  const [showAliasModal, setShowAliasModal] = useState(false);

  const emailAliases = {
    task: `task+${project.key || "DT21"}@taskpmp.local`,
    issue: `issue+${project.key || "DT21"}@taskpmp.local`,
    document: `doc+${project.key || "DT21"}@taskpmp.local`,
    forum: `forum+${project.key || "DT21"}@taskpmp.local`,
  };

  const sampleDocuments = [
    { name: "Project_Architecture_V1.pdf", size: "3.4 MB", date: "2026-08-20", author: "Ravi Saini", type: "PDF" },
    { name: "Database_Schema_Migration.sql", size: "480 KB", date: "2026-08-24", author: "Divakar Pandiy", type: "SQL" },
    { name: "SLA_Escalation_Policy_Workflows.docx", size: "1.2 MB", date: "2026-08-28", author: "Admin User", type: "DOCX" },
    { name: "Executive_Summary_Report.xlsx", size: "2.8 MB", date: "2026-08-30", author: "Project Manager", type: "XLSX" },
  ];

  const handleCopy = (alias: string) => {
    navigator.clipboard.writeText(alias);
    setCopiedAlias(alias);
    setTimeout(() => setCopiedAlias(null), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Header & Ingestion Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 rounded-md shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#0070BA]" />
            <span>Project Documents & WorkDrive</span>
          </h2>
          <p className="text-xs text-slate-500">Centralized document management and email-based file ingestion.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAliasModal(true)}
            className="inline-flex items-center gap-1.5 rounded border border-[#0070BA]/30 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-[#0070BA] hover:bg-blue-100/50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Email Ingestion Alias</span>
          </button>

          <button className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Folders & Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Left Folder Tree */}
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-xs space-y-1 text-xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Folders</span>
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded bg-blue-50 text-[#0070BA] font-bold">
            <Folder className="h-4 w-4 text-[#0070BA]" />
            <span>All Documents (4)</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-600 hover:bg-slate-100">
            <Folder className="h-4 w-4 text-slate-400" />
            <span>Design Specifications</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-600 hover:bg-slate-100">
            <Folder className="h-4 w-4 text-slate-400" />
            <span>Contracts & Reports</span>
          </button>
        </div>

        {/* Right Documents List Table */}
        <div className="md:col-span-3 rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">File Name</th>
                <th className="py-2.5 px-4 w-24">Type</th>
                <th className="py-2.5 px-4 w-24">Size</th>
                <th className="py-2.5 px-4 w-36">Uploaded By</th>
                <th className="py-2.5 px-4 w-28">Date</th>
                <th className="py-2.5 px-4 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleDocuments.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0070BA]" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200 font-bold">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{doc.size}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{doc.author}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{doc.date}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 hover:bg-slate-200/60 rounded text-slate-500">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Ingestion Alias Modal */}
      {showAliasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#0070BA]" />
                <span>Email Project Management Aliases</span>
              </h3>
              <button onClick={() => setShowAliasModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Forward emails or attachments to any of the project email aliases below. Items sent to these addresses automatically ingest into your project as tasks, issues, documents, or forum posts.
            </p>

            <div className="space-y-3 pt-1">
              {Object.entries(emailAliases).map(([type, alias]) => (
                <div key={type} className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                      To Add {type}
                    </span>
                    <span className="font-mono text-xs text-slate-800 font-semibold">{alias}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(alias)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                  >
                    {copiedAlias === alias ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAliasModal(false)}
                className="rounded-md bg-slate-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
