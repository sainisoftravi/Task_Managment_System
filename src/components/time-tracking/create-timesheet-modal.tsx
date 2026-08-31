"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface CreateTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (timesheetData: any) => void;
  initialSelectedLogs?: any[];
}

export default function CreateTimesheetModal({
  isOpen,
  onClose,
  onSuccess,
  initialSelectedLogs = [],
}: CreateTimesheetModalProps) {
  const [step, setStep] = useState<"CONFIG" | "BUILDER">("CONFIG");

  // Config Form State matching Screenshot 1
  const [timePeriod, setTimePeriod] = useState("08-01-2025 to 08-31-2025");
  const [logUser, setLogUser] = useState("Charlie Three");
  const [project, setProject] = useState("Manufacturing");
  const [customer, setCustomer] = useState("Select");
  const [billingType, setBillingType] = useState("Billable");

  // Timesheet Builder Form State
  const [timesheetName, setTimesheetName] = useState(
    initialSelectedLogs.length > 0
      ? `Timesheet - ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
      : ""
  );
  const [rows, setRows] = useState([
    { taskOrIssue: "Electricity and wiring", mon: "08:00", tue: "08:00", wed: "08:00", thu: "08:00", fri: "08:00" },
    { taskOrIssue: "Assembly cost check", mon: "04:00", tue: "04:00", wed: "04:00", thu: "04:00", fri: "04:00" },
  ]);

  if (!isOpen) return null;

  const handleCreateConfig = () => {
    if (!timesheetName) {
      setTimesheetName(`${project} - ${logUser} Timesheet`);
    }
    setStep("BUILDER");
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { taskOrIssue: "General log entry", mon: "00:00", tue: "00:00", wed: "00:00", thu: "00:00", fri: "00:00" },
    ]);
  };

  const handleSaveDraft = () => {
    onSuccess({
      id: `ts-${Date.now()}`,
      name: timesheetName || "Untitled Timesheet",
      timePeriod,
      project,
      billingType,
      user: logUser,
      totalHours: "40:00",
      status: "Draft",
    });
    onClose();
  };

  const handleSendForApproval = () => {
    onSuccess({
      id: `ts-${Date.now()}`,
      name: timesheetName || "Untitled Timesheet",
      timePeriod,
      project,
      billingType,
      user: logUser,
      totalHours: "40:00",
      status: "Pending Approval",
    });
    alert(`Timesheet '${timesheetName}' submitted for approval based on approval rules.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Header matching Screenshot 1 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <h2 className="text-base font-bold text-slate-900">Create Timesheet</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: CONFIGURATION FORM matching Screenshot 1 */}
        {step === "CONFIG" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Time Period<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs font-mono bg-white focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Log Users<span className="text-red-500">*</span>
              </label>
              <select
                value={logUser}
                onChange={(e) => setLogUser(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer font-medium"
              >
                <option value="Charlie Three">CT Charlie Three</option>
                <option value="Monica Hemsworth">MH Monica Hemsworth</option>
                <option value="Ravi Saini">RS Ravi Saini</option>
                <option value="Eduardo Vargas">EV Eduardo Vargas</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Project<span className="text-red-500">*</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer font-medium"
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Donnelly Apartments Construction">Donnelly Apartments Construction</option>
                <option value="Software Development">Software Development</option>
                <option value="Automobile Spare Manufacturing">Automobile Spare Manufacturing</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Customer</label>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer"
                >
                  <option value="Select">Select Customer...</option>
                  <option value="Zylker Corp">Zylker Corp</option>
                  <option value="Frank-House Ltd">Frank-House Ltd</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Billing Type</label>
                <select
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer"
                >
                  <option value="Billable">Billable</option>
                  <option value="Non-Billable">Non-Billable</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions matching Screenshot 1 */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-4">
              <button
                type="button"
                onClick={handleCreateConfig}
                className="rounded-md bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Create
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

        {/* STEP 2: TIMESHEET BUILDER & DAILY HOUR MATRIX */}
        {step === "BUILDER" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Timesheet Name*</label>
              <input
                type="text"
                placeholder="e.g. Monthly Approval - August"
                value={timesheetName}
                onChange={(e) => setTimesheetName(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs font-bold focus:border-orange-500"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Project: <b>{project}</b></span>
              <span>User: <b>{logUser}</b></span>
              <span>Period: <b>{timePeriod}</b></span>
            </div>

            {/* Hours Entry Table */}
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-2 px-3">Task / Issue</th>
                    <th className="py-2 px-2 text-center">Mon</th>
                    <th className="py-2 px-2 text-center">Tue</th>
                    <th className="py-2 px-2 text-center">Wed</th>
                    <th className="py-2 px-2 text-center">Thu</th>
                    <th className="py-2 px-2 text-center">Fri</th>
                    <th className="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-bold font-sans text-slate-800">{row.taskOrIssue}</td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          value={row.mon}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].mon = e.target.value;
                            setRows(updated);
                          }}
                          className="w-12 text-center rounded border border-slate-200 p-1"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          value={row.tue}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].tue = e.target.value;
                            setRows(updated);
                          }}
                          className="w-12 text-center rounded border border-slate-200 p-1"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          value={row.wed}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].wed = e.target.value;
                            setRows(updated);
                          }}
                          className="w-12 text-center rounded border border-slate-200 p-1"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          value={row.thu}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].thu = e.target.value;
                            setRows(updated);
                          }}
                          className="w-12 text-center rounded border border-slate-200 p-1"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          value={row.fri}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].fri = e.target.value;
                            setRows(updated);
                          }}
                          className="w-12 text-center rounded border border-slate-200 p-1"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => setRows(rows.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Row</span>
            </button>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setStep("CONFIG")}
                className="text-xs font-semibold text-slate-500 hover:underline"
              >
                ← Back to Config
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleSendForApproval}
                  className="rounded-md bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Send for Approval
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
