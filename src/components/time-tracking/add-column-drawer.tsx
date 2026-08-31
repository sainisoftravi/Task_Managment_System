"use client";

import { useState } from "react";
import { X, Search, Plus } from "lucide-react";

interface AddColumnDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (columnName: string) => void;
  onCreateCustomField: () => void;
}

export default function AddColumnDrawer({
  isOpen,
  onClose,
  onAddColumn,
  onCreateCustomField,
}: AddColumnDrawerProps) {
  const [search, setSearch] = useState("");

  const availableColumns = [
    "Multi select pick list",
    "EURO",
    "Date for Promotion",
    "Traveller's flight date",
    "Estimated Start Date",
    "Estimated End Date",
    "Event Scheduled On",
    "Review Date",
    "Second Review",
    "Site Visit Date",
    "Start time of the task",
    "End time of the task",
    "Billable Type",
    "Approval Status",
    "Approver Name",
    "Location / Post",
  ];

  if (!isOpen) return null;

  const filtered = availableColumns.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-80 h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight">
        {/* Drawer Header matching Screenshot 1 */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Add Column</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search columns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Column Fields List matching Screenshot 1 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs font-sans">
          {filtered.map((col) => (
            <div
              key={col}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 transition-colors"
            >
              <span className="font-semibold text-slate-700">{col}</span>
              <button
                onClick={() => {
                  onAddColumn(col);
                  alert(`Added column '${col}' to table view.`);
                }}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                +Add
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Button (Red Box in Screenshot 1) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              onCreateCustomField();
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-orange-500 bg-white px-4 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Field</span>
          </button>
        </div>
      </div>
    </div>
  );
}
