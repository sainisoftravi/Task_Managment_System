"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ExportTimeLogsModal from "@/components/time-tracking/export-time-logs-modal";
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
  Plus,
  List,
  MinusCircle,
  Info,
  Trash2,
  Edit
} from "lucide-react";

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "PERSONAL_SETTINGS" | "PERSONAL_EMAIL" | "ACTIVITY_REMINDER" | "PORTAL_CONFIGURATION" | "PROFILES" | "ROLES" | "SCHEDULE_EXPORT" | "TASK_TEMPLATES" | "AUTOMATION" | "PROJECT_SETTINGS"
  >("PERSONAL_SETTINGS");

  const [sidebarSearch, setSidebarSearch] = useState("");

  // Screenshot 1: Personal Settings State
  const [personalTab, setPersonalTab] = useState<"PERSONAL" | "ACCESSIBILITY">("PERSONAL");
  const [themeColor, setThemeColor] = useState("blue");
  const [panelStyle, setPanelStyle] = useState("dark");
  const [displayMode, setDisplayMode] = useState<"Day" | "Night" | "Auto">("Auto");
  const [landingPage, setLandingPage] = useState("Home");
  const [userName, setUserName] = useState("Ravi Saini");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("app_display_mode") as any;
      if (stored) {
        setDisplayMode(stored);
      }
    } catch {}
  }, []);

  const handleModeChange = (mode: "Day" | "Night" | "Auto") => {
    setDisplayMode(mode);
    try {
      localStorage.setItem("app_display_mode", mode);
    } catch {}

    const isDark =
      mode === "Night" ||
      (mode === "Auto" &&
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.dispatchEvent(new Event("theme_changed"));
  };

  // Workflow Rules State matching Screenshot 1-5
  const [workflowRules, setWorkflowRules] = useState(() => {
    try {
      const stored = localStorage.getItem("workflow_rules");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: "r1", code: "NO", color: "bg-[#7FD8D8] text-white", name: "Notify Owner on Task Assignment / Status Change", layout: "All Layouts", executeOn: "Comment, Update (Status, O...", nextRule: true, active: true },
      { id: "r2", code: "NF", color: "bg-lime-500 text-white", name: "Notify Follower on Task Assignment / Status Change", layout: "All Layouts", executeOn: "Update (Start Date, Owner)", nextRule: false, active: false },
      { id: "r3", code: "RT", color: "bg-amber-500 text-white", name: "Remind Task Owners on the Due Date", layout: "All Layouts", executeOn: "Creation, Update (Start Date, ...", nextRule: false, active: false },
      { id: "r4", code: "AT", color: "bg-[#F4B4C4] text-white", name: "Assign Task to Project Owner by Default", layout: "All Layouts", executeOn: "Creation", nextRule: false, active: false },
      { id: "r5", code: "QD", color: "bg-purple-400 text-white", name: "Qatar Demo Kit Flow", layout: "All Layouts", executeOn: "Comment, Update (Work Hours)", nextRule: true, active: true },
      { id: "r6", code: "01", color: "bg-[#7FD8D8] text-white", name: "01-Rule-Qatar_Kit", layout: "Standard Layout", executeOn: "Comment, Update (Completio...", nextRule: true, active: true },
    ];
  });

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleName, setRuleName] = useState("Untitled Rule");
  const [ruleExecMode, setRuleExecMode] = useState<"USER" | "DATE">("USER");
  const [ruleTriggers, setRuleTriggers] = useState<any[]>([
    { id: "t1", action: "is Created", fields: [] },
  ]);
  const [activeTriggerDropdownId, setActiveTriggerDropdownId] = useState<string | null>(null);
  const [activeFieldDropdownId, setActiveFieldDropdownId] = useState<string | null>(null);
  const [executeNextRuleCheck, setExecuteNextRuleCheck] = useState(false);

  // Criteria State for Rule Builder matching Screenshots 1-5
  const [ruleCriteria, setRuleCriteria] = useState<any[]>([
    {
      id: "c1",
      field: "Project Name",
      operator: "Is",
      value: "DT-21 01 PoC Projects",
    },
  ]);
  const [activeCriteriaFieldDropdownId, setActiveCriteriaFieldDropdownId] = useState<string | null>(null);
  const [activeCriteriaOpDropdownId, setActiveCriteriaOpDropdownId] = useState<string | null>(null);
  const [activeCriteriaValueDropdownId, setActiveCriteriaValueDropdownId] = useState<string | null>(null);
  const [criteriaFieldSearch, setCriteriaFieldSearch] = useState("");
  const [criteriaOpSearch, setCriteriaOpSearch] = useState("");

  // Rule Actions State matching Screenshot
  const [ruleActions, setRuleActions] = useState<any[]>([
    { id: "a1", type: "Associate Email Alert", name: "Notify Owner Email Alert" },
  ]);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  const saveWorkflowRulesToStorage = (updated: any[]) => {
    setWorkflowRules(updated);
    try {
      localStorage.setItem("workflow_rules", JSON.stringify(updated));
    } catch {}
  };

  // Screenshot 3: Schedule Export State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [setupSchedules, setSetupSchedules] = useState([
    { id: "s1", name: "daily to weekly", active: true, projects: "active", lastRun: "27/11/2024 05:22 PM", nextRun: "03/12/2024 08:00 AM" },
    { id: "s2", name: "test other user check", active: false, projects: "all", lastRun: "14/10/2024 04:23 PM", nextRun: "-" },
    { id: "s3", name: "audit check", active: false, projects: "active", lastRun: "23/09/2024 12:10 PM", nextRun: "-" },
    { id: "s4", name: "43regter", active: false, projects: "active", lastRun: "19/11/2024 07:30 PM", nextRun: "-" },
    { id: "s5", name: "test 100", active: false, projects: "all", lastRun: "16/09/2024 07:30 PM", nextRun: "-" },
    { id: "s6", name: "Export portal testing", active: true, projects: "active", lastRun: "09/09/2024 11:50 AM", nextRun: "01/12/2024 11:50 AM" },
  ]);

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

  // Portal Configuration State matching Screenshots 1 & 2
  const [portalTab, setPortalTab] = useState<"PORTAL" | "USER">("PORTAL");
  const [portalName, setPortalName] = useState(() => {
    try {
      return localStorage.getItem("portal_name") || "Digital Twin Solutions";
    } catch {
      return "Digital Twin Solutions";
    }
  });
  const [portalSlug, setPortalSlug] = useState(() => {
    try {
      return localStorage.getItem("portal_slug") || "digitaltwin";
    } catch {
      return "digitaltwin";
    }
  });
  const [isEditingPortalName, setIsEditingPortalName] = useState(false);
  const [isEditingPortalSlug, setIsEditingPortalSlug] = useState(false);
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [businessHours, setBusinessHours] = useState("Standard Business Hours");

  // Project Settings State matching Screenshots 1 & 2
  const [projectPrefix, setProjectPrefix] = useState(() => {
    try {
      return localStorage.getItem("portal_project_prefix") || "DT";
    } catch {
      return "DT";
    }
  });
  const [enableTags, setEnableTags] = useState(false);
  const [completionMethod, setCompletionMethod] = useState("METHOD_2");
  const [rollupCalc, setRollupCalc] = useState("ROOT");
  const [nonRollupCalc, setNonRollupCalc] = useState("ALL");
  const [phaseCompletionType, setPhaseCompletionType] = useState("ALLOW");

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
        { id: "SCHEDULE_EXPORT", label: "Schedule Export" },
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
      items: [
        { id: "TASK_TEMPLATES", label: "Task Templates" },
        { id: "CUSTOMIZATION", label: "Custom Views & Templates" },
      ],
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
    <div className="flex h-screen w-screen bg-slate-50 font-sans overflow-hidden">
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
                          setActiveCategory(item.id as any);
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
                          onClick={() => handleModeChange(m.id as any)}
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

          {/* SCREEN 4: PORTAL CONFIGURATION matching Screenshots 1 & 2 */}
          {activeCategory === "PORTAL_CONFIGURATION" && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden font-sans text-xs animate-fadeIn">
              {/* Sub-Tabs Header Bar matching Screenshots 1 & 2 */}
              <div className="flex items-center gap-6 px-6 pt-4 border-b border-slate-200 bg-white text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPortalTab("PORTAL")}
                  className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                    portalTab === "PORTAL"
                      ? "border-[#0070BA] text-[#0070BA]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Portal Settings
                </button>
                <button
                  type="button"
                  onClick={() => setPortalTab("USER")}
                  className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                    portalTab === "USER"
                      ? "border-[#0070BA] text-[#0070BA]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  User Settings
                </button>
              </div>

              {portalTab === "PORTAL" ? (
                <div className="p-6 space-y-8">
                  {/* Top Profile Header matching Screenshots 1 & 2 */}
                  <div className="flex items-start gap-5">
                    {/* Logo Badge */}
                    <div className="h-20 w-20 rounded-full bg-slate-900 flex flex-col items-center justify-center text-white border-2 border-slate-800 shadow-md flex-shrink-0">
                      <Layers className="h-6 w-6 text-emerald-400 mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase">Projects</span>
                    </div>

                    {/* Organization Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {isEditingPortalName ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={portalName}
                              onChange={(e) => setPortalName(e.target.value)}
                              className="rounded border border-[#0070BA] px-2.5 py-1 text-sm font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingPortalName(false);
                                try {
                                  localStorage.setItem("portal_name", portalName);
                                } catch {}
                                alert(`Portal Name updated to '${portalName}'.`);
                              }}
                              className="px-3 py-1 bg-[#0070BA] text-white text-xs font-bold rounded hover:bg-blue-700 cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-base font-bold text-slate-900">{portalName}</h3>
                            <button
                              type="button"
                              onClick={() => setIsEditingPortalName(true)}
                              className="text-slate-400 hover:text-[#0070BA] p-0.5 cursor-pointer"
                              title="Edit Portal Name"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Metadata Bar matching Screenshots 1 & 2 */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600 font-medium">
                        <div>
                          Time Zone: <span className="font-bold text-slate-900">{timeZone}</span>
                        </div>
                        <div>
                          Business Hours: <span className="font-bold text-slate-900">{businessHours}</span>
                        </div>
                        <div>
                          Email Encoding: <span className="font-bold text-slate-900">UTF-8</span>
                        </div>
                        <div>
                          Web Address: <span className="text-[#0070BA] hover:underline cursor-pointer">https://taskpmp.app</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6" />

                  {/* Portal URL Change Section matching Screenshots 1 & 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="md:col-span-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Portal URL Change</h4>
                    </div>

                    <div className="md:col-span-3 space-y-4">
                      {/* Interactive URL display/edit matching Screenshot 1 & 2 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-200">
                          <span className="text-slate-500 font-sans">https://taskpmp.app/portal/</span>
                          {isEditingPortalSlug ? (
                            <input
                              type="text"
                              value={portalSlug}
                              onChange={(e) => setPortalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                              className="bg-white border border-[#0070BA] px-2 py-0.5 text-xs font-bold text-blue-600 rounded focus:outline-none"
                            />
                          ) : (
                            <span className="font-bold text-blue-600 underline bg-blue-50 px-2 py-0.5 rounded">
                              {portalSlug}
                            </span>
                          )}
                          {isEditingPortalSlug ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingPortalSlug(false);
                                try {
                                  localStorage.setItem("portal_slug", portalSlug);
                                } catch {}
                                alert(`Portal URL changed successfully! New Portal URL: https://taskpmp.app/portal/${portalSlug}`);
                              }}
                              className="ml-auto px-3 py-1 bg-[#0070BA] text-white text-xs font-bold rounded hover:bg-blue-700 font-sans cursor-pointer"
                            >
                              Save URL
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsEditingPortalSlug(true)}
                              className="ml-auto text-xs font-bold text-[#0070BA] hover:underline font-sans cursor-pointer"
                            >
                              Edit URL
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Explanation Note matching Screenshot 1 & 2 */}
                      <p className="text-slate-500 text-xs leading-relaxed">
                        The previous portal URL will no longer work. You will be redirected to the new portal URL{" "}
                        <span className="font-mono text-slate-700">https://taskpmp.app/portal/&lt;newportal&gt;</span>
                      </p>

                      {/* Admin Notice matching Screenshot 1 & 2 */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-blue-50/60 p-3 rounded-md border border-blue-100">
                        <User className="h-4 w-4 text-[#0070BA]" />
                        <span>
                          You have Admin access to change the portal URL or organization profile.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* User Settings Tab */
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">User Portal Preferences</h4>
                  <p className="text-xs text-slate-500">Configure personal account display options and organization portal view settings.</p>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">Portal View Mode: Standard Enterprise View</p>
                  </div>
                </div>
              )}
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
                <h3 className="text-base font-bold text-slate-900">Roles &amp; Hierarchy</h3>
                <button
                  onClick={() => alert("Add Role Modal")}
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

          {/* AUTOMATION (WORKFLOW RULES) matching Screenshots 1-5 */}
          {activeCategory === "AUTOMATION" && (
            <div className="space-y-4 font-sans text-xs">
              {/* Header matching Screenshot 1 */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Workflow Rules</h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setRuleName("Untitled Rule");
                      setRuleExecMode("USER");
                      setRuleTriggers([{ id: "t1", action: "is Created", fields: [] }]);
                      setExecuteNextRuleCheck(false);
                      setShowRuleModal(true);
                    }}
                    className="rounded-md bg-[#0070BA] hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>New Workflow Rule</span>
                  </button>
                  <div className="flex items-center gap-1 text-slate-400 pl-2 border-l border-slate-200">
                    <button className="p-1 hover:text-slate-700 rounded"><List className="h-4 w-4" /></button>
                    <button className="p-1 hover:text-slate-700 rounded"><CrossIcon className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>

              {/* Workflow Rules Table matching Screenshot 1 */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Execute On</th>
                      <th className="py-3 px-4 text-center">Execute Next Rule</th>
                      <th className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>Status</span>
                          <Info className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {workflowRules.map((rule: any) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg ${rule.color} font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                              {rule.code}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{rule.name}</h4>
                              <span className="text-[11px] text-slate-400 font-medium">{rule.layout}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{rule.executeOn}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={rule.nextRule}
                            onChange={(e) => {
                              const updated = workflowRules.map((r: any) =>
                                r.id === rule.id ? { ...r, nextRule: e.target.checked } : r
                              );
                              saveWorkflowRulesToStorage(updated);
                            }}
                            className="rounded text-[#0070BA] focus:ring-0 cursor-pointer h-4 w-4"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = workflowRules.map((r: any) =>
                                r.id === rule.id ? { ...r, active: !r.active } : r
                              );
                              saveWorkflowRulesToStorage(updated);
                            }}
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              rule.active ? "bg-[#0070BA]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                rule.active ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECT SETTINGS PAGE matching Screenshots 1 & 2 */}
          {activeCategory === "PROJECT_SETTINGS" && (
            <div className="space-y-6 font-sans text-xs animate-fadeIn">
              {/* Page Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Project &amp; Project Groups</h2>
                  <p className="text-xs text-slate-500">Configure global project prefix, tags, and progress calculation rules</p>
                </div>
              </div>

              {/* Section 1: Prefix & ID */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Prefix &amp; ID</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-3xl">
                    The Project ID is a prefix appended to a unique number that allows you to identify and track projects. The Project prefix must be no more than ten characters long and can only contain letters and numbers.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={projectPrefix}
                    onChange={(e) => setProjectPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    className="w-48 rounded border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-[#0070BA] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = projectPrefix.trim() || "DT";
                      setProjectPrefix(clean);
                      try {
                        localStorage.setItem("portal_project_prefix", clean);
                      } catch {}
                      alert(`Project Prefix updated to '${clean}'. New projects will auto-generate IDs starting with '${clean}-'.`);
                    }}
                    className="rounded bg-[#0070BA] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Section 2: Tags */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Tags</h3>
                  <p className="text-slate-500 text-xs">
                    Enable tags and associate them with projects, milestones, task lists, Tasks, issues, forums, and status.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEnableTags(!enableTags)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enableTags ? "bg-[#0070BA]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      enableTags ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Section 3: Project Completion Percentage */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Project Completion Percentage</h3>
                  <p className="text-slate-500 text-xs mb-3">Select one of the following methods:</p>

                  <div className="space-y-3 font-medium text-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="completionMethod"
                        checked={completionMethod === "METHOD_1"}
                        onChange={() => setCompletionMethod("METHOD_1")}
                        className="text-[#0070BA] focus:ring-0 cursor-pointer"
                      />
                      <span>Based on completed Task and Issue count.</span>
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="completionMethod"
                          checked={completionMethod === "METHOD_2"}
                          onChange={() => setCompletionMethod("METHOD_2")}
                          className="text-[#0070BA] focus:ring-0 cursor-pointer"
                        />
                        <span>Based on Task completion percentage and completed Issue count.</span>
                      </label>

                      {/* Sub-Option Yellow Box matching Screenshot 1 & 2 */}
                      {completionMethod === "METHOD_2" && (
                        <div className="ml-6 bg-[#FFFBEB] p-4 rounded-md border border-amber-200 space-y-3 text-xs font-semibold text-slate-700 animate-fadeIn">
                          <div>
                            <p className="mb-1 text-slate-800">
                              For the roll-up project, choose whether to calculate completion based on tasks or subtasks. <span className="text-slate-400 font-normal">ⓘ</span>
                            </p>
                            <div className="flex items-center gap-4 pl-2">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="rollupCalc"
                                  checked={rollupCalc === "ROOT"}
                                  onChange={() => setRollupCalc("ROOT")}
                                  className="text-[#0070BA] focus:ring-0 cursor-pointer"
                                />
                                <span>Root Task</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="rollupCalc"
                                  checked={rollupCalc === "SUBTASKS"}
                                  onChange={() => setRollupCalc("SUBTASKS")}
                                  className="text-[#0070BA] focus:ring-0 cursor-pointer"
                                />
                                <span>Subtasks</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <p className="mb-1 text-slate-800">
                              For the non roll-up project, choose whether to calculate completion based on tasks or subtasks. <span className="text-slate-400 font-normal">ⓘ</span>
                            </p>
                            <div className="flex items-center gap-4 pl-2">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="nonRollupCalc"
                                  checked={nonRollupCalc === "ALL"}
                                  onChange={() => setNonRollupCalc("ALL")}
                                  className="text-[#0070BA] focus:ring-0 cursor-pointer"
                                />
                                <span>All tasks</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="nonRollupCalc"
                                  checked={nonRollupCalc === "ROOT"}
                                  onChange={() => setNonRollupCalc("ROOT")}
                                  className="text-[#0070BA] focus:ring-0 cursor-pointer"
                                />
                                <span>Root Task</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="completionMethod"
                        checked={completionMethod === "METHOD_3"}
                        onChange={() => setCompletionMethod("METHOD_3")}
                        className="text-[#0070BA] focus:ring-0 cursor-pointer"
                      />
                      <span>Based on Task and Issue weightage field.</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Project Completion Percentage settings updated successfully.")}
                  className="rounded bg-[#0070BA] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer mt-2"
                >
                  Update
                </button>
              </div>

              {/* Section 4: Phase Completion Type */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Phase Completion Type</h3>
                  <p className="text-slate-500 text-xs mb-3">Select one of the following methods:</p>

                  <div className="space-y-2.5 font-medium text-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="phaseCompletionType"
                        checked={phaseCompletionType === "ALLOW"}
                        onChange={() => setPhaseCompletionType("ALLOW")}
                        className="text-[#0070BA] focus:ring-0 cursor-pointer"
                      />
                      <span>Allow Phase completion with open Tasks and Issues</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="phaseCompletionType"
                        checked={phaseCompletionType === "WARNING"}
                        onChange={() => setPhaseCompletionType("WARNING")}
                        className="text-[#0070BA] focus:ring-0 cursor-pointer"
                      />
                      <span>Display a warning when completing a Phase with open Tasks or Issues</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="phaseCompletionType"
                        checked={phaseCompletionType === "RESTRICT"}
                        onChange={() => setPhaseCompletionType("RESTRICT")}
                        className="text-[#0070BA] focus:ring-0 cursor-pointer"
                      />
                      <span>Restrict Phase completion if there are open Tasks or Issues</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Phase Completion Type settings updated successfully.")}
                  className="rounded bg-[#0070BA] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer mt-2"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          {/* SCHEDULE EXPORT SETUP PAGE matching Screenshot 3 */}
          {activeCategory === "SCHEDULE_EXPORT" && (
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule Export &gt; Timesheet</h3>
                  <p className="text-xs text-slate-500">Automate recurring timesheet exports and monitor execution logs</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="rounded-md bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Schedule Export
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">SCHEDULE NAME</th>
                      <th className="py-3 px-4 text-center">OFF/ON</th>
                      <th className="py-3 px-4 text-center">RUN NOW</th>
                      <th className="py-3 px-4">PROJECTS</th>
                      <th className="py-3 px-4">LAST DAY RUN</th>
                      <th className="py-3 px-4">NEXT RUN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {setupSchedules.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() =>
                              setSetupSchedules(
                                setupSchedules.map((s) => (s.id === item.id ? { ...s, active: !s.active } : s))
                              )
                            }
                            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                              item.active ? "bg-orange-500" : "bg-slate-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                item.active ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              const nowStr = new Date().toLocaleString();
                              setSetupSchedules(
                                setupSchedules.map((s) => (s.id === item.id ? { ...s, lastRun: nowStr } : s))
                              );
                              alert(`Run Now triggered for '${item.name}'`);
                            }}
                            className="p-1 rounded text-orange-500 hover:bg-orange-50 cursor-pointer"
                            title="Run Now"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-mono">{item.projects}</td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                          {item.lastRun !== "-" ? `✓ ${item.lastRun}` : "-"}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{item.nextRun}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ExportTimeLogsModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onExport={(data) => {
                  alert(`Export scheduled successfully!`);
                }}
              />
            </div>
          )}

          {/* SCREEN: TASK TEMPLATES matching Screenshot 3 */}
          {activeCategory === "TASK_TEMPLATES" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Task Templates</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage pre-built task list templates and standard work items</p>
                </div>

                <button
                  onClick={() => alert("Create Task List Template")}
                  className="rounded bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Create a Task List Template
                </button>
              </div>

              {/* Data Table matching Screenshot 3 */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">TITLE</th>
                      <th className="py-3 px-4 w-36 text-center">START AFTER ⓘ</th>
                      <th className="py-3 px-4 w-36 text-center">DURATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="bg-slate-50/60 font-bold text-slate-900">
                      <td className="py-2.5 px-4" colSpan={3}>
                        ▾ New template
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-8 font-semibold text-slate-700">task 3</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600">4 days</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600">5 days</td>
                    </tr>

                    <tr className="bg-slate-50/60 font-bold text-slate-900">
                      <td className="py-2.5 px-4 flex items-center justify-between" colSpan={3}>
                        <span>▾ Concrete work</span>
                        <button
                          onClick={() => alert("Add Task to Concrete work template")}
                          className="rounded border border-orange-400 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600 hover:bg-orange-100 cursor-pointer shadow-2xs"
                        >
                          + Add Task
                        </button>
                      </td>
                    </tr>
                    {[
                      { title: "Termite treatment", start: "-", duration: "271 days" },
                      { title: "Concrete Mix", start: "-", duration: "23 days" },
                      { title: "Safety Unit Check", start: "-", duration: "66 days" },
                      { title: "Pipelines layout", start: "-", duration: "308 days" },
                      { title: "Ceramic Tile Check", start: "-", duration: "903 days" },
                      { title: "Curing", start: "-", duration: "304 days" },
                    ].map((item) => (
                      <tr key={item.title} className="hover:bg-slate-50">
                        <td className="py-2 px-8 font-semibold text-slate-700">{item.title}</td>
                        <td className="py-2 px-4 text-center font-mono text-slate-500">{item.start}</td>
                        <td className="py-2 px-4 text-center font-mono text-slate-600">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-2">
                <span>Total Template count: 66</span>
                <span>1 - 10</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Workflow Rule Canvas Builder Modal matching Screenshots 2-5 */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Top Header Bar matching Screenshot 2 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#7FD8D8] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {ruleName ? ruleName.slice(0, 2).toUpperCase() : "UR"}
                </div>
                <div>
                  <input
                    type="text"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    className="font-bold text-base text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-[#0070BA] focus:outline-none px-1"
                  />
                  <button className="text-xs text-blue-600 font-semibold block px-1 hover:underline">
                    Description &gt;
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span>Layout : <strong className="text-slate-800">Standard Layout</strong></span>
                <button onClick={() => setShowRuleModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                  <CrossIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Canvas with Flow Nodes matching Screenshot 2-5 */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-6">
              <div className="flex gap-8">
                {/* Left Diagram Connection Nodes matching Screenshot 2 */}
                <div className="flex flex-col items-center pt-2">
                  <div className="h-16 w-16 rounded-full border-2 border-blue-500 text-blue-600 font-bold text-xs flex items-center justify-center bg-white shadow-xs">
                    WHEN
                  </div>
                  <div className="h-28 w-0 border-l-2 border-dashed border-blue-400 my-1" />
                  <div className="h-16 w-16 rotate-45 border-2 border-blue-500 bg-white shadow-xs flex items-center justify-center">
                    <span className="-rotate-45 font-bold text-[9px] text-blue-600 tracking-tighter">CONDITION 1</span>
                  </div>
                </div>

                {/* Right Flow Action Cards matching Screenshot 2-5 */}
                <div className="flex-1 space-y-6">
                  {/* Card 1: WHEN Block */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-700 text-xs mb-2">This rule will be executed</h4>
                      <div className="flex items-center gap-6 text-xs font-semibold text-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="execMode"
                            checked={ruleExecMode === "USER"}
                            onChange={() => setRuleExecMode("USER")}
                            className="text-[#0070BA] focus:ring-0 cursor-pointer"
                          />
                          <span>Based on User action</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="execMode"
                            checked={ruleExecMode === "DATE"}
                            onChange={() => setRuleExecMode("DATE")}
                            className="text-[#0070BA] focus:ring-0 cursor-pointer"
                          />
                          <span>Based on Date &amp; Time</span>
                        </label>
                      </div>
                    </div>

                    {/* Trigger Rows List matching Screenshot 4 */}
                    <div className="space-y-3 pt-2">
                      {ruleTriggers.map((trig) => (
                        <div key={trig.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          {ruleTriggers.length > 1 && (
                            <button
                              onClick={() => setRuleTriggers(ruleTriggers.filter((t) => t.id !== trig.id))}
                              className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </button>
                          )}
                          <span>When a Task</span>

                          {/* Action Dropdown matching Screenshot 3 */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActiveTriggerDropdownId(activeTriggerDropdownId === trig.id ? null : trig.id)}
                              className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline cursor-pointer"
                            >
                              <span>{trig.action}</span>
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>

                            {activeTriggerDropdownId === trig.id && (
                              <div className="absolute left-0 mt-1 z-30 w-48 bg-white rounded-lg border border-slate-200 shadow-xl py-1 text-slate-800 font-semibold animate-fadeIn">
                                {["is Created", "is Updated", "is Commented on", "is Trashed", "Document is attached"].map((act) => (
                                  <button
                                    key={act}
                                    type="button"
                                    onClick={() => {
                                      setRuleTriggers(
                                        ruleTriggers.map((t) => (t.id === trig.id ? { ...t, action: act } : t))
                                      );
                                      setActiveTriggerDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-xs"
                                  >
                                    {act}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Field Selection Dropdown matching Screenshot 5 */}
                          {trig.action === "is Updated" && (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setActiveFieldDropdownId(activeFieldDropdownId === trig.id ? null : trig.id)}
                                className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline cursor-pointer"
                              >
                                <span>({trig.fields.length > 0 ? trig.fields.join(", ") : "any fields"})</span>
                              </button>

                              {activeFieldDropdownId === trig.id && (
                                <div className="absolute left-0 mt-1 z-30 w-60 bg-white rounded-lg border border-slate-200 shadow-2xl p-2 text-slate-800 animate-fadeIn space-y-0.5 max-h-64 overflow-y-auto">
                                  {[
                                    "Owner",
                                    "Status",
                                    "Start Date",
                                    "Due Date",
                                    "Duration",
                                    "Priority",
                                    "Completion Percentage",
                                    "Tags",
                                    "Work Hours",
                                    "Completion Date",
                                    "Billing Type",
                                    "Associated Team",
                                    "Task Name",
                                    "Task Description",
                                    "Clear Dates",
                                  ].map((field) => {
                                    const isChecked = trig.fields.includes(field);
                                    return (
                                      <label key={field} className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50/60 rounded cursor-pointer text-xs font-medium text-slate-700">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            const nextFields = e.target.checked
                                              ? [...trig.fields, field]
                                              : trig.fields.filter((f: string) => f !== field);
                                            setRuleTriggers(
                                              ruleTriggers.map((t) => (t.id === trig.id ? { ...t, fields: nextFields } : t))
                                            );
                                          }}
                                          className="rounded text-[#0070BA] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                                        />
                                        <span>{field}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setRuleTriggers([
                            ...ruleTriggers,
                            { id: `t${Date.now()}`, action: "is Updated", fields: ["Status"] },
                          ])
                        }
                        className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: CONDITION 1 - Criteria Block matching Screenshots 1-5 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 font-sans text-xs">
                    <h4 className="font-bold text-slate-900 text-sm">Condition 1 - Criteria</h4>

                    {/* Criteria Rows List */}
                    <div className="space-y-3">
                      {ruleCriteria.length === 0 ? (
                        <p className="text-slate-500 text-xs">
                          Add criteria to determine if it will trigger this condition.{" "}
                          <button
                            type="button"
                            onClick={() =>
                              setRuleCriteria([
                                { id: `c-${Date.now()}`, field: "Project Name", operator: "Is", value: "DT-21 01 PoC Projects" },
                              ])
                            }
                            className="text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            Add Criteria +
                          </button>
                        </p>
                      ) : (
                        ruleCriteria.map((crit) => (
                          <div key={crit.id} className="flex items-center gap-3 bg-[#F3F8FC] p-3 rounded-lg border border-blue-100 shadow-2xs">
                            {/* Field 1: Project Name / Field Picker Dropdown (Screenshot 1 & 2) */}
                            <div className="relative w-52">
                              <button
                                type="button"
                                onClick={() => {
                                  setCriteriaFieldSearch("");
                                  setActiveCriteriaFieldDropdownId(activeCriteriaFieldDropdownId === crit.id ? null : crit.id);
                                  setActiveCriteriaOpDropdownId(null);
                                  setActiveCriteriaValueDropdownId(null);
                                }}
                                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 hover:bg-slate-50 cursor-pointer shadow-2xs"
                              >
                                <span className="truncate">{crit.field || "Select Field"}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                              </button>

                              {activeCriteriaFieldDropdownId === crit.id && (
                                <div className="absolute left-0 mt-1 z-40 w-60 bg-white rounded-lg border border-slate-200 shadow-2xl p-2 animate-fadeIn space-y-2">
                                  <div className="relative">
                                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                                    <input
                                      type="text"
                                      placeholder="Search fields..."
                                      value={criteriaFieldSearch}
                                      onChange={(e) => setCriteriaFieldSearch(e.target.value)}
                                      className="w-full text-xs pl-8 pr-2 py-1 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                      autoFocus
                                    />
                                  </div>

                                  <div className="max-h-52 overflow-y-auto space-y-0.5 font-medium text-slate-700">
                                    {[
                                      "Project",
                                      "Project Name",
                                      "Project Owner",
                                      "Project Start Date",
                                      "Project End Date",
                                      "Strict Project",
                                      "Project Group",
                                      "Project Status",
                                      "Project Roll-up",
                                      "Project Created Date",
                                      "Task Status",
                                      "Task Priority",
                                      "Task Owner",
                                    ]
                                      .filter((f) => f.toLowerCase().includes(criteriaFieldSearch.toLowerCase()))
                                      .map((f) => (
                                        <button
                                          key={f}
                                          type="button"
                                          onClick={() => {
                                            setRuleCriteria(
                                              ruleCriteria.map((c) => (c.id === crit.id ? { ...c, field: f } : c))
                                            );
                                            setActiveCriteriaFieldDropdownId(null);
                                          }}
                                          className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-xs font-medium block ${
                                            crit.field === f ? "bg-blue-50 text-blue-600 font-bold" : ""
                                          }`}
                                        >
                                          {f}
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Field 2: Operator Picker Dropdown (Screenshot 3 & 4) */}
                            <div className="relative w-36">
                              <button
                                type="button"
                                onClick={() => {
                                  setCriteriaOpSearch("");
                                  setActiveCriteriaOpDropdownId(activeCriteriaOpDropdownId === crit.id ? null : crit.id);
                                  setActiveCriteriaFieldDropdownId(null);
                                  setActiveCriteriaValueDropdownId(null);
                                }}
                                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 hover:bg-slate-50 cursor-pointer shadow-2xs"
                              >
                                <span>{crit.operator || "Is"}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              </button>

                              {activeCriteriaOpDropdownId === crit.id && (
                                <div className="absolute left-0 mt-1 z-40 w-44 bg-white rounded-lg border border-slate-200 shadow-2xl p-2 animate-fadeIn space-y-2">
                                  <div className="relative">
                                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2 top-2" />
                                    <input
                                      type="text"
                                      placeholder="Search..."
                                      value={criteriaOpSearch}
                                      onChange={(e) => setCriteriaOpSearch(e.target.value)}
                                      className="w-full text-xs pl-7 pr-2 py-1 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                      autoFocus
                                    />
                                  </div>

                                  <div className="max-h-48 overflow-y-auto space-y-0.5 font-medium text-slate-700">
                                    {["Is", "Is Not", "Contains", "Doesn't Contains", "Starts With", "Ends With"]
                                      .filter((op) => op.toLowerCase().includes(criteriaOpSearch.toLowerCase()))
                                      .map((op) => (
                                        <button
                                          key={op}
                                          type="button"
                                          onClick={() => {
                                            setRuleCriteria(
                                              ruleCriteria.map((c) => (c.id === crit.id ? { ...c, operator: op } : c))
                                            );
                                            setActiveCriteriaOpDropdownId(null);
                                          }}
                                          className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-xs font-medium block ${
                                            crit.operator === op ? "bg-blue-50 text-blue-600 font-bold" : ""
                                          }`}
                                        >
                                          {op}
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Field 3: Value Picker Dropdown (Screenshot 5) */}
                            <div className="relative flex-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCriteriaValueDropdownId(activeCriteriaValueDropdownId === crit.id ? null : crit.id);
                                  setActiveCriteriaFieldDropdownId(null);
                                  setActiveCriteriaOpDropdownId(null);
                                }}
                                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-blue-500 hover:bg-slate-50 cursor-pointer shadow-2xs"
                              >
                                <span className="truncate">{crit.value || "Select"}</span>
                              </button>

                              {activeCriteriaValueDropdownId === crit.id && (
                                <div className="absolute left-0 mt-1 z-40 w-full bg-white rounded-lg border border-slate-200 shadow-2xl p-2 animate-fadeIn max-h-48 overflow-y-auto space-y-0.5 font-medium text-slate-700">
                                  {[
                                    "DT-21 01 PoC Projects",
                                    "DT-31 07 Command Center Automation",
                                    "DT-30 06 Monthly Miscellaneous Tasks",
                                  ].map((val) => (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => {
                                        setRuleCriteria(
                                          ruleCriteria.map((c) => (c.id === crit.id ? { ...c, value: val } : c))
                                        );
                                        setActiveCriteriaValueDropdownId(null);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-xs font-medium block ${
                                        crit.value === val ? "bg-blue-50 text-blue-600 font-bold" : ""
                                      }`}
                                    >
                                      {val}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Far Right Action Icons matching Screenshot 1-5 */}
                            <div className="flex items-center gap-1.5 flex-shrink-0 text-emerald-600">
                              <button
                                type="button"
                                onClick={() =>
                                  setRuleCriteria([
                                    ...ruleCriteria,
                                    { id: `c-${Date.now()}`, field: "Project Name", operator: "Is", value: "DT-31 07 Command Center Automation" },
                                  ])
                                }
                                className="p-1 rounded hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                                title="Add Criteria Row"
                              >
                                <Plus className="h-4 w-4 border border-emerald-600 rounded-full p-0.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRuleCriteria(ruleCriteria.filter((c) => c.id !== crit.id))
                                }
                                className="p-1 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                title="Remove Criteria Row"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Associated Actions List */}
                    {ruleActions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h5 className="font-bold text-slate-700 text-xs">Associated Actions ({ruleActions.length})</h5>
                        <div className="space-y-1.5">
                          {ruleActions.map((act) => (
                            <div key={act.id} className="flex items-center justify-between p-2.5 bg-blue-50/60 rounded-md border border-blue-100 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#0070BA] text-white font-bold text-[10px] uppercase shadow-2xs">
                                  {act.type.split(" ")[0]}
                                </span>
                                <span className="font-bold text-slate-800">{act.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setRuleActions(ruleActions.filter((a) => a.id !== act.id))}
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {/* Interactive + Add Action Popover matching Screenshot */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowActionDropdown(!showActionDropdown)}
                          className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Action</span>
                        </button>

                        {showActionDropdown && (
                          <div className="absolute left-0 mt-1.5 z-40 w-64 bg-white rounded-lg border border-slate-200 shadow-2xl py-1.5 text-slate-800 font-semibold animate-fadeIn">
                            {[
                              "Update Field",
                              "Associate Webhook",
                              "Associate Custom Function",
                              "Associate Email Alert",
                              "Associate WhatsApp Notification",
                            ].map((actionType) => (
                              <button
                                key={actionType}
                                type="button"
                                onClick={() => {
                                  setRuleActions([
                                    ...ruleActions,
                                    { id: `act-${Date.now()}`, type: actionType, name: `${actionType} Handler` },
                                  ]);
                                  setShowActionDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-slate-100 cursor-pointer text-xs font-semibold block text-slate-700 hover:text-blue-600 transition-colors"
                              >
                                {actionType}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setRuleCriteria([
                            ...ruleCriteria,
                            { id: `c-${Date.now()}`, field: "Project Name", operator: "Is", value: "DT-31 07 Command Center Automation" },
                          ])
                        }
                        className="text-blue-600 font-bold text-xs hover:underline cursor-pointer"
                      >
                        + Add Criteria
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Footer matching Screenshot 2 */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newRuleObj = {
                      id: `r${Date.now()}`,
                      code: ruleName.slice(0, 2).toUpperCase() || "UR",
                      color: "bg-blue-500 text-white",
                      name: ruleName.trim() || "Untitled Rule",
                      layout: "Standard Layout",
                      executeOn: ruleTriggers.map((t) => `${t.action}`).join(", "),
                      nextRule: executeNextRuleCheck,
                      active: true,
                    };
                    saveWorkflowRulesToStorage([newRuleObj, ...workflowRules]);
                    setShowRuleModal(false);
                    alert(`Workflow Rule '${newRuleObj.name}' saved successfully!`);
                  }}
                  className="px-4 py-2 bg-[#0070BA] hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs cursor-pointer"
                >
                  Save Rule
                </button>
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={executeNextRuleCheck}
                  onChange={(e) => setExecuteNextRuleCheck(e.target.checked)}
                  className="rounded text-[#0070BA] focus:ring-0 cursor-pointer"
                />
                <span>Execute the next workflow rule</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
