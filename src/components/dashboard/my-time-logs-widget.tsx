"use client";

import { useState } from "react";
import { Clock, Plus, Calendar, CheckCircle2, DollarSign, ArrowRight } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface MyTimeLogsWidgetProps {
  onLogTimeClick?: () => void;
}

export default function MyTimeLogsWidget({ onLogTimeClick }: MyTimeLogsWidgetProps) {
  const [period, setPeriod] = useState<"TODAY" | "THIS_WEEK" | "THIS_MONTH">("THIS_WEEK");

  // Sample personal time log stats
  const stats = {
    todayMinutes: 480, // 8h
    weekMinutes: 2400, // 40h
    monthMinutes: 8550, // 142.5h
    billablePct: 88,
  };

  const recentLogs = [
    { id: "1", taskTitle: "02 Project Master Excel", projectName: "01 PoC Projects", duration: "01:00 hrs", date: "Today", billable: true },
    { id: "2", taskTitle: "01 Digital Twin Support at Client Side", projectName: "01 PoC Projects", duration: "06:30 hrs", date: "Yesterday", billable: true },
    { id: "3", taskTitle: "Architect Off-site Visit & General Sync", projectName: "07 Command Center", duration: "02:00 hrs", date: "22 Dec", billable: false },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs font-sans space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#0070BA]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Time Logs</h3>
            <p className="text-[11px] text-slate-500">Personal logged hours summary & recent entries</p>
          </div>
        </div>

        <button
          onClick={onLogTimeClick}
          className="inline-flex items-center gap-1 rounded-md bg-[#0070BA] px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Log Time</span>
        </button>
      </div>

      {/* Period Filter & Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Today</span>
          <span className="text-base font-black text-slate-900 font-mono">
            {formatDuration(stats.todayMinutes)}
          </span>
        </div>

        <div className="rounded-lg bg-blue-50/60 p-2.5 border border-blue-100 text-center">
          <span className="text-[10px] font-bold uppercase text-[#0070BA] block">This Week</span>
          <span className="text-base font-black text-[#0070BA] font-mono">
            {formatDuration(stats.weekMinutes)}
          </span>
        </div>

        <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100 text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">This Month</span>
          <span className="text-base font-black text-emerald-700 font-mono">
            {formatDuration(stats.monthMinutes)}
          </span>
        </div>
      </div>

      {/* Billable vs Non-Billable Progress Indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-700">Billable Ratio</span>
          <span className="text-emerald-600">{stats.billablePct}% Billable</span>
        </div>
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.billablePct}%` }} />
          <div className="bg-slate-300 h-full rounded-r-full" style={{ width: `${100 - stats.billablePct}%` }} />
        </div>
      </div>

      {/* Recent Log Entries List */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase block">Recent Log Entries</span>
        <div className="space-y-1.5">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 hover:bg-blue-50/40 transition-colors text-xs border border-slate-100"
            >
              <div className="truncate pr-2">
                <span className="font-bold text-slate-800 block truncate">{log.taskTitle}</span>
                <span className="text-[10px] text-slate-400 block">{log.projectName} • {log.date}</span>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-mono font-bold text-slate-800 block">{log.duration}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    log.billable ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {log.billable ? "Billable" : "Non-billable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
