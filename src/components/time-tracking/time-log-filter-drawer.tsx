"use client";

import { useState } from "react";
import { X, Search, ChevronDown, ChevronUp, User, Users } from "lucide-react";

interface TimeLogFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filterData: any) => void;
}

export default function TimeLogFilterDrawer({
  isOpen,
  onClose,
  onApplyFilter,
}: TimeLogFilterDrawerProps) {
  const [filterSearch, setFilterSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"USER" | "TEAMS">("USER");

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    logUsers: true,
    type: false,
    status: false,
    approvalBy: false,
    addedBy: false,
    createdTime: false,
    modifiedTime: false,
  });

  // Selected Users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    "Eduardo Vargas",
    "Einhard Klein",
    "Faiyazudeen I",
  ]);

  const [matchLogic, setMatchLogic] = useState<"ANY" | "ALL">("ALL");

  const sampleUsers = [
    "Eduardo Vargas",
    "Einhard Klein",
    "Faiyazudeen I",
    "Fathima Yilmaz",
    "Guru Vignesh S",
    "Kamalakannan B",
    "Monica Hemsworth",
    "Ravi Saini",
    "Sushil Verma",
  ];

  if (!isOpen) return null;

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleUserSelect = (u: string) => {
    if (selectedUsers.includes(u)) {
      setSelectedUsers(selectedUsers.filter((item) => item !== u));
    } else {
      setSelectedUsers([...selectedUsers, u]);
    }
  };

  const handleReset = () => {
    setSelectedUsers([]);
    setMatchLogic("ALL");
  };

  const handleFind = () => {
    onApplyFilter({ selectedUsers, matchLogic });
    onClose();
  };

  const filteredUsers = sampleUsers.filter((u) =>
    u.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-80 sm:w-96 h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slideInRight">
        {/* Header matching Screenshot 2 */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Filter</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Reset
              </button>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter Search"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full rounded border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Filter Accordions matching Screenshot 2 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-sans">
          {/* Log Users Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <button
              onClick={() => toggleAccordion("logUsers")}
              className="w-full p-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <span>Log Users</span>
                <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px]">
                  {selectedUsers.length}
                </span>
                <span className="text-slate-400 font-normal text-[11px]">Is ▾</span>
              </div>
              {openAccordions.logUsers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {openAccordions.logUsers && (
              <div className="p-3 space-y-3 border-t border-slate-200">
                {/* Sub-tabs: User vs Teams */}
                <div className="flex border-b border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("USER")}
                    className={`pb-1.5 px-3 border-b-2 ${
                      activeTab === "USER" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500"
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={() => setActiveTab("TEAMS")}
                    className={`pb-1.5 px-3 border-b-2 ${
                      activeTab === "TEAMS" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500"
                    }`}
                  >
                    Teams
                  </button>
                </div>

                {activeTab === "USER" && (
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {filteredUsers.map((u) => {
                      const checked = selectedUsers.includes(u);
                      return (
                        <label
                          key={u}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleUserSelect(u)}
                            className="rounded text-orange-500 cursor-pointer"
                          />
                          <span>{u}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Type Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("type")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Type</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Status Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("status")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Status</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Approval By Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("approvalBy")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Approval By</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Added By Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("addedBy")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Added By</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Created Time Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("createdTime")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Created Time</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Modified Time Accordion */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => toggleAccordion("modifiedTime")}
              className="w-full p-3 flex items-center justify-between font-bold text-slate-800"
            >
              <span>Modified Time</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Match Logic: Any vs All matching Screenshot 2 */}
          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="matchLogic"
                checked={matchLogic === "ANY"}
                onChange={() => setMatchLogic("ANY")}
                className="text-orange-500"
              />
              <span>Any of these</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="matchLogic"
                checked={matchLogic === "ALL"}
                onChange={() => setMatchLogic("ALL")}
                className="text-orange-500"
              />
              <span>All of these</span>
            </label>
          </div>
        </div>

        {/* Footer Action Buttons matching Screenshot 2 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={handleFind}
            className="rounded bg-orange-500 hover:bg-orange-600 px-6 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Find
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-orange-400 bg-white px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
