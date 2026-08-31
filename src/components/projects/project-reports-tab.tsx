"use client";

import { useState } from "react";
import { Task, Project } from "@/types";
import {
  Folder,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Sliders,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  BarChart2,
  LineChart as LineIcon,
  LayoutGrid
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

interface ProjectReportsTabProps {
  project: Project;
  tasks: Task[];
}

const REPORT_COLORS = ["#FF7675", "#55E6C1", "#A29BFE", "#F6B93B", "#74B9FF", "#FD79A8"];

export default function ProjectReportsTab({ project, tasks }: ProjectReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<string>("Status");
  const [chartType, setChartType] = useState<"bar" | "column" | "pie" | "line">("column");
  const [xAxisField, setXAxisField] = useState<string>("Status");
  const [yAxisField, setYAxisField] = useState<string>("Count");

  // Generate Dynamic Report Data based on selected report & X-Axis field
  const reportDataMap: Record<string, { name: string; count: number }[]> = {
    Status: [
      { name: "Closed", count: 15 },
      { name: "In Review...", count: 3 },
      { name: "not yet...", count: 3 },
      { name: "In QA", count: 2 },
    ],
    Owner: [
      { name: "Ravi Saini", count: 8 },
      { name: "Divakar Pandiy", count: 7 },
      { name: "Sushil Verma", count: 5 },
      { name: "Aman Besham", count: 3 },
    ],
    Priority: [
      { name: "HIGH", count: 9 },
      { name: "MEDIUM", count: 8 },
      { name: "LOW", count: 4 },
      { name: "URGENT", count: 2 },
    ],
    Phase: [
      { name: "Phase 1: Design", count: 10 },
      { name: "Phase 2: Build", count: 8 },
      { name: "Phase 3: Testing", count: 5 },
    ],
    "Completion Percentage": [
      { name: "0% - 25%", count: 6 },
      { name: "26% - 50%", count: 4 },
      { name: "51% - 75%", count: 3 },
      { name: "76% - 100%", count: 10 },
    ],
    "Created Vs Completed": [
      { name: "Jan", count: 4 },
      { name: "Feb", count: 7 },
      { name: "Mar", count: 9 },
      { name: "Apr", count: 12 },
    ],
  };

  const currentData = reportDataMap[selectedReport] || reportDataMap["Status"];
  const totalTasks = currentData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="flex flex-col lg:flex-row h-[750px] border border-slate-200 bg-white rounded-md shadow-xs overflow-hidden font-sans">
      
      {/* Left Sidebar: REPORTS & FOLDERS */}
      <div className="w-full lg:w-64 border-r border-slate-200 bg-slate-50/70 p-3 overflow-y-auto flex-shrink-0">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Reports & Folders
          </span>
          <Search className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
        </div>

        {/* Folder 1: Task Basic Reports */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 py-1">
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            <span>Task Basic Reports</span>
          </div>
          <div className="pl-4 space-y-0.5 text-xs font-medium">
            {["Status", "Owner", "Priority", "Phase", "Completion Percentage"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedReport(item);
                  setXAxisField(item);
                }}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  selectedReport === item
                    ? "bg-[#0070BA]/10 text-[#0070BA] font-bold border-l-2 border-l-[#0070BA]"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Folder 2: Task Advanced Reports */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 py-1">
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            <span>Task Advanced Reports</span>
          </div>
          <div className="pl-4 space-y-0.5 text-xs font-medium">
            {["Task Status by Owner", "Task Priority by Owner", "Created Vs Completed"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedReport(item);
                }}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  selectedReport === item
                    ? "bg-[#0070BA]/10 text-[#0070BA] font-bold border-l-2 border-l-[#0070BA]"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Folder 3: Issue Basic Reports */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 py-1">
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Issue Basic Reports</span>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">{selectedReport}</h2>
            <span className="text-xs text-slate-400 font-mono">TOTAL : {totalTasks} Tasks</span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="flex-1 w-full min-h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={50}
                  dataKey="count"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REPORT_COLORS[index % REPORT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : chartType === "line" ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0070BA" strokeWidth={3} />
              </LineChart>
            ) : (
              <BarChart data={currentData} layout={chartType === "bar" ? "vertical" : "horizontal"}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                {chartType === "bar" ? (
                  <>
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                  </>
                )}
                <Tooltip />
                <Bar dataKey="count" label={{ position: "top", fill: "#334155", fontSize: 11, fontWeight: "bold" }}>
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REPORT_COLORS[index % REPORT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Sidebar: Chart Configuration */}
      <div className="w-full lg:w-72 border-l border-slate-200 bg-slate-50/70 p-4 overflow-y-auto flex-shrink-0">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
          <span className="text-xs font-bold text-slate-800">Chart Configuration</span>
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Chart Type Icon Selector Palette */}
        <div className="mb-6">
          <span className="block text-[11px] font-semibold text-slate-500 mb-2">CHART TYPE</span>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setChartType("column")}
              className={`p-2 rounded border text-center flex flex-col items-center justify-center transition-all ${
                chartType === "column" ? "border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-[9px] mt-1 font-medium">Column</span>
            </button>

            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded border text-center flex flex-col items-center justify-center transition-all ${
                chartType === "bar" ? "border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span className="text-[9px] mt-1 font-medium">Bar</span>
            </button>

            <button
              onClick={() => setChartType("pie")}
              className={`p-2 rounded border text-center flex flex-col items-center justify-center transition-all ${
                chartType === "pie" ? "border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PieIcon className="h-4 w-4" />
              <span className="text-[9px] mt-1 font-medium">Pie</span>
            </button>

            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded border text-center flex flex-col items-center justify-center transition-all ${
                chartType === "line" ? "border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LineIcon className="h-4 w-4" />
              <span className="text-[9px] mt-1 font-medium">Line</span>
            </button>
          </div>
        </div>

        {/* Plot Options Inputs */}
        <div className="space-y-4">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Plot Options</span>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">X-AXIS</label>
            <select
              value={xAxisField}
              onChange={(e) => {
                setXAxisField(e.target.value);
                setSelectedReport(e.target.value);
              }}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-[#0070BA] focus:outline-none"
            >
              <option value="Status">Status</option>
              <option value="Owner">Owner</option>
              <option value="Priority">Priority</option>
              <option value="Phase">Phase</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Y-AXIS</label>
            <select
              value={yAxisField}
              onChange={(e) => setYAxisField(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-[#0070BA] focus:outline-none"
            >
              <option value="Count">Count (Task)</option>
              <option value="Hours">Estimated Hours</option>
              <option value="Logged">Logged Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">GROUP BY</label>
            <select className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-[#0070BA] focus:outline-none">
              <option value="">Select ▾</option>
              <option value="Owner">Owner</option>
              <option value="Priority">Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">VALUE</label>
            <select className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-[#0070BA] focus:outline-none">
              <option value="Static">Static value ▾</option>
              <option value="Dynamic">Dynamic count</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
