"use client";

import { useState } from "react";
import { Clock, Plus, ChevronDown, Check, User, Folder, Layers, Sparkles, Filter, Trash2, Copy, ExternalLink } from "lucide-react";

interface TimeLogGridViewProps {
  onAddGeneralLog?: () => void;
}

export default function TimeLogGridView({ onAddGeneralLog }: TimeLogGridViewProps) {
  const [gridMode, setGridMode] = useState<"VIEW_BY_PROJECT" | "VIEW_BY_USER" | "VIEW_BY_MODULE">("VIEW_BY_PROJECT");
  const [summaryDataLabel, setSummaryDataLabel] = useState<string>("TOTAL_HOURS");
  const [showAddGeneralModal, setShowAddGeneralModal] = useState(false);
  const [generalLogName, setGeneralLogName] = useState("");
  const [generalLogProject, setGeneralLogProject] = useState("p1");

  // Sample Date Grid Days (Mon to Sun)
  const days = [
    { date: "15 Mon", short: "Mon" },
    { date: "16 Tue", short: "Tue" },
    { date: "17 Wed", short: "Wed" },
    { date: "18 Thu", short: "Thu" },
    { date: "19 Fri", short: "Fri" },
    { date: "20 Sat", short: "Sat" },
    { date: "21 Sun", short: "Sun" },
  ];

  // Grid Data Rows
  const [gridRows, setGridRows] = useState([
    {
      id: "r1",
      project: "01 PoC Projects",
      user: "Ravi Saini",
      module: "Tasks",
      itemTitle: "02 Project Master Excel",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      billable: true,
      values: [8, 8, 8, 8, 6, 0, 0],
    },
    {
      id: "r2",
      project: "01 PoC Projects",
      user: "Divakar Pandiy",
      module: "Tasks",
      itemTitle: "01 Digital Twin Support at Client Side",
      startTime: "10:00 AM",
      endTime: "06:00 PM",
      billable: true,
      values: [8, 8, 8, 4, 8, 0, 0],
    },
    {
      id: "r3",
      project: "07 Command Center Automation",
      user: "General Team",
      module: "General Log",
      itemTitle: "Architect Off-site Visit & General Sync",
      startTime: "09:00 AM",
      endTime: "01:00 PM",
      billable: false,
      values: [4, 4, 0, 4, 4, 0, 0],
    },
  ]);

  const handleValueChange = (rowIndex: number, dayIndex: number, newValue: number) => {
    const updated = [...gridRows];
    updated[rowIndex].values[dayIndex] = newValue;
    setGridRows(updated);
  };

  // Calculate Summary Data Row based on Summary Data Label Selection
  const getDaySummary = (dayIndex: number) => {
    const totalHrs = gridRows.reduce((sum, r) => sum + (r.values[dayIndex] || 0), 0);
    const billableHrs = gridRows.reduce((sum, r) => sum + (r.billable ? r.values[dayIndex] || 0 : 0), 0);
    const nonBillableHrs = totalHrs - billableHrs;

    switch (summaryDataLabel) {
      case "TOTAL_DAYS":
        return `${(totalHrs / 8).toFixed(1)}d`;
      case "TOTAL_PCT":
        return `${Math.round((totalHrs / 40) * 100)}%`;
      case "BILLABLE_HOURS":
        return `${billableHrs}h`;
      case "BILLABLE_DAYS":
        return `${(billableHrs / 8).toFixed(1)}d`;
      case "NON_BILLABLE_HOURS":
        return `${nonBillableHrs}h`;
      default:
        return `${totalHrs}h`;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Grid Sub-toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white p-3 rounded-lg shadow-xs text-xs">
        <div className="flex items-center gap-3">
          {/* Grid Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold text-slate-700">
            <button
              onClick={() => setGridMode("VIEW_BY_PROJECT")}
              className={`px-3 py-1 rounded transition-colors ${
                gridMode === "VIEW_BY_PROJECT" ? "bg-white text-[#0070BA] font-bold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              View by Project
            </button>
            <button
              onClick={() => setGridMode("VIEW_BY_USER")}
              className={`px-3 py-1 rounded transition-colors ${
                gridMode === "VIEW_BY_USER" ? "bg-white text-[#0070BA] font-bold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              View by User
            </button>
            <button
              onClick={() => setGridMode("VIEW_BY_MODULE")}
              className={`px-3 py-1 rounded transition-colors ${
                gridMode === "VIEW_BY_MODULE" ? "bg-white text-[#0070BA] font-bold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              View by Module
            </button>
          </div>

          <button
            onClick={() => setShowAddGeneralModal(true)}
            className="inline-flex items-center gap-1 font-bold text-[#0070BA] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add General Log</span>
          </button>
        </div>

        {/* Summary Data Label Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Summary Data Label:</span>
          <select
            value={summaryDataLabel}
            onChange={(e) => setSummaryDataLabel(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1 bg-white text-xs font-bold text-slate-800 focus:border-[#0070BA] focus:outline-none"
          >
            <option value="TOTAL_HOURS">Total Hours</option>
            <option value="TOTAL_DAYS">Total Days (Person-Days)</option>
            <option value="TOTAL_PCT">Total Percentage (%)</option>
            <option value="BILLABLE_HOURS">Billable Hours</option>
            <option value="BILLABLE_DAYS">Billable Days</option>
            <option value="NON_BILLABLE_HOURS">Non Billable Hours</option>
          </select>
        </div>
      </div>

      {/* Split Screen Grid Section */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section: Tasks / Issues / Billable Details Roster */}
        <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50">
          <div className="p-3 border-b border-slate-200 bg-slate-100 font-bold text-slate-700 text-xs flex justify-between items-center">
            <span>Tasks / Issues / General Activity</span>
            <span>Billing Status</span>
          </div>

          <div className="divide-y divide-slate-200">
            {gridRows.map((row) => (
              <div key={row.id} className="p-3 bg-white hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Folder className="h-3.5 w-3.5 text-[#0070BA]" />
                    <span className="truncate max-w-[200px]">{row.itemTitle}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.billable ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.billable ? "Billable" : "Non-billable"}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>User: {row.user}</span>
                  <span>
                    {row.startTime} - {row.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Daily Date Grid Matrix with Summary Data Header */}
        <div className="w-full lg:w-7/12 overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              {/* Daily Summary Header Row */}
              <tr className="bg-[#0070BA] text-white font-bold text-xs">
                <th className="py-2.5 px-3 text-left font-sans pl-4">Daily Summary ({summaryDataLabel.replace("_", " ")})</th>
                {days.map((d, dIdx) => (
                  <th key={d.date} className="py-2.5 px-2 font-mono">
                    <div className="text-[10px] opacity-80">{d.short}</div>
                    <div>{getDaySummary(dIdx)}</div>
                  </th>
                ))}
              </tr>

              {/* Date Header Row */}
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2 px-3 text-left">Date Grid</th>
                {days.map((d) => (
                  <th key={d.date} className="py-2 px-2 font-mono text-[11px]">
                    {d.date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {gridRows.map((row, rIdx) => (
                <tr key={row.id} className="hover:bg-blue-50/20">
                  <td className="py-3 px-3 text-left font-sans font-bold text-slate-800 truncate max-w-[140px]">
                    {row.project}
                  </td>
                  {days.map((d, dIdx) => (
                    <td key={d.date} className="py-2 px-1">
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={row.values[dIdx]}
                        onChange={(e) => handleValueChange(rIdx, dIdx, Number(e.target.value))}
                        className="w-12 text-center rounded border border-slate-300 py-1 text-xs font-bold focus:border-[#0070BA] focus:outline-none bg-white"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add General Log Modal */}
      {showAddGeneralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add General Log</h3>
              <button onClick={() => setShowAddGeneralModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">General Activity Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Architect Off-site Visit & General Sync"
                  value={generalLogName}
                  onChange={(e) => setGeneralLogName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Project</label>
                <select
                  value={generalLogProject}
                  onChange={(e) => setGeneralLogProject(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="p1">01 PoC Projects</option>
                  <option value="p2">06 Monthly Miscellaneous Tasks</option>
                  <option value="p3">07 Command Center Automation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddGeneralModal(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (generalLogName) {
                      setGridRows([
                        ...gridRows,
                        {
                          id: String(Date.now()),
                          project: "01 PoC Projects",
                          user: "Current User",
                          module: "General Log",
                          itemTitle: generalLogName,
                          startTime: "09:00 AM",
                          endTime: "05:00 PM",
                          billable: true,
                          values: [8, 8, 8, 8, 8, 0, 0],
                        },
                      ]);
                    }
                    setShowAddGeneralModal(false);
                  }}
                  className="rounded-md bg-[#0070BA] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Create General Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
