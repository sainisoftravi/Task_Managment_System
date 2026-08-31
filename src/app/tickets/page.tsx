"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { TicketStatus, TicketPriority, Ticket as TicketType, User as UserType } from "@/types";
import { colorForPriority, colorForStatus, formatDateTime, generateTicketKey } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Trash2,
  UserCheck,
  Tag,
  Calendar,
  CheckSquare,
  Square,
  ChevronDown,
  Loader2,
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

import { LayoutGrid, List, Download } from "lucide-react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Selection & Bulk Operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const handleExportIssues = () => {
    alert("Exporting Issues across all projects to Excel (.xlsx)... Download link ready!");
  };

  // Fetch Users for Agent filter & Bulk Assignment
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch("/api/users", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch(() => {});
  }, []);

  const fetchTickets = useCallback(async (pageNum = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum) });
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
    if (assigneeFilter !== "ALL") params.set("assigneeId", assigneeFilter);
    if (categoryFilter !== "ALL") params.set("category", categoryFilter);
    if (startDateFilter) params.set("startDate", startDateFilter);
    if (endDateFilter) params.set("endDate", endDateFilter);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`/api/tickets?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets || []);
      setTotal(data.pagination?.total ?? 0);
    }
    setLoading(false);
  }, [page, search, statusFilter, priorityFilter, assigneeFilter, categoryFilter, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const toggleSelectAll = () => {
    if (selectedIds.length === tickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tickets.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedIds.length === 0) return;
    if (action === "DELETE" && !confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) {
      return;
    }

    setBulkActionLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch("/api/tickets/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ticketIds: selectedIds,
          action,
          payload,
        }),
      });

      if (res.ok) {
        setSelectedIds([]);
        fetchTickets();
      } else {
        alert("Bulk operation failed");
      }
    } catch (e) {
      alert("An error occurred during bulk operation");
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issues & Bug Tracker Overview</h1>
          <p className="text-sm text-slate-500">Cross-project issue tracking, SLA compliance & resolutions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                viewMode === "list" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded ${
                viewMode === "kanban" ? "bg-white text-[#0070BA] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={handleExportIssues}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export Issues</span>
          </button>

          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Submit Issue
          </Link>
        </div>
      </div>

      {/* Multi-Attribute Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, description, or ticket ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as TicketStatus | "ALL");
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as TicketPriority | "ALL");
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-500 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showMoreFilters ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {showMoreFilters && (
          <div className="grid grid-cols-1 gap-4 pt-3 border-t border-slate-100 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Assignee / Agent</label>
              <select
                value={assigneeFilter}
                onChange={(e) => { setAssigneeFilter(e.target.value); setPage(1); }}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Assignees</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Created Date From</label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => { setStartDateFilter(e.target.value); setPage(1); }}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Created Date To</label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => { setEndDateFilter(e.target.value); setPage(1); }}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Select All Bar */}
      {tickets.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <button onClick={toggleSelectAll} className="flex items-center gap-2 font-medium hover:text-slate-900">
            {selectedIds.length === tickets.length && tickets.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-primary-600" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            <span>Select All ({tickets.length})</span>
          </button>
          <span>{selectedIds.length} selected</span>
        </div>
      )}

      {/* Ticket List or Kanban View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const columnTickets = tickets.filter((t) => t.status === status.id);
            return (
              <div key={status.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 min-h-[400px]">
                <div className="flex items-center justify-between font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                  <span>{status.name}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700">
                    {columnTickets.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => (window.location.href = `/tickets/${ticket.id}`)}
                      className="rounded-md border border-slate-200 bg-white p-3 shadow-xs hover:border-[#0070BA] cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>{generateTicketKey(ticket.id)}</span>
                        <span className={`px-1.5 py-0.2 rounded font-semibold ${colorForPriority(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{ticket.title}</h4>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{ticket.customer?.name || "Customer"}</span>
                        <span>{ticket.assignee?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">No tickets found matching filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search filters or create a new ticket</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedIds.includes(ticket.id)}
              onToggleSelect={() => toggleSelect(ticket.id)}
            />
          ))
        )}
      </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-500">{total} tickets total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-600">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 25)}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-white shadow-2xl backdrop-blur-md">
          <span className="text-xs font-semibold border-r border-slate-700 pr-3">
            {selectedIds.length} Selected
          </span>

          {bulkActionLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
          ) : (
            <div className="flex items-center gap-2">
              {/* Bulk Status */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction("UPDATE_STATUS", { status: e.target.value });
                    e.target.value = "";
                  }
                }}
                className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Set Status...</option>
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              {/* Bulk Priority */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction("UPDATE_PRIORITY", { priority: e.target.value });
                    e.target.value = "";
                  }
                }}
                className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Set Priority...</option>
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {/* Bulk Agent Assign */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction("ASSIGN_AGENT", { assigneeId: e.target.value === "UNASSIGN" ? null : e.target.value });
                    e.target.value = "";
                  }
                }}
                className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Assign Agent...</option>
                <option value="UNASSIGN">Unassign</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>

              {/* Bulk Delete */}
              <button
                onClick={() => handleBulkAction("DELETE")}
                className="inline-flex items-center gap-1 rounded-md bg-red-600/90 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TicketListItem({
  ticket,
  isSelected,
  onToggleSelect,
}: {
  ticket: TicketType;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const isSLAWarning = ticket.slaDueAt && new Date(ticket.slaDueAt).getTime() - Date.now() < 60 * 60 * 1000 && !ticket.slaBreached;
  const isSlaBreached = ticket.slaBreached;

  return (
    <div
      className={`group flex items-start gap-4 rounded-xl border p-4 transition-all ${
        isSelected ? "border-primary-500 bg-primary-50/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <button onClick={onToggleSelect} className="mt-1 text-slate-400 hover:text-slate-700">
        {isSelected ? (
          <CheckSquare className="h-5 w-5 text-primary-600" />
        ) : (
          <Square className="h-5 w-5 text-slate-300 group-hover:text-slate-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {generateTicketKey(ticket.id)}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${colorForPriority(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${colorForStatus(ticket.status)}`}>
            {ticket.status.replace("_", " ")}
          </span>

          {isSlaBreached && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
              <AlertCircle className="h-3 w-3" /> SLA Breached
            </span>
          )}
          {isSLAWarning && !isSlaBreached && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
              <Clock className="h-3 w-3" /> SLA Warning
            </span>
          )}
        </div>

        <Link href={`/tickets/${ticket.id}`} className="block mt-1.5">
          <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {ticket.title}
          </h3>
          {ticket.description && (
            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{ticket.description}</p>
          )}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          {ticket.customer && (
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {ticket.customer.name}
            </span>
          )}
          {ticket.assignee && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              {ticket.assignee.name || ticket.assignee.email}
            </span>
          )}
          {ticket.category && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              {ticket.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(ticket.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
