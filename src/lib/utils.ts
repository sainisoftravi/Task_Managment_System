import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDaysOverdue(date: Date | string): number {
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateSLA(
  createdAt: Date,
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  responseTimeMinutes: number,
  resolutionTimeMinutes: number
): { slaDueAt: Date; slaBreached: boolean } {
  const minutesToAdd = priority === "LOW"
    ? responseTimeMinutes * 2
    : priority === "URGENT"
    ? Math.floor(responseTimeMinutes / 2)
    : responseTimeMinutes;

  const due = new Date(createdAt.getTime() + minutesToAdd * 60 * 1000);
  return {
    slaDueAt: due,
    slaBreached: Date.now() > due.getTime(),
  };
}

export function generateTicketKey(id: string): string {
  const shortId = id.slice(0, 8).toUpperCase();
  return `TKT-${shortId}`;
}

export function generateProjectKey(name: string): string {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  const num = Math.floor(Math.random() * 900) + 100;
  return `${initials}-${num}`;
}

export function colorForPriority(priority: string): string {
  const map: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-amber-100 text-amber-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };
  return map[priority] || "bg-slate-100 text-slate-800";
}

export function colorForStatus(status: string): string {
  const map: Record<string, string> = {
    OPEN: "bg-slate-100 text-slate-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    ON_HOLD: "bg-amber-100 text-amber-800",
    RESOLVED: "bg-emerald-100 text-emerald-800",
    CLOSED: "bg-gray-100 text-gray-800",
    TODO: "bg-slate-100 text-slate-800",
    IN_REVIEW: "bg-purple-100 text-purple-800",
    BLOCKED: "bg-red-100 text-red-800",
    DONE: "bg-emerald-100 text-emerald-800",
  };
  return map[status] || "bg-slate-100 text-slate-800";
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function parseFlexibleDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) return d;
    }
    if (parts[2].length === 4) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(d.getTime())) return d;
    }
  }
  return undefined;
}
