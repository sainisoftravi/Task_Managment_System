"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, TicketStatus, TicketPriority, Ticket as TicketType } from "@/types";
import { colorForPriority, colorForStatus, formatDateTime, generateTicketKey } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const STATUSES: { id: TicketStatus; name: string }[] = [
  { id: "OPEN", name: "Open" },
  { id: "IN_PROGRESS", name: "In Progress" },
  { id: "ON_HOLD", name: "On Hold" },
  { id: "RESOLVED", name: "Resolved" },
  { id: "CLOSED", name: "Closed" },
];

const PRIORITIES: { id: TicketPriority; name: string }[] = [
  { id: "LOW", name: "Low" },
  { id: "MEDIUM", name: "Medium" },
  { id: "HIGH", name: "High" },
  { id: "URGENT", name: "Urgent" },
];

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");

  const fetchTickets = useCallback(async (pageNum = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum) });
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (priorityFilter !== "ALL") params.set("priority", priorityFilter);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`/api/tickets?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets);
      setTotal(data.pagination?.total ?? 0);
    }
    setLoading(false);
  }, [page, search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setSearch(val);
      setPage(1);
    }, 300),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusFilter = (status: TicketStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  };

  const handlePriorityFilter = (priority: TicketPriority | "ALL") => {
    setPriorityFilter(priority);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            onChange={handleSearch}
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as TicketStatus | "ALL")}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => handlePriorityFilter(e.target.value as TicketPriority | "ALL")}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500"
          >
            <option value="ALL">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-2 text-slate-600">No tickets found</p>
          </div>
        ) : (
          tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-600">{total} tickets total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 25)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketRow({ ticket }: { ticket: TicketType }) {
  const isSLAWarning = ticket.slaDueAt && new Date(ticket.slaDueAt).getTime() - Date.now() < 60 * 60 * 1000 && !ticket.slaBreached;
  const isSlaBreached = ticket.slaBreached;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-slate-500">
              {generateTicketKey(ticket.id)}
            </span>
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${colorForPriority(ticket.priority)}`}>
              {ticket.priority}
            </span>
            {isSlaBreached && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                <AlertCircle className="h-3 w-3" />
                SLA Breached
              </span>
            )}
            {isSLAWarning && !isSlaBreached && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                <Clock className="h-3 w-3" />
                SLA Warning
              </span>
            )}
          </div>

          <h3 className="mt-1 font-medium text-slate-900 line-clamp-1">{ticket.title}</h3>

          {ticket.description && (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{ticket.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorForStatus(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>

            {ticket.customer && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {ticket.customer.name}
              </span>
            )}

            {ticket.assignee && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {ticket.assignee.name || ticket.assignee.email}
              </span>
            )}

            {ticket.team && <span>Team: {ticket.team.name}</span>}

            {ticket.dueDate && (
              <span>{formatDateTime(ticket.dueDate)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
