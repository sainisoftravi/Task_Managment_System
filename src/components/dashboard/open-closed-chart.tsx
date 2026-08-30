"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TrendPoint {
  date: string;
  open: number;
  closed: number;
}

interface OpenClosedChartProps {
  data: TrendPoint[];
  days: number;
  onDaysChange: (days: number) => void;
}

export function OpenClosedChart({ data, days, onDaysChange }: OpenClosedChartProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Open vs. Closed Trends</h2>
          <p className="text-xs text-slate-500">Volume of newly opened vs. resolved items over time</p>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-slate-100 p-1 text-xs">
          <button
            onClick={() => onDaysChange(7)}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              days === 7 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onDaysChange(30)}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              days === 30 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => onDaysChange(90)}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              days === 90 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No trend data available for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748B" }}
                tickFormatter={(val) => val.slice(5)}
                stroke="#CBD5E1"
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", border: "none", color: "#F8FAFC", fontSize: "12px" }}
                labelStyle={{ fontWeight: "bold", color: "#94A3B8" }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="open"
                name="Opened"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOpen)"
              />
              <Area
                type="monotone"
                dataKey="closed"
                name="Closed / Resolved"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorClosed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
