"use client";

import { useState } from "react";
import { X, Download, FileSpreadsheet, FileText, Calendar, CheckSquare, Loader2 } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<"xlsx" | "pdf">("xlsx");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [includeTickets, setIncludeTickets] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeTimeLogs, setIncludeTimeLogs] = useState(true);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  async function handleExport() {
    try {
      setDownloading(true);
      const params = new URLSearchParams({
        format,
        start: startDate,
        end: endDate,
        tickets: String(includeTickets),
        tasks: String(includeTasks),
        timelogs: String(includeTimeLogs),
      });

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/reports/export?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to generate export file");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TaskPMP_Report_${startDate}_to_${endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      onClose();
    } catch (err) {
      alert("Error generating report export. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Custom Report Generator</h2>
            <p className="text-xs text-slate-500">Configure parameters & export formatted Excel/PDF reports</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          {/* File Format Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Export File Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`flex items-center justify-center gap-3 rounded-lg border p-3 text-sm font-medium transition-all ${
                  format === "xlsx"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className={`h-5 w-5 ${format === "xlsx" ? "text-emerald-600" : "text-slate-400"}`} />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`flex items-center justify-center gap-3 rounded-lg border p-3 text-sm font-medium transition-all ${
                  format === "pdf"
                    ? "border-red-600 bg-red-50 text-red-800 ring-2 ring-red-600/20"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileText className={`h-5 w-5 ${format === "pdf" ? "text-red-600" : "text-slate-400"}`} />
                <span>Executive PDF (.pdf)</span>
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Date Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <span className="text-slate-400 text-xs font-medium">TO</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Included Sections */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Metrics & Modules Included</label>
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTickets}
                  onChange={(e) => setIncludeTickets(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium">Support Tickets</span> (Open, Closed, Priority & SLAs)
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTasks}
                  onChange={(e) => setIncludeTasks(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium">Project Tasks</span> (Status, Assignee & Due Dates)
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeLogs}
                  onChange={(e) => setIncludeTimeLogs(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium">Time Tracking Logs</span> (Billable vs Non-billable hours)
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={downloading}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Report ({format.toUpperCase()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
