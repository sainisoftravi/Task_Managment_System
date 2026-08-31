"use client";

import { useState } from "react";
import { Project, UserRole } from "@/types";
import { Users, Plus, Mail, Shield, UserCheck, Settings, Check, X, Lock } from "lucide-react";

interface ProjectUsersTabProps {
  project: Project;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectRole: string;
  permissions: {
    tasks: boolean;
    issues: boolean;
    documents: boolean;
    timesheets: boolean;
    forums: boolean;
  };
}

export default function ProjectUsersTab({ project }: ProjectUsersTabProps) {
  const [members, setMembers] = useState<ProjectMember[]>([
    {
      id: "u1",
      name: "Divakar Pandiy",
      email: "divakar@taskpmp.local",
      role: "MANAGER",
      projectRole: "Project Manager",
      permissions: { tasks: true, issues: true, documents: true, timesheets: true, forums: true },
    },
    {
      id: "u2",
      name: "Ravi Saini",
      email: "ravi@taskpmp.local",
      role: "DEVELOPER",
      projectRole: "Lead Engineer",
      permissions: { tasks: true, issues: true, documents: true, timesheets: true, forums: false },
    },
    {
      id: "u3",
      name: "Admin User",
      email: "admin@taskpmp.local",
      role: "ADMIN",
      projectRole: "Administrator",
      permissions: { tasks: true, issues: true, documents: true, timesheets: true, forums: true },
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<"portal" | "invite">("portal");
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");

  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);

  const handleAddMember = () => {
    if (!inviteEmail) return;
    const newMember: ProjectMember = {
      id: Date.now().toString(),
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "DEVELOPER",
      projectRole: inviteRole,
      permissions: { tasks: true, issues: true, documents: true, timesheets: true, forums: true },
    };
    setMembers([...members, newMember]);
    setShowAddModal(false);
    setInviteName("");
    setInviteEmail("");
  };

  const handleUpdateRole = (id: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, projectRole: newRole } : m))
    );
  };

  const togglePermission = (key: keyof ProjectMember["permissions"]) => {
    if (!selectedMember) return;
    const updated = {
      ...selectedMember,
      permissions: {
        ...selectedMember.permissions,
        [key]: !selectedMember.permissions[key],
      },
    };
    setSelectedMember(updated);
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Tab Header Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0070BA]" />
            <span>Project Users & Team Permissions ({members.length})</span>
          </h2>
          <p className="text-xs text-slate-500">Manage member access level and permissions for {project.name}</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Users to Project</span>
        </button>
      </div>

      {/* Team Roster Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-4">User Name & Email</th>
              <th className="py-2.5 px-4">System Role</th>
              <th className="py-2.5 px-4">Project Profile</th>
              <th className="py-2.5 px-4 text-center">Module Access</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{member.name}</h4>
                      <p className="text-[11px] text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={member.projectRole}
                    onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-800 focus:border-[#0070BA] focus:outline-none bg-white"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Lead Engineer">Lead Engineer</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Client User">Client User</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold">
                    <span className={`px-1.5 py-0.5 rounded ${member.permissions.tasks ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>Tasks</span>
                    <span className={`px-1.5 py-0.5 rounded ${member.permissions.issues ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>Issues</span>
                    <span className={`px-1.5 py-0.5 rounded ${member.permissions.documents ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>Docs</span>
                    <span className={`px-1.5 py-0.5 rounded ${member.permissions.timesheets ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>Timesheets</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0070BA] hover:underline"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Customize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Users Modal (Portal Users vs Invite User) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Add Users to {project.name}</h3>

            <div className="flex border-b border-slate-200 text-xs font-bold mt-3">
              <button
                onClick={() => setActiveAddTab("portal")}
                className={`flex-1 pb-2 border-b-2 text-center ${activeAddTab === "portal" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500"}`}
              >
                Portal Users Tab
              </button>
              <button
                onClick={() => setActiveAddTab("invite")}
                className={`flex-1 pb-2 border-b-2 text-center ${activeAddTab === "invite" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500"}`}
              >
                Invite User Tab
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activeAddTab === "portal" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Portal User</label>
                  <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none">
                    <option value="u10">Saini Soft (sainisoft@local.com)</option>
                    <option value="u11">Tech Support Lead (support@local.com)</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Divakar Pandiy"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="user@domain.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Role Profile</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
                >
                  <option value="Lead Engineer">Lead Engineer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Support Agent">Support Agent</option>
                  <option value="Client User">Client User</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-md border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize User Permissions Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Customize Permissions: {selectedMember.name}</span>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </h3>

            <div className="mt-4 space-y-3">
              {(Object.keys(selectedMember.permissions) as Array<keyof ProjectMember["permissions"]>).map((key) => (
                <div key={key} className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-700 capitalize">{key} Module</span>
                  <input
                    type="checkbox"
                    checked={selectedMember.permissions[key]}
                    onChange={() => togglePermission(key)}
                    className="h-4 w-4 text-[#0070BA] rounded focus:ring-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-md bg-[#0070BA] px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
