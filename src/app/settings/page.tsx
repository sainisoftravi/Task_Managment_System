"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Check,
  X as CrossIcon,
  Globe,
  Sun,
  Moon,
  Monitor,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  MessageSquare,
  Bell,
  Mail,
  Clock,
  Sliders,
  Settings as SettingsIcon,
  Shield,
  User,
  Building,
  Calendar,
  Lock,
  Layers,
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react";

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "PERSONAL_SETTINGS" | "PERSONAL_EMAIL" | "ACTIVITY_REMINDER" | "PORTAL_CONFIGURATION" | "PROFILES" | "ROLES"
  >("PERSONAL_SETTINGS");

  const [sidebarSearch, setSidebarSearch] = useState("");

  // Screenshot 1: Personal Settings State
  const [personalTab, setPersonalTab] = useState<"PERSONAL" | "ACCESSIBILITY">("PERSONAL");
  const [themeColor, setThemeColor] = useState("blue");
  const [panelStyle, setPanelStyle] = useState("dark");
  const [displayMode, setDisplayMode] = useState<"Day" | "Night" | "Auto">("Auto");
  const [landingPage, setLandingPage] = useState("Home");
  const [userName, setUserName] = useState("Ravi Saini");

  // Screenshot 2: Personal Email Notifications State
  const [taskNotifs, setTaskNotifs] = useState({
    assignedCreated: false,
    assignedToMe: true,
    updatedCreated: false,
    updatedToMe: false,
    completedCreated: true,
    completedToMe: true,
    commentedCreated: false,
    commentedToMe: false,
    predecessorCreated: true,
    predecessorToMe: true,
    followedCreated: false,
    followedToMe: false,
  });

  const [otherNotifs, setOtherNotifs] = useState({
    timeLogsRejected: true,
    addedToProject: false,
  });

  const [forumNotifs, setForumNotifs] = useState({
    allForums: false,
    announcements: true,
    comments: true,
  });

  const [emailFrequency, setEmailFrequency] = useState("Immediate");

  // Screenshot 3: Activity Reminder State
  const [digestFreq, setDigestFreq] = useState("Daily");
  const [digestHour, setDigestHour] = useState("07");
  const [digestMinute, setDigestMinute] = useState("10");
  const [digestAmpm, setDigestAmpm] = useState("pm");
  const [subscribedToast, setSubscribedToast] = useState(false);

  // Screenshot 4 & 5: Portal Configuration State
  const [configTab, setConfigTab] = useState<"PORTAL" | "USER">("PORTAL");
  const [companyName, setCompanyName] = useState("Digital Twin Solutions");
  const [nameFormat, setNameFormat] = useState("First Name + Last Name");
  const [savedToast, setSavedToast] = useState(false);

  // Profiles State
  const [profileTab, setProfileTab] = useState<"USER" | "CLIENT" | "SYSTEM">("USER");
  const [activeModuleFilter, setActiveModuleFilter] = useState("TASK");

  const themeColors = [
    { id: "orange", bg: "bg-orange-500" },
    { id: "cyan", bg: "bg-sky-500" },
    { id: "teal", bg: "bg-teal-500" },
    { id: "red", bg: "bg-rose-500" },
    { id: "green", bg: "bg-emerald-500" },
    { id: "blue", bg: "bg-[#0070BA]" },
  ];

  const categories = [
    {
      group: "PERSONAL PREFERENCES",
      items: [
        { id: "PERSONAL_SETTINGS", label: "Personal Settings" },
      ],
    },
    {
      group: "Notifications",
      items: [
        { id: "PERSONAL_EMAIL", label: "Personal Email" },
        { id: "ACTIVITY_REMINDER", label: "Activity Reminder" },
      ],
    },
    {
      group: "PORTAL CONFIGURATION",
      items: [
        { id: "PORTAL_CONFIGURATION", label: "Configuration" },
        { id: "BUSINESS_CALENDAR", label: "Business Calendar" },
        { id: "PROJECT_SETTINGS", label: "Project Settings" },
        { id: "TASK_SETTINGS", label: "Task Settings" },
      ],
    },
    {
      group: "PROJECT CONFIGURATION",
      items: [{ id: "PROJ_CONFIG", label: "Project Fields" }],
    },
    {
      group: "CUSTOMIZATION",
      items: [{ id: "CUSTOMIZATION", label: "Custom Views & Templates" }],
    },
    {
      group: "AUTOMATION",
      items: [{ id: "AUTOMATION", label: "Workflow Rules" }],
    },
    {
      group: "ISSUE TRACKER",
      items: [{ id: "ISSUE_TRACKER", label: "Issue Layouts" }],
    },
    {
      group: "MARKETPLACE",
      items: [{ id: "MARKETPLACE", label: "Integrations & Webhooks" }],
    },
    {
      group: "DEVELOPER SPACE",
      items: [{ id: "DEV_SPACE", label: "REST APIs & Tokens" }],
    },
    {
      group: "DATA ADMINISTRATION",
      items: [{ id: "DATA_ADMIN", label: "Import / Export Data" }],
    },
    {
      group: "SANDBOX",
      items: [{ id: "SANDBOX", label: "Developer Sandbox" }],
    },
    {
      group: "PROFILES AND ROLES",
      items: [
        { id: "PROFILES", label: "Profiles" },
        { id: "ROLES", label: "Roles" },
      ],
    },
  ];

  // User Profiles Columns
  const userRolesList = [
    { name: "Developer", tag: "(Default)" },
    { name: "Admin", tag: "⊗" },
    { name: "Manager" },
    { name: "Contractor" },
    { name: "Team Lead" },
    { name: "QA" },
    { name: "Employee" },
  ];

  // System Profiles Columns matching latest user screenshots
  const systemRolesList = [
    { name: "Read Only", tag: "⊗" },
    { name: "Viewer", tag: "⊗" },
  ];

  // Client Profiles Columns
  const clientRolesList = [
    { name: "Client User", tag: "⊗" },
  ];

  const userPermissionsMatrix = [
    {
      section: "Task",
      rows: [
        { action: "View", values: ["None", "All", "All", "None", "All", "All", "Related"] },
        { action: "Add", values: [false, true, true, false, false, false, false] },
        { action: "Edit", values: ["None", "All", "All", "None", "All", "Owned", "Owned"] },
        { action: "Trash", values: ["None", "All", "All", "None", "None", "None", "None"] },
        { action: "Reorder", values: [false, true, true, false, false, false, false] },
        { action: "Add Followers", values: [false, true, true, false, false, false, false] },
        { action: "Preview Blueprint", values: [false, true, true, false, false, false, false] },
        { action: "Associate Blueprint", values: [false, true, true, false, false, false, false] },
      ],
    },
    {
      section: "Task List",
      rows: [
        { action: "View", values: [false, true, true, false, true, true, true] },
        { action: "Add", values: [false, true, true, false, false, false, false] },
        { action: "Edit", values: [false, true, true, false, false, false, false] },
        { action: "Trash", values: [false, true, true, false, false, false, false] },
        { action: "Reorder", values: [false, true, true, false, true, false, false] },
      ],
    },
    {
      section: "Phase",
      rows: [
        { action: "View", values: [true, true, true, true, true, true, true] },
        { action: "Add", values: [false, true, true, true, false, false, false] },
        { action: "Edit", values: ["None", "All", "All", "Owned", "None", "None", "None"] },
        { action: "Trash", values: ["None", "All", "All", "Owned", "None", "None", "None"] },
      ],
    },
    {
      section: "Issue",
      rows: [
        { action: "View", values: ["Related", "All", "All", "All", "All", "All", "None"] },
        { action: "Add", values: [false, true, true, true, true, true, false] },
        { action: "Edit", values: ["None", "All", "All", "Owned", "Both", "Owned", "None"] },
        { action: "Trash", values: ["None", "All", "All", "None", "None", "None", "None"] },
        { action: "Add Followers", values: [true, true, true, true, true, true, false] },
      ],
    },
    {
      section: "Time Logs",
      rows: [
        { action: "View", values: ["None", "All", "All", "Owned", "All", "Owned", "Owned"] },
        { action: "Add", values: ["None", "All", "All", "Owned", "Owned", "Owned", "Owned"] },
        { action: "Edit", values: ["None", "All", "All", "Owned", "Owned", "Owned", "Owned"] },
        { action: "Trash", values: ["None", "All", "All", "None", "None", "None", "None"] },
        { action: "Approve", values: [false, true, true, false, true, false, false] },
      ],
    },
    {
      section: "Timesheet",
      rows: [
        { action: "View", values: ["None", "All", "All", "Owned", "Owned", "Owned", "Owned"] },
        { action: "Add", values: [false, true, true, true, true, true, false] },
        { action: "Edit", values: [false, true, true, true, true, true, false] },
        { action: "Delete", values: ["None", "All", "All", "Owned", "Owned", "Owned", "None"] },
        { action: "Approve", values: [false, true, true, false, false, false, false] },
      ],
    },
    {
      section: "Feed Status",
      rows: [
        { action: "Add", values: [true, true, true, true, true, true, true] },
        { action: "Edit", values: ["None", "Owned", "Owned", "None", "None", "None", "Owned"] },
        { action: "Delete", values: ["None", "All", "None", "None", "None", "None", "Owned"] },
      ],
    },
  ];

  const systemPermissionsMatrix = [
    {
      section: "Task",
      rows: [
        { action: "View", values: ["All", "All"] },
        { action: "Add", values: [false, false] },
        { action: "Edit", values: ["None", "None"] },
        { action: "Trash", values: ["None", "None"] },
        { action: "Reorder", values: [false, false] },
        { action: "Add Followers", values: [false, false] },
        { action: "Preview Blueprint", values: [false, false] },
        { action: "Associate Blueprint", values: [false, false] },
      ],
    },
    {
      section: "Task List",
      rows: [
        { action: "View", values: [false, true] },
        { action: "Add", values: [false, false] },
        { action: "Edit", values: [false, false] },
        { action: "Trash", values: [false, false] },
        { action: "Reorder", values: [false, false] },
      ],
    },
    {
      section: "Phase",
      rows: [
        { action: "View", values: [false, true] },
        { action: "Add", values: [false, false] },
        { action: "Edit", values: ["None", "None"] },
        { action: "Trash", values: ["None", "None"] },
      ],
    },
    {
      section: "Issue",
      rows: [
        { action: "View", values: ["All", "All"] },
        { action: "Add", values: [false, false] },
        { action: "Edit", values: ["None", "None"] },
        { action: "Trash", values: ["None", "None"] },
        { action: "Add Followers", values: [false, false] },
      ],
    },
    {
      section: "Time Logs",
      rows: [
        { action: "View", values: ["Owned", "None"] },
        { action: "Add", values: ["None", "None"] },
        { action: "Edit", values: ["None", "None"] },
        { action: "Trash", values: ["None", "None"] },
      ],
    },
    {
      section: "Timesheet",
      rows: [
        { action: "View", values: ["Owned", "None"] },
        { action: "Add", values: [false, false] },
        { action: "Edit", values: [false, false] },
        { action: "Delete", values: ["None", "None"] },
        { action: "Approve", values: [false, false] },
      ],
    },
    {
      section: "Feed Status",
      rows: [
        { action: "Add", values: [false, false] },
        { action: "Edit", values: ["None", "None"] },
        { action: "Delete", values: ["None", "None"] },
      ],
    },
  ];

  const clientPermissionsMatrix = [
    {
      section: "Task",
      rows: [
        { action: "View", values: ["Related"] },
        { action: "Add", values: [false] },
        { action: "Edit", values: ["None"] },
        { action: "Trash", values: ["None"] },
      ],
    },
    {
      section: "Task List",
      rows: [
        { action: "View", values: [true] },
        { action: "Add", values: [false] },
        { action: "Edit", values: [false] },
      ],
    },
    {
      section: "Phase",
      rows: [
        { action: "View", values: [true] },
        { action: "Add", values: [false] },
      ],
    },
    {
      section: "Issue",
      rows: [
        { action: "View", values: ["Related"] },
        { action: "Add", values: [true] },
        { action: "Edit", values: ["Owned"] },
        { action: "Trash", values: ["None"] },
      ],
    },
  ];

  const activeRolesList =
    profileTab === "SYSTEM"
      ? systemRolesList
      : profileTab === "CLIENT"
      ? clientRolesList
      : userRolesList;

  const activeMatrix =
    profileTab === "SYSTEM"
      ? systemPermissionsMatrix
      : profileTab === "CLIENT"
      ? clientPermissionsMatrix
      : userPermissionsMatrix;

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-50 font-sans -m-6 overflow-hidden">
      {/* Setup Left Sidebar matching Screenshots */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        {/* Header with Arrow Back */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="h-7 w-7 rounded-full bg-[#0070BA] text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-2xs"
            title="Return to App"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-base font-bold text-slate-900">Setup</h2>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search here"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-sans">
          {categories.map((cat) => {
            const filteredItems = cat.items.filter((i) =>
              i.label.toLowerCase().includes(sidebarSearch.toLowerCase())
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={cat.group} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                  {cat.group}
                </span>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const isActive = activeCategory === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (
                            item.id === "PERSONAL_SETTINGS" ||
                            item.id === "PERSONAL_EMAIL" ||
                            item.id === "ACTIVITY_REMINDER" ||
                            item.id === "PORTAL_CONFIGURATION" ||
                            item.id === "PROFILES" ||
                            item.id === "ROLES"
                          ) {
                            setActiveCategory(item.id as any);
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded transition-colors font-medium cursor-pointer ${
                          isActive
                            ? "text-[#0070BA] font-bold bg-blue-50/70"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* SCREEN 1: PERSONAL SETTINGS */}
          {activeCategory === "PERSONAL_SETTINGS" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex gap-6 border-b border-slate-200 pb-2 text-xs font-bold">
                <button
                  onClick={() => setPersonalTab("PERSONAL")}
                  className={`pb-2 transition-colors border-b-2 cursor-pointer ${
                    personalTab === "PERSONAL" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  User Personal
                </button>
                <button
                  onClick={() => setPersonalTab("ACCESSIBILITY")}
                  className={`pb-2 transition-colors border-b-2 cursor-pointer ${
                    personalTab === "ACCESSIBILITY" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Accessibility
                </button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-16 w-16 rounded-full bg-rose-200 text-rose-800 font-bold text-xl flex items-center justify-center shadow-xs">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{userName}</span>
                    <button
                      onClick={() => {
                        const val = prompt("Edit Display Name:", userName);
                        if (val) setUserName(val);
                      }}
                      className="text-slate-400 hover:text-[#0070BA] text-xs"
                      title="Edit Name"
                    >
                      ✏️
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>📱 -</span>
                    <span>🏠 -</span>
                    <span>☎️ -</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Globe className="h-3.5 w-3.5 text-[#0070BA]" />
                      English
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-6 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Themes</h4>
                  <p className="text-slate-500 mb-3">Pick a theme and pattern for this background.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-700 w-16">Color</span>
                      <div className="flex items-center gap-3">
                        {themeColors.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setThemeColor(c.id)}
                            className={`h-7 w-7 rounded-full ${c.bg} flex items-center justify-center transition-transform cursor-pointer ${
                              themeColor === c.id ? "ring-2 ring-offset-2 ring-[#0070BA] scale-110" : ""
                            }`}
                          >
                            {themeColor === c.id && <Check className="h-4 w-4 text-white font-bold" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h4 className="font-bold text-slate-900 mb-3">Mode</h4>
                  <div className="flex items-center gap-3">
                    {[
                      { id: "Day", label: "Day", icon: Sun },
                      { id: "Night", label: "Night", icon: Moon },
                      { id: "Auto", label: "Auto", icon: Monitor },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = displayMode === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setDisplayMode(m.id as any)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border w-24 cursor-pointer transition-all ${
                            isSelected ? "border-[#0070BA] bg-blue-50/70 text-[#0070BA] font-bold shadow-2xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: PERSONAL EMAIL NOTIFICATIONS */}
          {activeCategory === "PERSONAL_EMAIL" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Task Notifications</h4>
                  
                  <div className="grid grid-cols-3 font-semibold text-slate-400 text-[10px] uppercase pb-1 border-b border-slate-100">
                    <span>Notify Me For The Tasks</span>
                    <span className="text-center">I Created</span>
                    <span className="text-center">I Am Assigned To</span>
                  </div>

                  {[
                    { key: "Assigned", cKey: "assignedCreated", aKey: "assignedToMe" },
                    { key: "Updated", cKey: "updatedCreated", aKey: "updatedToMe" },
                    { key: "Completed/ Reopened", cKey: "completedCreated", aKey: "completedToMe" },
                  ].map((row) => (
                    <div key={row.key} className="grid grid-cols-3 items-center py-1.5 border-b border-slate-50 font-medium text-slate-700">
                      <span>{row.key}</span>
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={(taskNotifs as any)[row.cKey]}
                          onChange={(e) => setTaskNotifs({ ...taskNotifs, [row.cKey]: e.target.checked })}
                          className="rounded text-[#0070BA] focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={(taskNotifs as any)[row.aKey]}
                          onChange={(e) => setTaskNotifs({ ...taskNotifs, [row.aKey]: e.target.checked })}
                          className="rounded text-[#0070BA] focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: ACTIVITY REMINDER */}
          {activeCategory === "ACTIVITY_REMINDER" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs font-sans">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Daily Digest Settings</h3>
              <p className="text-slate-700 font-medium">
                Email me the list of pending Tasks, Issues, and phases assigned to me across all the projects :
              </p>
            </div>
          )}

          {/* SCREEN 4: PORTAL CONFIGURATION */}
          {activeCategory === "PORTAL_CONFIGURATION" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs font-sans">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Portal Configuration</h3>
              <p className="text-slate-700 font-medium">Digital Twin Solutions custom portal domain setup.</p>
            </div>
          )}

          {/* PROFILES MATRIX VIEW (User Profiles | Client Profiles | System Profiles) */}
          {activeCategory === "PROFILES" && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden font-sans text-xs">
              {/* Top Sub-Tabs Bar matching Screenshots */}
              <div className="flex items-center justify-between px-6 pt-4 pb-0 border-b border-slate-200 bg-white">
                <div className="flex gap-6 text-xs font-bold">
                  <button
                    onClick={() => setProfileTab("USER")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      profileTab === "USER" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    User Profiles
                  </button>
                  <button
                    onClick={() => setProfileTab("CLIENT")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      profileTab === "CLIENT" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Client Profiles
                  </button>
                  <button
                    onClick={() => setProfileTab("SYSTEM")}
                    className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                      profileTab === "SYSTEM" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    System Profiles
                  </button>
                </div>
              </div>

              {/* Grid Body: Left Filter Column + Right Matrix Table */}
              <div className="flex">
                {/* Left Column: Default Modules Filter */}
                <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 space-y-3 flex-shrink-0 text-xs font-sans">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <span>Default Modules</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="space-y-1 pl-2">
                      {["TASK", "TASK LIST", "PHASE", "ISSUE", "TIME LOGS", "TIMESHEET", "FEED STATUS"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setActiveModuleFilter(m)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer block ${
                            activeModuleFilter === m
                              ? "bg-blue-100/70 text-[#0070BA] font-bold"
                              : "text-slate-600 hover:bg-slate-200/60"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-600 font-semibold pt-2 border-t border-slate-200">
                    {["Others", "Dashboards", "Settings", "Field Permissions"].map((cat) => (
                      <div key={cat} className="flex items-center justify-between px-2 py-1 hover:bg-slate-200/50 rounded cursor-pointer">
                        <span>{cat}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Matrix Table matching System Profiles Screenshots 1-4 */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold text-[11px]">
                        <th className="py-3 px-4 w-44">Action Permissions</th>
                        {activeRolesList.map((r) => (
                          <th key={r.name} className="py-3 px-3 text-center w-32">
                            <div className="flex items-center justify-center gap-1">
                              <span>{r.name}</span>
                              {r.tag && <span className="text-[10px] text-slate-400 font-normal">{r.tag}</span>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeMatrix.map((sec) => (
                        <>
                          <tr key={sec.section} className="bg-slate-100/70 font-bold text-slate-800 text-xs">
                            <td colSpan={activeRolesList.length + 1} className="py-2 px-4">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                                <span>{sec.section}</span>
                              </div>
                            </td>
                          </tr>

                          {sec.rows.map((row) => (
                            <tr key={row.action} className="hover:bg-blue-50/20 text-slate-700 border-b border-slate-100">
                              <td className="py-2.5 px-4 font-medium">{row.action}</td>

                              {row.values.map((val, i) => (
                                <td key={i} className="py-2.5 px-3 text-center">
                                  {typeof val === "boolean" ? (
                                    val ? (
                                      <Check className="h-4 w-4 text-emerald-600 mx-auto font-bold" />
                                    ) : (
                                      <CrossIcon className="h-3.5 w-3.5 text-rose-500 mx-auto font-bold" />
                                    )
                                  ) : (
                                    <span className={`text-[11px] font-semibold ${val === "None" ? "text-slate-400" : "text-slate-800"}`}>
                                      {val}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ROLES HIERARCHY */}
          {activeCategory === "ROLES" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Roles Hierarchy</h3>
                  <p className="text-xs text-slate-500">Define user roles and organizational hierarchy permissions</p>
                </div>
                <button
                  onClick={() => alert("Creating new custom role...")}
                  className="rounded-md bg-[#0070BA] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  + Add Role
                </button>
              </div>

              <div className="space-y-4 pl-4 border-l-2 border-[#0070BA] font-semibold text-slate-800">
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 font-bold text-blue-900">
                  👑 Executive / Administrator (Full Access)
                </div>
                <div className="pl-6 space-y-3">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    👔 Project Manager (Project & Team Management)
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700">
                      ⚡ Team Lead (Task Allocation & Approval)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
