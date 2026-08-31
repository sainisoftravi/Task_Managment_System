"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User, UserRole } from "@/types";
import { getAuthHeaders } from "@/lib/utils";
import {
  Users as UsersIcon,
  Plus,
  Mail,
  Shield,
  Search,
  Filter,
  CheckCircle,
  X,
  Sparkles,
  ArrowUpDown,
  Trash2,
  List,
  Grid,
  ChevronDown,
  Download,
  Upload,
  UserCheck,
  Building,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Edit,
  UserMinus,
  MessageSquare,
  Phone,
  Video,
  Clock,
  Calendar,
  Layers,
  FileSpreadsheet,
  CopyPlus,
  AlertTriangle,
  Settings,
  PieChart
} from "lucide-react";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-tabs & Filter State matching Screenshots 1 & 2
  const [activeTab, setActiveTab] = useState<"PORTAL_USERS" | "CLIENT_USERS" | "CUSTOMERS" | "TEAMS" | "RESOURCES">("PORTAL_USERS");
  const [userFilter, setUserFilter] = useState("ALL_ACTIVE");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"LIST" | "GRID">("GRID");

  // Selection & Bulk Actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Card Context Menu & User Details Drawer State
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState<"OVERVIEW" | "FIELDS" | "ASSOCIATED" | "ACTIVITY" | "AUDIT">("ACTIVITY");
  const [detailProjectFilter, setDetailProjectFilter] = useState("ALL");

  // TEAMS STATE matching Screenshots 1 & 2
  const [activeTeamRowMenuId, setActiveTeamRowMenuId] = useState<string | null>(null);
  const [activeProjectPopoverTeamId, setActiveProjectPopoverTeamId] = useState<string | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any | null>(null);

  // TEAMS DETAILS DRAWER STATE matching Screenshot 2
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<any | null>(null);
  const [teamDetailTab, setTeamDetailTab] = useState<"OVERVIEW" | "FIELDS" | "ACTIVITY">("OVERVIEW");
  const [showAddMemberInput, setShowAddMemberInput] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  // Add/Edit Team Form State
  const [teamFormName, setTeamFormName] = useState("");
  const [teamFormLead, setTeamFormLead] = useState("Monica Hemsworth");
  const [teamFormAlias, setTeamFormAlias] = useState("");
  const [teamFormProjects, setTeamFormProjects] = useState<string[]>(["01 PoC Projects"]);
  const [teamFormUsers, setTeamFormUsers] = useState<string[]>(["Monica Hemsworth", "Ravi Saini"]);

  // Invite Modal Form State
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("Employee");
  const [inviteProfile, setInviteProfile] = useState("Employee");
  const [inviteRate, setInviteRate] = useState("150.00");
  const [inviteCost, setInviteCost] = useState("120.00");
  const [inviteManager, setInviteManager] = useState("None");
  const [inviteBusinessHours, setInviteBusinessHours] = useState("Standard Business Hours");
  const [inviteTemplate, setInviteTemplate] = useState("Standard Welcome Template");
  const [selectedProjects, setSelectedProjects] = useState<string[]>(["01 PoC Projects"]);

  // Initial user roster
  const initialPortalUsers = [
    { id: "u1", name: "Alicia Jones", email: "alicia.jones@taskpmp.local", role: "Administrator", profile: "Manager", manager: "None", rate: "500.00", cost: "400.00", status: "Active", color: "bg-[#7C3AED]" },
    { id: "u2", name: "Chloé", email: "chloe@taskpmp.local", role: "Employee", profile: "Read Only", manager: "None", rate: "20.00", cost: "15.00", status: "Active", color: "bg-[#059669]" },
    { id: "u3", name: "Chris Thompson", email: "chris.thompson@taskpmp.local", role: "Manager", profile: "Employee", manager: "None", rate: "150.00", cost: "120.00", status: "Active", color: "bg-[#7C3AED]" },
    { id: "u4", name: "Don McCreesh", email: "don.mccreesh@taskpmp.local", role: "Manager", profile: "Employee", manager: "None", rate: "150.00", cost: "120.00", status: "Active", color: "bg-[#0284C7]" },
    { id: "u5", name: "Eduardo Vargas", email: "eduardo.vargas@taskpmp.local", role: "Administrator", profile: "Admin", manager: "None", rate: "80.00", cost: "60.00", status: "Active", color: "bg-[#0284C7]" },
    { id: "u6", name: "Edward Covington", email: "eddy@taskpmp.local", role: "Employee", profile: "Contractor", manager: "None", rate: "0.00", cost: "0.00", status: "Active", color: "bg-[#D97706]" },
    { id: "u7", name: "Einhard Klein", email: "dieterk@taskpmp.local", role: "Manager", profile: "Read Only", manager: "None", rate: "60.00", cost: "45.00", status: "Active", color: "bg-[#0284C7]" },
    { id: "u8", name: "Estelle Roberts", email: "estelle.roberts@taskpmp.local", role: "Administrator", profile: "Manager", manager: "None", rate: "250.00", cost: "200.00", status: "Active", color: "bg-[#F59E0B]" },
    { id: "u9", name: "Geoffrey Merin", email: "geoffrey.merin@taskpmp.local", role: "Administrator", profile: "Manager", manager: "None", rate: "500.00", cost: "400.00", status: "Active", color: "bg-[#0284C7]" },
    { id: "u10", name: "Hannah Murphy", email: "hannah.murphy@taskpmp.local", role: "Manager", profile: "Employee", manager: "None", rate: "150.00", cost: "120.00", status: "Active", color: "bg-[#7C3AED]" },
    { id: "u11", name: "Helen Cross", email: "helenc@taskpmp.local", role: "Technical Dir", profile: "Admin", manager: "Monica H", rate: "55.00", cost: "40.00", status: "Active", color: "bg-[#EC4899]" },
    { id: "u12", name: "Isabella Cowper", email: "isabel.c23@taskpmp.local", role: "Employee", profile: "Contractor", manager: "None", rate: "0.00", cost: "0.00", status: "Active", color: "bg-[#059669]" },
    { id: "u13", name: "James Travis", email: "james.travis@taskpmp.local", role: "Employee", profile: "Contractor", manager: "None", rate: "0.00", cost: "0.00", status: "Active", color: "bg-[#0284C7]" },
    { id: "u14", name: "Ravi Saini", email: "admin@taskpmp.local", role: "Administrator", profile: "Admin", manager: "None", rate: "500.00", cost: "400.00", status: "Active", color: "bg-[#0070BA]" },
  ];

  const [portalUsers, setPortalUsers] = useState<any[]>(initialPortalUsers);

  // Initial Teams Dataset matching Screenshots 1 & 2
  const initialTeams = [
    {
      id: "t1",
      name: "Customer Support",
      badge: "CS",
      lead: "Monica Hemsworth",
      projects: ["Zylsoft Web App", "01 PoC Projects"],
      extraProjects: 25,
      usersCount: 2,
      membersList: ["Monica Hemsworth", "Steve Banks"],
      createdBy: "Monica Hemsworth",
      alias: "support@taskpmp.local",
      createdTime: "15-03-2023 06:20",
      updatedTime: "14-03-2025 10:20",
    },
    {
      id: "t2",
      name: "customer support team",
      badge: "CS",
      lead: "Monica Hemsworth",
      projects: ["Sites 2024"],
      extraProjects: 15,
      usersCount: 2,
      membersList: ["Monica Hemsworth", "Alicia Jones"],
      createdBy: "Monica Hemsworth",
      alias: "cs-team@taskpmp.local",
      createdTime: "16-03-2023 08:15",
      updatedTime: "10-02-2025 11:30",
    },
    {
      id: "t3",
      name: "Dam Construction",
      badge: "DC",
      lead: "Monica Hemsworth",
      projects: ["The Hoover Dam Project"],
      extraProjects: 1,
      usersCount: 4,
      membersList: ["Monica Hemsworth", "Chris Thompson", "Don McCreesh", "Eduardo Vargas"],
      createdBy: "Monica Hemsworth",
      alias: "dam@taskpmp.local",
      createdTime: "01-04-2023 09:00",
      updatedTime: "05-01-2025 14:20",
    },
    {
      id: "t4",
      name: "Design Crews",
      badge: "DC",
      lead: "Monica Hemsworth",
      projects: ["Zylker airlines mobile app"],
      extraProjects: 10,
      usersCount: 3,
      membersList: ["Monica Hemsworth", "Chloé", "Hannah Murphy"],
      createdBy: "Monica Hemsworth",
      alias: "design@taskpmp.local",
      createdTime: "12-05-2023 10:45",
      updatedTime: "18-02-2025 16:00",
    },
    {
      id: "t5",
      name: "Engineering Team",
      badge: "ET",
      lead: "Monica Hemsworth",
      projects: ["01 PoC Projects"],
      extraProjects: 1,
      usersCount: 5,
      membersList: ["Monica Hemsworth", "Ravi Saini", "Eduardo Vargas", "Einhard Klein", "Geoffrey Merin"],
      createdBy: "Monica Hemsworth",
      alias: "eng@taskpmp.local",
      createdTime: "20-05-2023 11:30",
      updatedTime: "22-02-2025 09:10",
    },
    {
      id: "t6",
      name: "Engineers - Hoover dam",
      badge: "E",
      lead: "Shirin Shekhar",
      projects: ["The Hoover Dam Project"],
      extraProjects: 0,
      usersCount: 2,
      membersList: ["Shirin Shekhar", "Edward Covington"],
      createdBy: "Shirin Shekhar",
      alias: "hoover-eng@taskpmp.local",
      createdTime: "02-06-2023 14:00",
      updatedTime: "12-01-2025 15:45",
    },
    {
      id: "t7",
      name: "Everyone",
      badge: "EV",
      lead: "Monica Hemsworth",
      projects: ["Sites 2024"],
      extraProjects: 15,
      usersCount: 31,
      membersList: ["Monica Hemsworth", "Ravi Saini", "Alicia Jones", "Chloé", "Chris Thompson"],
      createdBy: "Monica Hemsworth",
      alias: "all@taskpmp.local",
      createdTime: "10-01-2023 00:00",
      updatedTime: "01-03-2025 12:00",
    },
    {
      id: "t8",
      name: "Finance Committee",
      badge: "FC",
      lead: "Linda",
      projects: ["Zylker Inc Analyst Briefing"],
      extraProjects: 0,
      usersCount: 2,
      membersList: ["Linda", "Estelle Roberts"],
      createdBy: "Monica Hemsworth",
      alias: "finance@taskpmp.local",
      createdTime: "15-08-2023 09:20",
      updatedTime: "20-02-2025 10:10",
    },
  ];

  const [teams, setTeams] = useState<any[]>(initialTeams);

  // Available Projects list for popover tag picker
  const availableProjectsList = [
    "01 PoC Projects",
    "06 Monthly Miscellaneous Tasks",
    "07 Command Center Automation",
    "Novacure summit",
    "Zylker Constructions",
    "Novacure Summit - 2027",
    "Construction",
    "Syska - Building Maintenance & Renovation",
    "Net Promoter Score",
  ];

  // Open invite modal if ?invite=true in URL
  useEffect(() => {
    if (searchParams?.get("invite") === "true") {
      setShowInviteModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users", { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        const apiUsersMapped = data.users.map((u: any, idx: number) => ({
          id: u.id,
          name: u.name || u.email.split("@")[0],
          email: u.email,
          role: u.role === "ADMIN" ? "Administrator" : u.role === "MANAGER" ? "Manager" : "Employee",
          profile: u.role === "ADMIN" ? "Admin" : "Employee",
          manager: "None",
          rate: "150.00",
          cost: "120.00",
          status: "Active",
          color: idx % 2 === 0 ? "bg-[#7C3AED]" : "bg-[#0284C7]",
        }));

        const existingEmails = new Set(apiUsersMapped.map((u: any) => u.email));
        const missingInitial = initialPortalUsers.filter((u) => !existingEmails.has(u.email));
        setPortalUsers([...apiUsersMapped, ...missingInitial]);
      }
    }
    setLoading(false);
  }

  // Team Create / Edit / Clone Handler
  const handleSaveTeam = () => {
    if (!teamFormName.trim()) return;

    if (editingTeam) {
      setTeams(
        teams.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                name: teamFormName.trim(),
                lead: teamFormLead,
                alias: teamFormAlias,
                projects: teamFormProjects,
                usersCount: teamFormUsers.length,
                membersList: teamFormUsers,
              }
            : t
        )
      );
    } else {
      const badge = teamFormName.slice(0, 2).toUpperCase();
      const newTeam = {
        id: `t-${Date.now()}`,
        name: teamFormName.trim(),
        badge,
        lead: teamFormLead,
        projects: teamFormProjects,
        extraProjects: 0,
        usersCount: teamFormUsers.length,
        membersList: teamFormUsers,
        createdBy: "Monica Hemsworth",
        alias: teamFormAlias || `${teamFormName.toLowerCase().replace(/\s+/g, "-")}@taskpmp.local`,
        createdTime: new Date().toLocaleDateString(),
        updatedTime: new Date().toLocaleDateString(),
      };
      setTeams([newTeam, ...teams]);
    }

    setShowAddTeamModal(false);
    setEditingTeam(null);
    setTeamFormName("");
    setTeamFormAlias("");
  };

  const handleCloneTeam = (team: any) => {
    const clonedName = `${team.name} (Copy)`;
    const newTeam = {
      ...team,
      id: `t-${Date.now()}`,
      name: clonedName,
      alias: `copy-${team.alias}`,
    };
    setTeams([newTeam, ...teams]);
    alert(`Cloned team '${team.name}' successfully as '${clonedName}'.`);
  };

  // Add Member to Team in Details Drawer
  const handleAddMemberToTeam = (teamId: string, memberName: string) => {
    if (!memberName.trim()) return;
    setTeams(
      teams.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = Array.from(new Set([...(t.membersList || []), memberName.trim()]));
          const updated = { ...t, membersList: updatedMembers, usersCount: updatedMembers.length };
          if (selectedTeamDetail?.id === teamId) setSelectedTeamDetail(updated);
          return updated;
        }
        return t;
      })
    );
    setNewMemberName("");
    setShowAddMemberInput(false);
  };

  // Remove Member from Team in Details Drawer
  const handleRemoveMemberFromTeam = (teamId: string, memberName: string) => {
    setTeams(
      teams.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = (t.membersList || []).filter((m: string) => m !== memberName);
          const updated = { ...t, membersList: updatedMembers, usersCount: updatedMembers.length };
          if (selectedTeamDetail?.id === teamId) setSelectedTeamDetail(updated);
          return updated;
        }
        return t;
      })
    );
  };

  // Filter Users & Teams
  const filteredUsers = portalUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    if (userFilter === "ALL_ACTIVE") return matchesSearch && u.status === "Active";
    if (userFilter === "READ_ONLY") return matchesSearch && u.profile === "Read Only";
    if (userFilter === "DEACTIVATED") return matchesSearch && u.status === "Deactivated";
    return matchesSearch;
  });

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.lead.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans bg-slate-50 min-h-screen -m-6 p-6">
      {/* Top Header Navigation Sub-Tabs matching Screenshots 1 & 2 */}
      <div className="border-b border-slate-200 bg-white -mx-6 -mt-6 px-6 pt-4 pb-0 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 mb-3">Users</h1>

        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("PORTAL_USERS")}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "PORTAL_USERS" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Portal Users
          </button>
          <button
            onClick={() => setActiveTab("CLIENT_USERS")}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "CLIENT_USERS" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Client Users
          </button>
          <button
            onClick={() => setActiveTab("CUSTOMERS")}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "CUSTOMERS" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("TEAMS")}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "TEAMS" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab("RESOURCES")}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "RESOURCES" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Resources
          </button>
        </div>
      </div>

      {/* Action Toolbar Bar matching Screenshots 1 & 2 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {activeTab === "PORTAL_USERS" && (
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold text-[#0070BA] bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL_ACTIVE">All Active Users ▾</option>
              <option value="ALL">All Users</option>
              <option value="READ_ONLY">Read-only Users</option>
              <option value="DIRECT_REPORTS">Active Direct Reports</option>
              <option value="DEACTIVATED">Deactivated Users</option>
            </select>
          )}

          {activeTab === "TEAMS" && (
            <span className="font-bold text-slate-900 text-sm">Teams</span>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "TEAMS" ? "Search teams..." : "Search by name or email..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-64 rounded border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-300 rounded bg-white text-xs font-bold">
            <button
              onClick={() => setViewMode("LIST")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-l ${
                viewMode === "LIST" ? "bg-slate-100 text-[#0070BA]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("GRID")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-r ${
                viewMode === "GRID" ? "bg-slate-100 text-[#0070BA]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>

          {activeTab === "TEAMS" ? (
            <button
              onClick={() => {
                setEditingTeam(null);
                setTeamFormName("");
                setTeamFormAlias("");
                setShowAddTeamModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Team</span>
            </button>
          ) : (
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Invite Users</span>
            </button>
          )}
        </div>
      </div>

      {/* TEAMS LIST VIEW */}
      {activeTab === "TEAMS" && viewMode === "LIST" && (
        <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3 w-8 text-center">...</th>
                  <th className="py-3 px-4">Team Name</th>
                  <th className="py-3 px-4">Team Lead</th>
                  <th className="py-3 px-4">Associated Projects</th>
                  <th className="py-3 px-4">Team Users</th>
                  <th className="py-3 px-4">Created By</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTeams.map((team) => {
                  const isRowMenuOpen = activeTeamRowMenuId === team.id;

                  return (
                    <tr key={team.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-2 text-center relative">
                        <button
                          onClick={() => setActiveTeamRowMenuId(isRowMenuOpen ? null : team.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {isRowMenuOpen && (
                          <div className="absolute left-6 top-2 z-50 w-48 rounded-md bg-white p-1 shadow-xl border border-slate-200 text-xs font-semibold text-slate-700 text-left animate-fadeIn">
                            <button
                              onClick={() => {
                                setActiveTeamRowMenuId(null);
                                setSelectedTeamDetail(team);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] flex items-center gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTeamRowMenuId(null);
                                window.open(`/users?team=${team.id}`, "_blank");
                              }}
                              className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] flex items-center gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>View Details in New Tab</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTeamRowMenuId(null);
                                handleCloneTeam(team);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 hover:text-[#0070BA] flex items-center gap-2 cursor-pointer text-blue-600"
                            >
                              <CopyPlus className="h-3.5 w-3.5" />
                              <span>Clone</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTeamRowMenuId(null);
                                if (confirm(`Delete team ${team.name}?`)) {
                                  setTeams(teams.filter((t) => t.id !== team.id));
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 rounded hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>

                      <td
                        onClick={() => setSelectedTeamDetail(team)}
                        className="py-3 px-4 font-bold text-slate-900 hover:text-[#0070BA] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {team.badge}
                          </div>
                          <span>{team.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">{team.lead}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{team.projects[0] || "01 PoC Projects"}</td>
                      <td className="py-3 px-4 font-bold text-[#0070BA]">👥 {team.usersCount} members</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{team.createdBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAMS DETAILS DRAWER / MODAL matching Screenshot 2 */}
      {selectedTeamDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex overflow-hidden animate-fadeIn">
            {/* Left Team Information Sidebar matching Screenshot 2 */}
            <div className="w-72 bg-blue-50/40 border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto font-sans text-xs">
              <div className="space-y-5 text-center">
                {/* Team Badge */}
                <div className="flex justify-center">
                  <span className="px-3 py-0.5 rounded-full bg-blue-100 text-[#0070BA] font-bold text-[10px]">
                    👥 Team
                  </span>
                </div>

                {/* Large Badge Avatar */}
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-amber-200 to-orange-100 text-amber-900 font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md">
                    {selectedTeamDetail.badge}
                  </div>
                </div>

                {/* Team Name & Email Alias */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTeamDetail.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedTeamDetail.alias}</p>
                </div>

                {/* Quick Action Icons */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button className="p-2 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs hover:bg-slate-50" title="Alerts">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </button>
                  <button className="p-2 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs hover:bg-slate-50" title="Chat">
                    <MessageSquare className="h-4 w-4 text-[#0070BA]" />
                  </button>
                </div>

                {/* Team Information */}
                <div className="text-left pt-4 border-t border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Team Information</span>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Email Alias:</span>
                      <strong className="text-slate-800 font-mono text-[11px] truncate max-w-[130px]">{selectedTeamDetail.alias}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Team Lead:</span>
                      <strong className="text-slate-800">{selectedTeamDetail.lead}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Total Team Users:</span>
                      <strong className="text-slate-900 font-bold">{selectedTeamDetail.usersCount}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Associated Projects:</span>
                      <strong className="text-slate-900 font-bold">{selectedTeamDetail.projects?.length || 26}</strong>
                    </p>
                  </div>
                </div>

                {/* Timeline Information */}
                <div className="text-left pt-4 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-500">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Timeline Information</span>
                  <p>Created Time: <strong className="text-slate-700 font-mono block">{selectedTeamDetail.createdTime || "15-03-2023 06:20"}</strong></p>
                  <p>Created By: <strong className="text-slate-700 font-mono block">{selectedTeamDetail.createdBy || "Monica Hemsworth"}</strong></p>
                  <p>Last Updated Time: <strong className="text-slate-700 font-mono block">{selectedTeamDetail.updatedTime || "14-03-2025 10:20"}</strong></p>
                </div>
              </div>
            </div>

            {/* Right Main Drawer Content Area matching Screenshot 2 */}
            <div className="flex-1 flex flex-col bg-slate-50">
              {/* Header Tabs */}
              <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-white">
                <div className="flex gap-6 text-xs font-bold">
                  <button
                    onClick={() => setTeamDetailTab("OVERVIEW")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      teamDetailTab === "OVERVIEW" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setTeamDetailTab("FIELDS")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      teamDetailTab === "FIELDS" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Fields
                  </button>
                  <button
                    onClick={() => setTeamDetailTab("ACTIVITY")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      teamDetailTab === "ACTIVITY" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Activity Stream
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleCloneTeam(selectedTeamDetail);
                    }}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                    title="Clone Team"
                  >
                    <CopyPlus className="h-4 w-4" />
                  </button>
                  <button onClick={() => setSelectedTeamDetail(null)} className="p-1 text-slate-400 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* OVERVIEW TAB CONTENT matching Screenshot 2 Grid Cards */}
              {teamDetailTab === "OVERVIEW" && (
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tasks Donut Widget matching Screenshot 2 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">Tasks</h4>
                      <PieChart className="h-4 w-4 text-[#0070BA]" />
                    </div>

                    <div className="flex items-center justify-around">
                      {/* SVG Donut Ring */}
                      <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-amber-400"
                            strokeDasharray="60, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold text-slate-900 font-mono">40</span>
                      </div>

                      {/* Legend */}
                      <div className="space-y-1 text-[11px] font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Open</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" /> Content Review</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-700" /> HR interview</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Prototype Testing</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Closed</div>
                      </div>
                    </div>
                  </div>

                  {/* Issues Donut Widget matching Screenshot 2 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">Issues</h4>
                      <PieChart className="h-4 w-4 text-[#0070BA]" />
                    </div>

                    <div className="flex items-center justify-around">
                      <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-amber-400"
                            strokeDasharray="75, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold text-slate-900 font-mono">9</span>
                      </div>

                      <div className="space-y-1 text-[11px] font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> To be tested</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Closed</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" /> Testing</div>
                      </div>
                    </div>
                  </div>

                  {/* Phases Donut Widget matching Screenshot 2 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">Phases</h4>
                      <PieChart className="h-4 w-4 text-[#0070BA]" />
                    </div>

                    <div className="flex items-center justify-around">
                      <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-amber-400"
                            strokeDasharray="80, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold text-slate-900 font-mono">151</span>
                      </div>

                      <div className="space-y-1 text-[11px] font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Closed</div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" /> Open</div>
                      </div>
                    </div>
                  </div>

                  {/* Team Users Widget matching Screenshot 2 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Team Users ({(selectedTeamDetail.membersList || ["Monica Hemsworth", "Steve Banks"]).length})
                      </h4>
                      <button
                        onClick={() => setShowAddMemberInput(!showAddMemberInput)}
                        className="p-1 rounded bg-blue-50 text-[#0070BA] hover:bg-blue-100 cursor-pointer"
                        title="Add User to Team"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {showAddMemberInput && (
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="User Name (e.g. Steve Banks)"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="flex-1 rounded border border-slate-300 p-1.5 text-xs focus:border-[#0070BA] focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddMemberToTeam(selectedTeamDetail.id, newMemberName)}
                          className="rounded bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {(selectedTeamDetail.membersList || ["Monica Hemsworth", "Steve Banks"]).map((m: string) => (
                        <div
                          key={m}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs"
                        >
                          <div className="h-5 w-5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                            {m.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{m}</span>
                          <button
                            onClick={() => handleRemoveMemberFromTeam(selectedTeamDetail.id, m)}
                            className="text-slate-400 hover:text-red-500 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
