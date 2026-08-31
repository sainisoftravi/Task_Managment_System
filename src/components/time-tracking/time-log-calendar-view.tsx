"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User, CheckCircle, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TimeLogCalendarViewProps {
  onDateClick: (dateStr: string) => void;
}

export default function TimeLogCalendarView({ onDateClick }: TimeLogCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  // Generate Calendar Days Array
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Simulated logged hours per day
  const sampleLogsByDay: Record<number, { hrs: number; billable: boolean; task: string }[]> = {
    4: [{ hrs: 8, billable: true, task: "02 Project Master Excel" }],
    12: [{ hrs: 6, billable: true, task: "01 Digital Twin Support" }, { hrs: 2, billable: false, task: "Team Sync" }],
    18: [{ hrs: 8, billable: true, task: "API Optimization" }],
    25: [{ hrs: 7.5, billable: true, task: "SLA Escalation Testing" }],
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-3 rounded-lg shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth} className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNextMonth} className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-slate-900">{monthName}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700">
          <span>Month Total: <strong className="text-[#0070BA]">142.5 hrs</strong></span>
          <span>Billable: <strong className="text-emerald-600">128 hrs</strong></span>
        </div>
      </div>

      {/* Monthly Grid with Weekly Summary Column */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="grid grid-cols-8 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase text-center py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div className="bg-slate-100 text-[#0070BA]">Week Total</div>
        </div>

        <div className="grid grid-cols-8 divide-x divide-y divide-slate-200 text-xs min-h-[500px]">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-slate-50/50 p-2" />;
            }

            const dayLogs = sampleLogsByDay[day] || [];
            const dayTotal = dayLogs.reduce((sum, l) => sum + l.hrs, 0);
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <div
                key={day}
                onClick={() => onDateClick(dateStr)}
                className="p-2 min-h-[90px] bg-white hover:bg-blue-50/30 transition-colors cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-slate-800">{day}</span>
                  {dayTotal > 0 && (
                    <span className="text-[10px] font-bold font-mono bg-blue-100 text-[#0070BA] px-1.5 py-0.5 rounded">
                      {dayTotal}h
                    </span>
                  )}
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 text-blue-600 hover:bg-blue-100 rounded transition-opacity">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Day Logs Summary Pill */}
                <div className="space-y-1 mt-1">
                  {dayLogs.map((l, lIdx) => (
                    <div
                      key={lIdx}
                      className={`p-1 rounded text-[10px] truncate font-medium ${
                        l.billable ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {l.task} ({l.hrs}h)
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Weekly Summary Total Box */}
          <div className="bg-slate-100 p-3 font-mono font-bold text-xs text-center text-[#0070BA] flex flex-col items-center justify-center border-l border-slate-200">
            <span className="text-[10px] font-sans text-slate-500 block">Weekly Sum</span>
            <span className="text-sm">40.0 hrs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
