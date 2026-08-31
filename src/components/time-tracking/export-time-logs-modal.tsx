"use client";

import { useState } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  Check,
  Clock,
  Play,
  RotateCw,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  Filter
} from "lucide-react";

interface ExportTimeLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export default function ExportTimeLogsModal({ isOpen, onClose, onExport }: ExportTimeLogsModalProps) {
  const [modalView, setModalView] = useState<"EXPORT_FORM" | "MANAGE_SCHEDULE" | "EXPORT_HISTORY">("EXPORT_FORM");

  // Form State matching Screenshots 1 & 2
  const [format, setFormat] = useState<"xlsx" | "csv" | "pdf">("xlsx");
  const [timesheetView, setTimesheetView] = useState("All Timesheet");
  const [exportFileInformation, setExportFileInformation] = useState(false);
  const [exportSingleSheet, setExportSingleSheet] = useState(true);
  const [exportWithFilter, setExportWithFilter] = useState(true);
  const [projectCategory, setProjectCategory] = useState("Active");

  // Date Range State (Last, Current, Custom) matching Screenshot 1 & 2
  const [dateRange, setDateRange] = useState<"Current" | "Last" | "Custom">("Custom");
  const [dateCount, setDateCount] = useState("3");
  const [datePeriod, setDatePeriod] = useState("month(s)");
  const [customStartDate, setCustomStartDate] = useState("2022-08-01");
  const [customEndDate, setCustomEndDate] = useState("2023-08-01");

  // Inline Filter Criteria State matching Screenshots 1 & 2
  const [showInlineCriteria, setShowInlineCriteria] = useState(true);
  const [inlineFilters, setInlineFilters] = useState([
    { field: "Log Users", operator: "Is", value: "Monica Hemsworth" },
  ]);
  const [inlineMatchLogic, setInlineMatchLogic] = useState<"ANY" | "ALL">("ANY");

  // Dual Column Transfer List State matching Screenshot 1
  const [availableColumns, setAvailableColumns] = useState([
    "Created Time",
    "Modified Time",
    "Approval By",
    "Approval Time",
    "Approver",
    "Successors IP",
    "Task Priority",
    "Task Billing",
  ]);

  const [selectedColumns, setSelectedColumns] = useState([
    "Tasks/Issues Name",
    "Tasks/Issues ID font-bold",
    "Time Period",
    "Date",
    "Daily Log",
    "User",
    "Project Name",
  ]);

  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  // Schedule Export Toggle State matching Screenshot 1
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleDate, setScheduleDate] = useState("2026-09-01");
  const [repeatType, setRepeatType] = useState<"Once" | "Daily" | "Weekly" | "Monthly">("Weekly");

  // Scheduled Items list matching Screenshot 3
  const [scheduledExports, setScheduledExports] = useState([
    { id: "s1", name: "daily to weekly", active: true, projects: "active", lastRun: "27/11/2024 05:22 PM", nextRun: "03/12/2024 08:00 AM", repeat: "Weekly" },
    { id: "s2", name: "test other user check", active: false, projects: "all", lastRun: "14/10/2024 04:23 PM", nextRun: "-", repeat: "Monthly" },
    { id: "s3", name: "audit check", active: false, projects: "active", lastRun: "23/09/2024 12:10 PM", nextRun: "-", repeat: "Daily" },
    { id: "s4", name: "Export portal testing", active: true, projects: "active", lastRun: "09/09/2024 11:50 AM", nextRun: "01/12/2024 11:50 AM", repeat: "Monthly" },
  ]);

  // Export History List
  const [exportHistory, setExportHistory] = useState([
    { id: "h1", name: "Weekly Timesheet Backup", date: "31/08/2026 20:30 PM", format: "XLSX", status: "Completed", scope: "Active Projects" },
    { id: "h2", name: "Monthly Financial Log", date: "01/08/2026 09:00 AM", format: "CSV", status: "Completed", scope: "All Projects" },
  ]);

  if (!isOpen) return null;

  // Column Transfer Handlers
  const handleMoveAllToSelected = () => {
    setSelectedColumns([...selectedColumns, ...availableColumns]);
    setAvailableColumns([]);
  };

  const handleMoveAllToAvailable = () => {
    setAvailableColumns([...availableColumns, ...selectedColumns]);
    setSelectedColumns([]);
  };

  const handleMoveToSelected = (col: string) => {
    setAvailableColumns(availableColumns.filter((c) => c !== col));
    setSelectedColumns([...selectedColumns, col]);
  };

  const handleMoveToAvailable = (col: string) => {
    setSelectedColumns(selectedColumns.filter((c) => c !== col));
    setAvailableColumns([...availableColumns, col]);
  };

  const handleRunNow = (id: string) => {
    const item = scheduledExports.find((s) => s.id === id);
    alert(`Triggered execution for scheduled export '${item?.name}'. Download file queued.`);
    const nowStr = new Date().toLocaleString();
    setScheduledExports(
      scheduledExports.map((s) => (s.id === id ? { ...s, lastRun: nowStr } : s))
    );
  };

  const handleToggleScheduleActive = (id: string) => {
    setScheduledExports(
      scheduledExports.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleSubmit = () => {
    if (isScheduled) {
      if (!scheduleName.trim()) {
        alert("Please enter a Schedule Name");
        return;
      }
      const newSchedule = {
        id: `s-${Date.now()}`,
        name: scheduleName.trim(),
        active: true,
        projects: projectCategory.toLowerCase(),
        lastRun: "Never",
        nextRun: scheduleDate + " 08:00 AM",
        repeat: repeatType,
      };
      setScheduledExports([newSchedule, ...scheduledExports]);
      alert(`Scheduled export '${scheduleName}' saved successfully (${repeatType} repeat).`);
      onClose();
    } else {
      onExport({
        projectScope: projectCategory,
        format: format.toUpperCase(),
        dateRange,
        selectedColumns,
        isScheduled: false,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header matching Screenshots 1 & 2 */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              {modalView === "EXPORT_FORM"
                ? "Export Timesheet"
                : modalView === "MANAGE_SCHEDULE"
                ? "Manage Export Schedule"
                : "Export History"}
            </h2>
          </div>

          {/* Header Action Links matching Screenshot 2 */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {modalView === "EXPORT_FORM" && (
              <>
                <button
                  onClick={() => setModalView("MANAGE_SCHEDULE")}
                  className="rounded border border-orange-200 bg-orange-50 px-2.5 py-1 text-orange-600 hover:bg-orange-100 cursor-pointer font-bold"
                >
                  Manage Schedule
                </button>
                <button
                  onClick={() => setModalView("EXPORT_HISTORY")}
                  className="text-orange-600 hover:underline cursor-pointer"
                >
                  Show Export History
                </button>
              </>
            )}

            {modalView !== "EXPORT_FORM" && (
              <button
                onClick={() => setModalView("EXPORT_FORM")}
                className="text-[#0070BA] font-bold hover:underline cursor-pointer"
              >
                ← Back to Export Form
              </button>
            )}

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: EXPORT FORM (Screenshots 1 & 2) */}
        {modalView === "EXPORT_FORM" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            {/* Format & Timesheet View Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="xlsx">xlsx</option>
                  <option value="csv">csv</option>
                  <option value="pdf">pdf</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Timesheet View</label>
                <select
                  value={timesheetView}
                  onChange={(e) => setTimesheetView(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="All Timesheet">All Timesheet</option>
                  <option value="Billable Hours">Billable Hours Only</option>
                  <option value="Non-Billable Hours">Non-Billable Hours Only</option>
                </select>
              </div>
            </div>

            {/* Checkbox Options matching Screenshot 1 */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={exportFileInformation}
                  onChange={(e) => setExportFileInformation(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span>Export with file information</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={exportSingleSheet}
                  onChange={(e) => setExportSingleSheet(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span>Export All Projects Time Log(s) in Single Sheet</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={exportWithFilter}
                  onChange={(e) => setExportWithFilter(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span>Export along with the current filter selection</span>
              </label>
            </div>

            {/* Project Category matching Screenshot 1 */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Category</label>
              <select
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Both Active & Archived">Both Active & Archived</option>
              </select>
            </div>

            {/* Date Range Controls matching Screenshot 1 */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Current">Current</option>
                    <option value="Last">Last</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {dateRange === "Custom" ? (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">From *</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">To *</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Count</label>
                      <input
                        type="text"
                        value={dateCount}
                        onChange={(e) => setDateCount(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs font-mono bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Period</label>
                      <select
                        value={datePeriod}
                        onChange={(e) => setDatePeriod(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 cursor-pointer"
                      >
                        <option value="day(s)">day(s)</option>
                        <option value="week(s)">week(s)</option>
                        <option value="month(s)">month(s)</option>
                        <option value="year(s)">year(s)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Inline Filter Criteria Header & Builder matching Screenshots 1 & 2 */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs font-sans">
                <span className="font-bold text-slate-800">Filter ({inlineFilters.length})</span>
                <button
                  type="button"
                  onClick={() => setShowInlineCriteria(!showInlineCriteria)}
                  className="text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  {showInlineCriteria ? "Hide Filter Criteria" : "Create Filter Criteria"}
                </button>
                <button
                  type="button"
                  onClick={() => setInlineFilters([])}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {showInlineCriteria && (
                <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-200 animate-fadeIn">
                  {inlineFilters.map((flt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={flt.field}
                        onChange={(e) => {
                          const updated = [...inlineFilters];
                          updated[idx].field = e.target.value;
                          setInlineFilters(updated);
                        }}
                        className="rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 cursor-pointer min-w-[120px]"
                      >
                        <option value="Log Users">Log Users</option>
                        <option value="Approval Status">Approval Status</option>
                        <option value="Billing Status">Billing Status</option>
                        <option value="User">User</option>
                        <option value="Type">Type</option>
                      </select>

                      <select
                        value={flt.operator}
                        onChange={(e) => {
                          const updated = [...inlineFilters];
                          updated[idx].operator = e.target.value;
                          setInlineFilters(updated);
                        }}
                        className="rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 cursor-pointer min-w-[90px]"
                      >
                        <option value="Is">Is</option>
                        <option value="Is Not">Is Not</option>
                        <option value="Contains">Contains</option>
                      </select>

                      <div className="flex-1 flex items-center gap-1.5 rounded border border-slate-300 p-1 bg-white">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-800 border border-slate-200">
                          👤 {flt.value}
                          <button
                            type="button"
                            onClick={() => setInlineFilters(inlineFilters.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-slate-700 font-bold ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInlineFilters(inlineFilters.filter((_, i) => i !== idx))}
                        className="w-6 h-6 rounded-full border border-orange-300 text-orange-600 font-bold flex items-center justify-center hover:bg-orange-50 cursor-pointer text-sm"
                        title="Remove criteria"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setInlineFilters([
                            ...inlineFilters,
                            { field: "Approval Status", operator: "Is", value: "Pending" },
                          ])
                        }
                        className="w-6 h-6 rounded-full border border-orange-500 text-orange-600 font-bold flex items-center justify-center hover:bg-orange-50 cursor-pointer text-sm"
                        title="Add criteria"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {inlineFilters.length > 0 && (
                    <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-slate-700">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="inlineMatchLogic"
                          checked={inlineMatchLogic === "ANY"}
                          onChange={() => setInlineMatchLogic("ANY")}
                          className="text-orange-500"
                        />
                        <span>Any of these</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="inlineMatchLogic"
                          checked={inlineMatchLogic === "ALL"}
                          onChange={() => setInlineMatchLogic("ALL")}
                          className="text-orange-500"
                        />
                        <span>All of these</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dual Column Transfer List matching Screenshot 1 */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Columns</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Available List */}
                <div className="rounded-md border border-slate-200 bg-white p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Available</span>
                    <button
                      type="button"
                      onClick={handleMoveAllToSelected}
                      className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      MOVE ALL &gt;
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search available..."
                    value={searchAvailable}
                    onChange={(e) => setSearchAvailable(e.target.value)}
                    className="w-full rounded border border-slate-200 p-1 text-[11px] focus:outline-none"
                  />
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {availableColumns
                      .filter((c) => c.toLowerCase().includes(searchAvailable.toLowerCase()))
                      .map((col) => (
                        <div
                          key={col}
                          onClick={() => handleMoveToSelected(col)}
                          className="p-1 rounded hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-slate-600 flex items-center justify-between"
                        >
                          <span>{col}</span>
                          <span className="text-orange-500 font-bold">&gt;</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Selected List */}
                <div className="rounded-md border border-slate-200 bg-white p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleMoveAllToAvailable}
                      className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      &lt; MOVE ALL
                    </button>
                    <span className="font-bold text-slate-800">Selected</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search selected..."
                    value={searchSelected}
                    onChange={(e) => setSearchSelected(e.target.value)}
                    className="w-full rounded border border-slate-200 p-1 text-[11px] focus:outline-none"
                  />
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedColumns
                      .filter((c) => c.toLowerCase().includes(searchSelected.toLowerCase()))
                      .map((col) => (
                        <div
                          key={col}
                          onClick={() => handleMoveToAvailable(col)}
                          className="p-1 rounded hover:bg-rose-50 hover:text-rose-700 cursor-pointer text-slate-800 font-medium flex items-center justify-between"
                        >
                          <span>{col}</span>
                          <span className="text-slate-400 font-bold">&lt;</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Export Toggle Switch matching Screenshot 1 */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Schedule this Export</span>
                <button
                  type="button"
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isScheduled ? "bg-orange-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isScheduled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Schedule Details Form */}
              {isScheduled && (
                <div className="mt-3 p-3 bg-orange-50/50 rounded-lg border border-orange-200 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Schedule Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekly Timesheet Backup"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                      className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">First Run Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Repeat Type</label>
                      <select
                        value={repeatType}
                        onChange={(e) => setRepeatType(e.target.value as any)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white focus:border-orange-500 cursor-pointer"
                      >
                        <option value="Once">Once</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions matching Screenshot 1 */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                {isScheduled ? "Schedule" : "Export"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: MANAGE EXPORT SCHEDULE (Screenshot 3) */}
        {modalView === "MANAGE_SCHEDULE" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Active Scheduled Exports</h3>
              <button
                onClick={() => setModalView("EXPORT_FORM")}
                className="rounded bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600 cursor-pointer"
              >
                + Schedule Export
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-3">Schedule Name</th>
                    <th className="py-2.5 px-3 text-center">OFF/ON</th>
                    <th className="py-2.5 px-3 text-center">Run Now</th>
                    <th className="py-2.5 px-3">Projects</th>
                    <th className="py-2.5 px-3">Last Day Run</th>
                    <th className="py-2.5 px-3">Next Run</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduledExports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleScheduleActive(item.id)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                            item.active ? "bg-orange-500" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              item.active ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleRunNow(item.id)}
                          className="p-1 rounded text-orange-500 hover:bg-orange-50 cursor-pointer"
                          title="Run Now"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{item.projects}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{item.lastRun}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{item.nextRun}</td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            const newName = prompt("Edit Schedule Name:", item.name);
                            if (newName) {
                              setScheduledExports(
                                scheduledExports.map((s) => (s.id === item.id ? { ...s, name: newName } : s))
                              );
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-[#0070BA]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const cloned = { ...item, id: `s-${Date.now()}`, name: `${item.name} (Copy)` };
                            setScheduledExports([...scheduledExports, cloned]);
                            alert(`Cloned scheduled export '${item.name}'`);
                          }}
                          className="p-1 text-slate-500 hover:text-[#0070BA]"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete scheduled export '${item.name}'?`)) {
                              setScheduledExports(scheduledExports.filter((s) => s.id !== item.id));
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: EXPORT HISTORY (Screenshot 2) */}
        {modalView === "EXPORT_HISTORY" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            <h3 className="font-bold text-slate-900 text-sm">Past Export Executions Log</h3>

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-[11px] text-slate-600">
                    <th className="py-2.5 px-3">Export Name</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Scope</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exportHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{item.date}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{item.format}</td>
                      <td className="py-2.5 px-3 text-slate-700">{item.scope}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">✓ {item.status}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => alert(`Downloading archived export '${item.name}'...`)}
                          className="inline-flex items-center gap-1 text-[#0070BA] font-bold hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>File</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
