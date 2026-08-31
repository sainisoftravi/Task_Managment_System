"use client";

import { useState } from "react";
import { X, Plus, Trash2, Check } from "lucide-react";

interface CreateCustomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (viewData: any) => void;
}

export default function CreateCustomViewModal({ isOpen, onClose, onSave }: CreateCustomViewModalProps) {
  // Criteria State matching Screenshots 2 & 3
  const [criterias, setCriterias] = useState([
    { field: "Approval Status", operator: "Is", value: "Pending" }
  ]);

  const [viewName, setViewName] = useState("Timesheets Pending Approval");
  const [description, setDescription] = useState("");
  const [customizeColumns, setCustomizeColumns] = useState(false);

  // Share Custom View State (Red Box in Screenshots 2 & 3)
  const [shareWithUsers, setShareWithUsers] = useState(true);
  const [shareScope, setShareScope] = useState<"ALL" | "SPECIFIC">("ALL");

  // Accessibility State (Red Box in Screenshots 2 & 3)
  const [showInGlobalTimesheets, setShowInGlobalTimesheets] = useState(false);
  const [showInOtherProjects, setShowInOtherProjects] = useState(true);
  const [accessibilityScope, setAccessibilityScope] = useState<"ALL" | "SPECIFIC">("ALL");

  if (!isOpen) return null;

  const handleAddCriteria = () => {
    if (criterias.length >= 15) {
      alert("You can set a maximum of 15 criteria in a custom view.");
      return;
    }
    setCriterias([...criterias, { field: "Billable Type", operator: "Is", value: "Billable" }]);
  };

  const handleRemoveCriteria = (index: number) => {
    setCriterias(criterias.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!viewName.trim()) {
      alert("Please enter a Custom View Name");
      return;
    }

    onSave({
      name: viewName.trim(),
      description,
      criterias,
      shareWithUsers,
      shareScope,
      showInGlobalTimesheets,
      showInOtherProjects,
      accessibilityScope,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans">
      <div className="w-full max-w-3xl max-h-[92vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Header matching Screenshots 2 & 3 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <h2 className="text-base font-bold text-slate-900">Create Custom View</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body matching Screenshots 2 & 3 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">
          {/* Criteria Builder */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800">Criteria</label>
            {criterias.map((crit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <select
                  value={crit.field}
                  onChange={(e) => {
                    const updated = [...criterias];
                    updated[idx].field = e.target.value;
                    setCriterias(updated);
                  }}
                  className="rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer min-w-[160px]"
                >
                  <option value="Approval Status">Approval Status</option>
                  <option value="Billable Type">Billable Type</option>
                  <option value="User">User</option>
                  <option value="Log Date">Log Date</option>
                  <option value="Project Name">Project Name</option>
                </select>

                <select
                  value={crit.operator}
                  onChange={(e) => {
                    const updated = [...criterias];
                    updated[idx].operator = e.target.value;
                    setCriterias(updated);
                  }}
                  className="rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer min-w-[120px]"
                >
                  <option value="Is">Is</option>
                  <option value="Is Not">Is Not</option>
                  <option value="Contains">Contains</option>
                  <option value="Greater Than">Greater Than</option>
                </select>

                <div className="flex-1 flex items-center gap-1.5 rounded border border-slate-300 p-1.5 bg-white">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-800 border border-slate-200">
                    {crit.value}
                    <button
                      onClick={() => handleRemoveCriteria(idx)}
                      className="text-slate-400 hover:text-slate-700 font-bold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                </div>

                {criterias.length > 1 && (
                  <button
                    onClick={() => handleRemoveCriteria(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddCriteria}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline cursor-pointer pt-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Criteria</span>
            </button>
          </div>

          {/* View Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Timesheets Pending Approval"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className="w-full rounded border border-slate-300 p-2.5 text-xs font-semibold focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Enter custom view description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={customizeColumns}
                onChange={(e) => setCustomizeColumns(e.target.checked)}
                className="rounded text-orange-500"
              />
              <span>Customize Columns to be Displayed</span>
            </label>
          </div>

          {/* Share Custom View Section (Red Box in Screenshots 2 & 3) */}
          <div className="p-4 bg-orange-50/40 rounded-lg border border-orange-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Share Custom View</h4>
            <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={shareWithUsers}
                onChange={(e) => setShareWithUsers(e.target.checked)}
                className="rounded text-orange-500"
              />
              <span>Share Custom View with other Users</span>
            </label>

            {shareWithUsers && (
              <div className="pl-6 space-y-2 font-semibold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === "ALL"}
                    onChange={() => setShareScope("ALL")}
                    className="text-orange-500"
                  />
                  <span>All Users</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === "SPECIFIC"}
                    onChange={() => setShareScope("SPECIFIC")}
                    className="text-orange-500"
                  />
                  <span>Specific Users</span>
                </label>
              </div>
            )}
          </div>

          {/* Accessibility Section (Red Box in Screenshots 2 & 3) */}
          <div className="p-4 bg-orange-50/40 rounded-lg border border-orange-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Accessibility</h4>
            <div className="space-y-2 font-semibold text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInGlobalTimesheets}
                  onChange={(e) => setShowInGlobalTimesheets(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span>Show Custom View in Work Overview &gt; Timesheets</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInOtherProjects}
                  onChange={(e) => setShowInOtherProjects(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span>Show Custom View in other Projects</span>
              </label>

              {showInOtherProjects && (
                <div className="pl-6 space-y-2 font-semibold text-slate-700 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accessibilityScope"
                      checked={accessibilityScope === "ALL"}
                      onChange={() => setAccessibilityScope("ALL")}
                      className="text-orange-500"
                    />
                    <span>All Projects</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accessibilityScope"
                      checked={accessibilityScope === "SPECIFIC"}
                      onChange={() => setAccessibilityScope("SPECIFIC")}
                      className="text-orange-500"
                    />
                    <span>Specific Projects</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions matching Screenshots 2 & 3 */}
        <div className="flex items-center gap-3 px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Save
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
    </div>
  );
}
