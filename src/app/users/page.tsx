"use client";

import { useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { Users, Plus, Mail, Shield, UserCheck, Search, Filter, CheckCircle } from "lucide-react";
import { getAuthHeaders } from "@/lib/utils";

const ROLES: { id: UserRole | "ALL"; name: string }[] = [
  { id: "ALL", name: "All Roles" },
  { id: "ADMIN", name: "Administrator" },
  { id: "MANAGER", name: "Project Manager" },
  { id: "AGENT", name: "Support Agent" },
  { id: "DEVELOPER", name: "Dev Engineer" },
  { id: "CUSTOMER", name: "Customer Portal User" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("AGENT");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users", { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
    setLoading(false);
  }

  async function handleAddUser() {
    if (!email) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ email, name, role }),
    });

    if (res.ok) {
      await fetchUsers();
      setShowInviteModal(false);
      setEmail("");
      setName("");
    }
  }

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Header Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 -m-6 mb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Users & Team Members</h1>
          <p className="text-xs text-slate-500">Manage portal access, roles, and project team assignments.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none bg-white shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-[#0070BA]"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg border border-slate-200 bg-white p-4 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No user accounts found matching filter</p>
          </div>
        ) : (
          filtered.map((user) => {
            const initials = (user.name || user.email).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div
                key={user.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-[#0070BA]/50 transition-all flex items-start gap-3.5"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{user.name || "User"}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "MANAGER"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "DEVELOPER"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {user.email}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] border-t border-slate-100 pt-2 text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle className="h-3 w-3" /> Active User
                    </span>
                    <span>Team Assigned</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Invite New User</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Divakar Pandiy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@taskpmp.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Permission</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="AGENT">Support Agent</option>
                  <option value="DEVELOPER">Dev Engineer</option>
                  <option value="MANAGER">Project Manager</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="CUSTOMER">Customer Portal User</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!email}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
