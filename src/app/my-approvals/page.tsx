"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  Filter,
  HelpCircle,
  Sliders,
  ExternalLink,
  ChevronDown,
  Eye
} from "lucide-react";

export default function MyApprovalsPage() {
  const [filterCategory, setFilterCategory] = useState<"Approved" | "Pending" | "Rejected" | "All">("Approved");
  const [search, setSearch] = useState("");

  const [timesheets, setTimesheets] = useState([
    { id: "ts-1", name: "Jan 25", timePeriod: "01-26-2025 to 02-01-2025", projectName: "All Projects", billingType: "Billable", totalHours: "00:06", status: "Approved" },
    { id: "ts-2", name: "Feb 25", timePeriod: "02-02-2025 to 02-08-2025", projectName: "Software Development", billingType: "All", totalHours: "02:36", status: "Approved" },
    { id: "ts-3", name: "Jan Last Week", timePeriod: "01-26-2025 to 02-01-2025", projectName: "Software Development", billingType: "All", totalHours: "69:00", status: "Approved" },
    { id: "ts-4", name: "Feb 1st Week", timePeriod: "02-09-2025 to 02-15-2025", projectName: "Digital Marketing", billingType: "All", totalHours: "00:32", status: "Approved" },
    { id: "ts-5", name: "Marketing - March", timePeriod: "02-09-2025 to 02-15-2025", projectName: "Digital Marketing", billingType: "All", totalHours: "02:39", status: "Approved" },
    { id: "ts-6", name: "March - SD", timePeriod: "03-02-2025 to 03-08-2025", projectName: "Software Development", billingType: "All", totalHours: "32:00", status: "Approved" },
    { id: "ts-7", name: "March-1st Week", timePeriod: "03-09-2025 to 03-15-2025", projectName: "Manufacturing", billingType: "All", totalHours: "00:50", status: "Approved" },
    { id: "ts-8", name: "Monthly Approval - August", timePeriod: "08-01-2025 to 08-31-2025", projectName: "Manufacturing", billingType: "Billable", totalHours: "160:00", status: "Pending" },
    { id: "ts-9", name: "Site Construction Phase 1", timePeriod: "08-10-2025 to 08-20-2025", projectName: "Donnelly Apartments", billingType: "Billable", totalHours: "48:00", status: "Rejected" },
  ]);

  const [selectedTimesheet, setSelectedTimesheet] = useState<any | null>(null);

  const filtered = timesheets.filter((t) => {
    if (filterCategory !== "All" && t.status !== filterCategory) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = (id: string) => {
    setTimesheets(
      timesheets.map((t) => (t.id === id ? { ...t, status: "Approved" } : t))
    );
    alert(`Approved timesheet successfully.`);
  };

  const handleReject = (id: string) => {
    const reason = prompt("Enter rejection comments:");
    if (reason !== null) {
      setTimesheets(
        timesheets.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t))
      );
      alert(`Rejected timesheet. Comments saved.`);
    }
  };

  const handleRecall = (id: string) => {
    setTimesheets(
      timesheets.map((t) => (t.id === id ? { ...t, status: "Draft" } : t))
    );
    alert(`Recalled timesheet to Draft mode.`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this timesheet permanently?")) {
      setTimesheets(timesheets.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header matching Screenshot 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 bg-white p-4 rounded-lg shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Approvals</h1>
          <p className="text-xs text-slate-500">Review, approve, reject, or recall employee timesheet submissions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Configure Timesheet Approval Rules Automation")}
            className="inline-flex items-center gap-1.5 rounded-md border border-orange-400 bg-white px-3.5 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer shadow-xs"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Automation</span>
          </button>

          <button
            onClick={() => alert("Filter My Approvals")}
            className="p-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Filter"
          >
            <Filter className="h-4 w-4 text-orange-500" />
          </button>

          <button
            onClick={() => alert("Help documentation for Timesheet Approvals")}
            className="p-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* View Filter Category Bar matching Screenshot 3 */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold text-orange-600 bg-white focus:outline-none cursor-pointer"
          >
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Approval</option>
            <option value="Rejected">Rejected</option>
            <option value="All">All Timesheets</option>
          </select>

          <span className="text-slate-400 font-semibold">Total Count: {filtered.length}</span>
        </div>

        <input
          type="text"
          placeholder="Search timesheets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-slate-300 px-3 py-1 text-xs focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Data Table matching Screenshot 3 */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
              <th className="py-3 px-4">TIMESHEET NAME</th>
              <th className="py-3 px-4">TIME PERIOD</th>
              <th className="py-3 px-4">PROJECT NAME</th>
              <th className="py-3 px-4">BILLING TYPE</th>
              <th className="py-3 px-4">TOTAL HOURS</th>
              <th className="py-3 px-4">APPROVAL STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center justify-between">
                  <span>{item.name}</span>
                  <button
                    onClick={() => setSelectedTimesheet(item)}
                    className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 border border-orange-300 bg-orange-50 px-2 py-0.5 rounded text-[11px] font-bold text-orange-600 hover:bg-orange-100 cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </button>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">{item.timePeriod}</td>
                <td className="py-3 px-4 text-slate-800 font-semibold">{item.projectName}</td>
                <td className="py-3 px-4 text-slate-700">{item.billingType}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.totalHours}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                      item.status === "Approved"
                        ? "bg-emerald-500 text-white"
                        : item.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : item.status === "Rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.status === "Approved" && "✓ "}
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  {item.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-2 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {item.status === "Pending" && (
                    <button
                      onClick={() => handleRecall(item.id)}
                      className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded font-semibold hover:bg-amber-100 cursor-pointer"
                    >
                      Recall
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Timesheet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timesheet Details Drawer Modal */}
      {selectedTimesheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{selectedTimesheet.name} Details</h3>
              <button onClick={() => setSelectedTimesheet(null)} className="p-1 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-400">Period:</span> <b>{selectedTimesheet.timePeriod}</b></div>
                <div><span className="text-slate-400">Project:</span> <b>{selectedTimesheet.projectName}</b></div>
                <div><span className="text-slate-400">Billing:</span> <b>{selectedTimesheet.billingType}</b></div>
                <div><span className="text-slate-400">Total Hours:</span> <b>{selectedTimesheet.totalHours}</b></div>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-800 block mb-1">Approval Trail & Audit Stream</span>
                <div className="p-3 bg-blue-50/50 rounded border border-blue-100 space-y-1">
                  <p className="text-[11px] text-blue-900 font-semibold">
                    ✓ Submitted for approval by Charlie Three on 01/08/2025 09:00 AM
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold">
                    ✓ Status: {selectedTimesheet.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              {selectedTimesheet.status === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedTimesheet.id);
                      setSelectedTimesheet(null);
                    }}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedTimesheet.id);
                      setSelectedTimesheet(null);
                    }}
                    className="rounded-md bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedTimesheet(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
