"use client";

import { useState } from "react";
import { X, Download, FileSpreadsheet, FileText, Calendar, Layers, Check } from "lucide-react";

interface ExportTimeLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export default function ExportTimeLogsModal({ isOpen, onClose, onExport }: ExportTimeLogsModalProps) {
  const [projectScope, setProjectScope] = useState<"ACTIVE" | "ARCHIVED" | "ALL">("ALL");
  const [format, setFormat] = useState<"XLSX" | "CSV" | "PDF">("XLSX");
  const [dateRange, setDateRange] = useState("CURRENT_MONTH");
  const [selectedColumns, setSelectedColumns] = useState([
    "Project Name",
    "Task Title",
    "User Name",
    "Log Date",
    "Duration (Hours)",
    "Billable Type",
    "Approval Status",
  ]);

  if (!isOpen) return null;

  const allColumns = [
    "Project Name",
    "Task Title",
    "User Name",
    "Log Date",
    "Start Time",
    "End Time",
    "Duration (Hours)",
    "Billable Type",
    "Approval Status",
    "Approver Name",
    "Description Notes",
  ];

  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== col));
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  const handleDownload = () => {
    onExport({ projectScope, format, dateRange, selectedColumns });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#0070BA]" />
            <h2 className="text-base font-bold text-slate-900">Export Time Logs</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Project Scope Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Project Scope</label>
            <select
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value as any)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none"
            >
              <option value="ALL">All Projects (Active & Archived)</option>
              <option value="ACTIVE">Active Projects Only</option>
              <option value="ARCHIVED">Archived Projects Only</option>
            </select>
          </div>

          {/* Export Format Switcher */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">File Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormat("XLSX")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-bold ${
                  format === "XLSX"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("CSV")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-bold ${
                  format === "CSV"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileText className="h-4 w-4 text-blue-600" />
                <span>CSV (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("PDF")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-bold ${
                  format === "PDF"
                    ? "border-rose-600 bg-rose-50 text-rose-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileText className="h-4 w-4 text-rose-600" />
                <span>PDF Summary</span>
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs bg-white focus:border-[#0070BA] focus:outline-none"
            >
              <option value="CURRENT_MONTH">Current Month</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="CURRENT_QUARTER">Current Quarter</option>
              <option value="PROJECT_SPAN">Entire Project Span</option>
            </select>
          </div>

          {/* Customize Layout Columns */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Customize Export Columns</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto">
              {allColumns.map((col) => {
                const checked = selectedColumns.includes(col);
                return (
                  <label
                    key={col}
                    onClick={() => toggleColumn(col)}
                    className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded text-[#0070BA]"
                    />
                    <span>{col}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
