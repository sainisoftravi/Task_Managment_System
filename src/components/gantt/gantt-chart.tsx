"use client";

import { useState, useMemo, useRef } from "react";
import { Task, TaskDependency, DependencyType } from "@/types"
import { formatDate } from "@/lib/utils";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

const BAR_HEIGHT = 32;
const ROW_GAP = 12;
const HEADER_HEIGHT = 48;
const LEFT_PANEL_WIDTH = 240;
const MIN_DAYS = 14;

interface GanttChartProps {
  tasks: Task[];
  dependencies: TaskDependency[];
  onTaskClick: (task: Task) => void;
  startDate?: Date;
}

interface GanttTask extends Task {
  startOffset: number;
  durationDays: number;
}

interface DepLink {
  from: GanttTask;
  to: GanttTask;
  type: DependencyType;
}

export default function GanttChart({ tasks, dependencies, onTaskClick, startDate }: GanttChartProps) {
  const [scale, setScale] = useState<number>(20);
  const [currentTime, setCurrentTime] = useState<Date>(startDate || new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  const dayWidth = scale;
  const days: Date[] = useMemo(() => {
    const d: Date[] = [];
    const start = new Date(currentTime);
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < MIN_DAYS; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      d.push(date);
    }
    return d;
  }, [currentTime]);

  const startOfDay = (date: Date | string): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const chartWidth = days.length * dayWidth;
  const chartHeight = Math.max(tasks.length * (BAR_HEIGHT + ROW_GAP) + HEADER_HEIGHT + 60, 200);

  const visibleTasks: GanttTask[] = useMemo(() => {
    return tasks
      .filter((t) => t.dueDate || t.startDate)
      .map((task) => {
        const taskStartStr = task.startDate || task.dueDate || "";
        const taskEndStr = task.dueDate || taskStartStr;
        const startMs = startOfDay(taskStartStr);
        const endMs = startOfDay(taskEndStr);
        const durationDays = Math.max(1, (endMs - startMs) / (1000 * 60 * 60 * 24));
        const startOffset = (startMs - startOfDay(currentTime)) / (1000 * 60 * 60 * 24);
        return {
          ...task,
          startOffset,
          durationDays,
          startMs,
          endMs,
        };
      });
  }, [tasks, currentTime]);

  const dependencyLinks: DepLink[] = useMemo(() => {
    return visibleTasks.flatMap((task) => {
      const taskDeps = dependencies.filter((d) => d.taskId === task.id);
      return taskDeps
        .map((dep) => {
          const dependent = visibleTasks.find((t) => t.id === dep.dependsOnTaskId);
          return dependent ? { from: task, to: dependent, type: dep.type } : null;
        })
        .filter((l): l is DepLink => l !== null);
    });
  }, [visibleTasks, dependencies]);

  const handlePrev = () => setCurrentTime(new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000));
  const handleNext = () => setCurrentTime(new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNext} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentTime(new Date())} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100">
            Today
          </button>
          <span className="text-sm text-slate-600">
            {currentTime.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0070BA]" />
            <span>Finish to Start (FS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <span>Start to Start (SS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            <span>Finish to Finish (FF)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
            <span>Start to Finish (SF)</span>
          </div>
          <button onClick={() => setScale(Math.max(10, scale - 2))} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-500">Day width: {dayWidth}px</span>
          <button onClick={() => setScale(Math.min(40, scale + 2))} className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <svg width={LEFT_PANEL_WIDTH + chartWidth} height={chartHeight} className="gantt-svg">
          <rect width="100%" height={chartHeight} fill="#f8fafc" rx="6" />

          {/* Timeline header */}
          {days.map((day, i) => {
            const x = i * dayWidth;
            const isToday = day.toDateString() === new Date().toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            return (
              <g key={i}>
                <rect
                  x={LEFT_PANEL_WIDTH + x}
                  y={0}
                  width={dayWidth}
                  height={HEADER_HEIGHT}
                  fill={isToday ? "#dbeafe" : isWeekend ? "#f1f5f9" : "#ffffff"}
                  stroke={isToday ? "#3b82f6" : "#e2e8f0"}
                  strokeWidth={isToday ? 2 : 1}
                />
                <text x={LEFT_PANEL_WIDTH + x + dayWidth / 2} y={10} textAnchor="middle" fontSize={10} fill="#64748b">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </text>
                <text x={LEFT_PANEL_WIDTH + x + dayWidth / 2} y={24} textAnchor="middle" fontSize={10} fill="#64748b">
                  {day.getDate()}
                </text>
              </g>
            );
          })}

          {/* Dependency lines */}
          {dependencyLinks.map((link, i) => {
            const fromRow = visibleTasks.findIndex((t) => t.id === link.from.id);
            const toRow = visibleTasks.findIndex((t) => t.id === link.to.id);
            const fromX = link.from.startOffset * dayWidth + link.from.durationDays * dayWidth;
            const toX = link.to.startOffset * dayWidth;
            const fromY = fromRow * (BAR_HEIGHT + ROW_GAP) + HEADER_HEIGHT + BAR_HEIGHT / 2;
            const toY = toRow * (BAR_HEIGHT + ROW_GAP) + HEADER_HEIGHT + BAR_HEIGHT / 2;

            return (
              <path
                key={`dep-${i}`}
                d={drawDependencyPath(fromX, fromY, toX, toY)}
                stroke="#ef4444"
                strokeWidth={2}
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>

          {/* Task bars */}
          {visibleTasks.map((task, idx) => {
            const rowY = HEADER_HEIGHT + idx * (BAR_HEIGHT + ROW_GAP);
            const barX = task.startOffset * dayWidth;
            const barWidth = Math.max(8, task.durationDays * dayWidth);
            const progressPct = task.loggedHours && task.estimatedHours
              ? Math.min(1, task.loggedHours / task.estimatedHours)
              : 0;
            const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

            return (
              <g key={task.id}>
                <rect
                  x={barX}
                  y={rowY}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={getStatusColor(task.status)}
                  fillOpacity={0.15}
                  stroke={getStatusColor(task.status)}
                  strokeWidth={1.5}
                  onClick={() => onTaskClick(task)}
                  style={{ cursor: "pointer" }}
                />
                <rect
                  x={barX}
                  y={rowY}
                  width={barWidth * Math.max(0.05, progressPct)}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={getStatusColor(task.status)}
                  fillOpacity={0.6}
                />
                <text x={barX + 6} y={rowY + 20} fontSize={11} fill="#334155" fontWeight="500">
                  {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
                </text>
                {isToday && (
                  <line x1={barX + barWidth} y1={rowY} x2={barX + barWidth} y2={rowY + BAR_HEIGHT} stroke="#3b82f6" strokeWidth={2} />
                )}
              </g>
            );
          })}

          {/* Left panel header */}
          <rect x={0} y={0} width={LEFT_PANEL_WIDTH} height={HEADER_HEIGHT} fill="#f1f5f9" rx="6 0 0 0" />
          <text x={LEFT_PANEL_WIDTH - 12} y={30} textAnchor="end" fontSize={12} fontWeight="bold" fill="#334155">
            Task
          </text>

          {/* Left panel task labels */}
          {visibleTasks.map((task, idx) => {
            const rowY = HEADER_HEIGHT + idx * (BAR_HEIGHT + ROW_GAP);
            return (
              <g key={`row-${task.id}`}>
                <rect x={0} y={rowY - 2} width={LEFT_PANEL_WIDTH} height={BAR_HEIGHT + 4} fill="transparent" />
                <text x={12} y={rowY + 20} fontSize={11} fill="#475569">
                  {task.title.length > 30 ? task.title.slice(0, 30) + "..." : task.title}
                </text>
                <text x={12} y={rowY + 34} fontSize={10} fill="#94a3b8">
                  {task.assignee?.name ? `by ${task.assignee.name}` : "unassigned"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function drawDependencyPath(fromX: number, fromY: number, toX: number, toY: number): string {
  const offset = 10;
  return `M ${fromX} ${fromY} C ${fromX + offset} ${fromY}, ${toX - offset} ${toY}, ${toX} ${toY}`;
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    TODO: "#94a3b8",
    IN_PROGRESS: "#3b82f6",
    IN_REVIEW: "#a855f7",
    BLOCKED: "#ef4444",
    DONE: "#22c55e",
  };
  return map[status] || "#94a3b8";
}
