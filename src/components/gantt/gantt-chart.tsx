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
  startMs: number;
  endMs: number;
  isCritical?: boolean;
  slackDays?: number;
}

interface DepLink {
  from: GanttTask;
  to: GanttTask;
  type: DependencyType;
  isCritical?: boolean;
}

export default function GanttChart({ tasks, dependencies, onTaskClick, startDate }: GanttChartProps) {
  const [scale, setScale] = useState<number>(20);
  const [currentTime, setCurrentTime] = useState<Date>(startDate || new Date());
  const [showCriticalPath, setShowCriticalPath] = useState<boolean>(true);
  const [showSlack, setShowSlack] = useState<boolean>(true);

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

  // Critical Path & Slack Calculation Engine
  const visibleTasks: GanttTask[] = useMemo(() => {
    const mapped = tasks
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
          isCritical: false,
          slackDays: 0,
        };
      });

    if (mapped.length === 0) return mapped;

    // Calculate max end date & identify critical chain (tasks ending latest or on zero float path)
    const maxEndMs = Math.max(...mapped.map((t) => t.endMs));
    return mapped.map((task) => {
      // Find successor tasks
      const directSuccessors = dependencies
        .filter((d) => d.dependsOnTaskId === task.id)
        .map((d) => mapped.find((m) => m.id === d.taskId))
        .filter(Boolean) as GanttTask[];

      let slackDays = 0;
      if (directSuccessors.length > 0) {
        const minSuccessorStart = Math.min(...directSuccessors.map((s) => s.startMs));
        slackDays = Math.max(0, Math.round((minSuccessorStart - task.endMs) / (1000 * 60 * 60 * 24)));
      } else {
        slackDays = Math.max(0, Math.round((maxEndMs - task.endMs) / (1000 * 60 * 60 * 24)));
      }

      // Mark as critical if slack is 0 or task finishes on project finish date
      const isCritical = slackDays === 0 || task.endMs === maxEndMs;

      return {
        ...task,
        isCritical,
        slackDays,
      };
    });
  }, [tasks, dependencies, currentTime]);

  const dependencyLinks = useMemo<DepLink[]>(() => {
    return visibleTasks.flatMap((task) => {
      const taskDeps = dependencies.filter((d) => d.taskId === task.id);
      const links: DepLink[] = [];
      for (const dep of taskDeps) {
        const dependent = visibleTasks.find((t) => t.id === dep.dependsOnTaskId);
        if (dependent) {
          links.push({
            from: task,
            to: dependent,
            type: dep.type,
            isCritical: !!(task.isCritical && dependent.isCritical),
          });
        }
      }
      return links;
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

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          {/* Smart Bar Controls for Critical Path & Slack */}
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
            <button
              type="button"
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                showCriticalPath
                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${showCriticalPath ? "bg-rose-600 animate-pulse" : "bg-slate-400"}`} />
              <span>Critical Path</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSlack(!showSlack)}
              className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSlack
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${showSlack ? "bg-blue-600" : "bg-slate-400"}`} />
              <span>Slack (Float)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0070BA]" />
            <span>Finish to Start (FS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <span>Critical Link</span>
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
            const isCriticalLink = showCriticalPath && link.isCritical;

            return (
              <path
                key={`dep-${i}`}
                d={drawDependencyPath(fromX, fromY, toX, toY)}
                stroke={isCriticalLink ? "#EF4444" : "#0070BA"}
                strokeWidth={isCriticalLink ? 3 : 2}
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

          {/* Task bars & Dotted Slack Lines */}
          {visibleTasks.map((task, idx) => {
            const rowY = HEADER_HEIGHT + idx * (BAR_HEIGHT + ROW_GAP);
            const barX = task.startOffset * dayWidth;
            const barWidth = Math.max(8, task.durationDays * dayWidth);
            const slackWidth = (task.slackDays || 0) * dayWidth;
            const isCriticalTask = showCriticalPath && task.isCritical;
            const barColor = isCriticalTask ? "#EF4444" : getStatusColor(task.status);

            const progressPct = task.loggedHours && task.estimatedHours
              ? Math.min(1, task.loggedHours / task.estimatedHours)
              : 0;
            const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

            return (
              <g key={task.id}>
                {/* Dotted Slack Line representing float */}
                {showSlack && slackWidth > 0 && !isCriticalTask && (
                  <g>
                    <line
                      x1={barX + barWidth}
                      y1={rowY + BAR_HEIGHT / 2}
                      x2={barX + barWidth + slackWidth}
                      y2={rowY + BAR_HEIGHT / 2}
                      stroke="#0070BA"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={barX + barWidth + slackWidth / 2}
                      y={rowY + BAR_HEIGHT / 2 - 4}
                      fontSize={9}
                      fill="#0070BA"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Slack: {task.slackDays}d
                    </text>
                  </g>
                )}

                <rect
                  x={barX}
                  y={rowY}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={barColor}
                  fillOpacity={isCriticalTask ? 0.85 : 0.15}
                  stroke={barColor}
                  strokeWidth={isCriticalTask ? 2 : 1.5}
                  onClick={() => onTaskClick(task)}
                  style={{ cursor: "pointer" }}
                />
                <rect
                  x={barX}
                  y={rowY}
                  width={barWidth * Math.max(0.05, progressPct)}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={barColor}
                  fillOpacity={isCriticalTask ? 1 : 0.6}
                />
                <text x={barX + 6} y={rowY + 20} fontSize={11} fill={isCriticalTask ? "#FFFFFF" : "#334155"} fontWeight="bold">
                  {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
                  {isCriticalTask && " 🔴 CRITICAL"}
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
