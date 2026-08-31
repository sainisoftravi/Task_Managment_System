"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Plus,
  Calendar,
  RotateCw,
  X,
  Filter,
  Download,
  Info,
  GripVertical
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface MyTimeLogsWidgetProps {
  onLogTimeClick?: () => void;
  onWeeklyLogClick?: () => void;
  onExportClick?: () => void;
}

export default function MyTimeLogsWidget({
  onLogTimeClick,
  onWeeklyLogClick,
  onExportClick,
}: MyTimeLogsWidgetProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 7-day logged time dataset matching user screenshot
  const daysData = [
    { day: "Wed", billableHours: 0, nonBillableHours: 0 },
    { day: "Thu", billableHours: 3.0, nonBillableHours: 0 },
    { day: "Fri", billableHours: 6.0, nonBillableHours: 0 },
    { day: "Sat", billableHours: 0, nonBillableHours: 0 },
    { day: "Sun", billableHours: 0, nonBillableHours: 0 },
    { day: "Mon", billableHours: 0, nonBillableHours: 0 },
    { day: "Tue", billableHours: 0, nonBillableHours: 0 },
  ];

  const totalBillable = daysData.reduce((sum, d) => sum + d.billableHours, 0);
  const totalNonBillable = daysData.reduce((sum, d) => sum + d.nonBillableHours, 0);
  const totalHours = totalBillable + totalNonBillable;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportXLSXUserWise = () => {
    // Client-side Excel export user-wise
    const csvContent =
      "User,Project,Task Name,Date,Billable Hours,Non-Billable Hours,Total Hours,Status\n" +
      "Monica Hemsworth,Donnelly Apartments,Electricity and Wiring,2026-08-28,3.0,0.0,3.0,Approved\n" +
      "Monica Hemsworth,Donnelly Apartments,Floor Tiling,2026-08-29,6.0,0.0,6.0,Approved\n" +
      "Ravi Saini,IT Support Project,Database Optimization,2026-08-29,4.5,1.5,6.0,Approved\n" +
      "Eduardo Vargas,Engineering Team,Bridge Blueprint Check,2026-08-30,5.0,0.0,5.0,Pending\n";

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_wise_timesheet_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isClosed) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs font-sans space-y-4 relative animate-fadeIn">
      {/* Widget Drag & Actions Header matching User Screenshot */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 text-slate-800">
          <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1">
            <span title="7-Day Summary">
              <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleRefresh}
            className={`p-1 text-slate-400 hover:text-slate-700 cursor-pointer ${
              isRefreshing ? "animate-spin text-orange-500" : ""
            }`}
            title="Refresh Data"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/time-tracking"
            className="text-orange-600 font-bold hover:underline cursor-pointer"
          >
            View More
          </Link>

          <button
            onClick={() => setIsClosed(true)}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            title="Close Widget"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Visual Bar Chart & Legend matching User Screenshot */}
      <div className="space-y-3">
        {/* Legend */}
        <div className="flex items-center justify-end gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#38bdf8] rounded-xs" />
            <span>Billable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#f97316] rounded-xs" />
            <span>Non Billable</span>
          </div>
        </div>

        {/* SVG Bar Chart matching User Screenshot */}
        <div className="h-44 w-full flex items-end justify-between px-6 pt-4 pb-2 border-b border-slate-100">
          {daysData.map((item) => {
            const billHeight = (item.billableHours / 6) * 120; // max scale 6
            const nonBillHeight = (item.nonBillableHours / 6) * 120;

            return (
              <div key={item.day} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end gap-1 h-32">
                  {/* Billable Bar */}
                  <div
                    className="w-5 bg-[#38bdf8] rounded-t-xs transition-all duration-300 hover:opacity-80 relative group"
                    style={{ height: `${Math.max(billHeight, item.billableHours > 0 ? 8 : 0)}px` }}
                  >
                    {item.billableHours > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono z-10 whitespace-nowrap shadow-md">
                        {item.billableHours} hrs
                      </div>
                    )}
                  </div>

                  {/* Non-Billable Bar */}
                  {item.nonBillableHours > 0 && (
                    <div
                      className="w-5 bg-[#f97316] rounded-t-xs transition-all duration-300 hover:opacity-80 relative group"
                      style={{ height: `${Math.max(nonBillHeight, 8)}px` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono z-10 whitespace-nowrap shadow-md">
                        {item.nonBillableHours} hrs
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-600 mt-2">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Totals Row matching User Screenshot */}
      <div className="flex items-center justify-center gap-8 py-2 text-center text-xs font-sans border-b border-slate-100">
        <div>
          <span className="text-slate-500 font-medium block">Billable</span>
          <span className="text-base font-bold text-[#0284c7] font-mono">
            {totalBillable < 10 ? `0${totalBillable}` : totalBillable}:00<span className="text-xs font-normal">hrs</span>
          </span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Non Billable</span>
          <span className="text-base font-bold text-[#f97316] font-mono">
            {totalNonBillable < 10 ? `0${totalNonBillable}` : totalNonBillable}:00<span className="text-xs font-normal">hrs</span>
          </span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Total</span>
          <span className="text-base font-bold text-[#0284c7] font-mono">
            {totalHours < 10 ? `0${totalHours}` : totalHours}:00<span className="text-xs font-normal">hrs</span>
          </span>
        </div>
      </div>

      {/* Interactive Action Toolbar */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onLogTimeClick}
            className="inline-flex items-center gap-1 rounded bg-[#0070BA] px-3 py-1.5 font-bold text-white hover:bg-blue-700 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Log Time</span>
          </button>

          <button
            onClick={onWeeklyLogClick}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-600" />
            <span>Weekly Log Time</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXLSXUserWise}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            title="Export XLSX Data User Wise"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export User Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
