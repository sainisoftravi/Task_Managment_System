"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Ticket,
  Briefcase,
  KanbanSquare,
  BarChart3,
  Clock,
  BookOpen,
  Bell,
  Settings,
  Menu,
  LogOut,
  ChevronDown,
  ChevronRight,
  Folder,
  Layers,
  AlertCircle,
  Users as UsersIcon,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Plus,
  Copy,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationDrawer from "@/components/notifications/notification-drawer";

const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Collaboration", href: "/collaboration", icon: MessageSquare },
  { name: "My Approvals", href: "/my-approvals", icon: CheckCircle2 },
  { name: "Users", href: "/users", icon: UsersIcon },
];

const overviewItems = [
  { name: "Tasks", href: "/projects", icon: KanbanSquare },
  { name: "Time Logs", href: "/time-tracking", icon: Clock },
  { name: "Issues", href: "/tickets", icon: AlertCircle },
  { name: "Phases", href: "/projects", icon: Layers },
];

const recentProjects = [
  { name: "01 PoC Projects", id: "poc-1" },
  { name: "06 Monthly Miscellaneous Tasks", id: "misc-6" },
  { name: "07 Command Center Automation", id: "auto-7" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [overviewExpanded, setOverviewExpanded] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"Day" | "Night" | "Auto">("Auto");

  const isSettingsPage = pathname === "/settings";

  const applyThemeMode = (mode: "Day" | "Night" | "Auto") => {
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
  };

  // Load persistent theme mode preference
  useEffect(() => {
    try {
      const storedMode = (localStorage.getItem("app_display_mode") as any) || "Auto";
      applyThemeMode(storedMode);
    } catch {}

    const handleStorageChange = () => {
      try {
        const mode = (localStorage.getItem("app_display_mode") as any) || "Auto";
        applyThemeMode(mode);
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("theme_changed", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("theme_changed", handleStorageChange);
    };
  }, []);

  // Load persistent sidebar collapse preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebar_collapsed");
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    try {
      localStorage.setItem("sidebar_collapsed", String(nextState));
    } catch {}
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-sans text-sm text-slate-500">Loading...</div>;
  }

  if (isSettingsPage) {
    return (
      <div className="h-screen w-screen overflow-hidden font-sans bg-slate-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dark Navigation Sidebar (Persistent on ALL Layouts) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform overflow-y-auto bg-[#0D1117] border-r border-slate-800 text-slate-300 transition-all duration-200 ease-in-out lg:translate-x-0 lg:static flex flex-col flex-shrink-0",
          collapsed ? "lg:w-16 w-64" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Header Bar with Hide/View Panel Toggle Button */}
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center space-x-2 truncate">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xs flex-shrink-0">
              <Ticket className="h-3.5 w-3.5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white tracking-tight">Projects</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            )}
          </Link>

          {/* Hide/View Panel Option Button matching Screenshot */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand Side Panel" : "Hide Side Panel"}
            className="hidden lg:flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-blue-400" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-[#0070BA] text-white shadow-xs font-bold"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white",
                    collapsed ? "justify-center px-0" : ""
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Overview Section */}
          {!collapsed && !isSettingsPage && (
            <div className="pt-2 border-t border-slate-800/60">
              <div
                onClick={() => setOverviewExpanded(!overviewExpanded)}
                className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronRight className={cn("h-3 w-3 transition-transform", overviewExpanded ? "rotate-90" : "")} />
                  <span>Overview</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Search className="h-3 w-3 hover:text-slate-300" />
                  <Plus className="h-3 w-3 hover:text-slate-300" />
                </div>
              </div>

              {overviewExpanded && (
                <div className="mt-1 space-y-0.5 pl-2">
                  {overviewItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                          isActive
                            ? "bg-slate-800 text-white font-bold"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Recent Projects Section */}
          {!collapsed && !isSettingsPage && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Recent Projects</span>
                <Search className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-pointer" />
              </div>
              <div className="mt-1 space-y-1">
                {recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    href="/projects"
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-400 hover:bg-slate-800/60 hover:text-blue-300 transition-colors truncate cursor-pointer"
                  >
                    <Folder className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Footer matching Screenshot 1 */}
        <div className="mt-auto border-t border-slate-800/80 p-3 space-y-2">
          <Link
            href="/users?invite=true"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer shadow-xs",
              collapsed ? "px-0" : ""
            )}
          >
            <UsersIcon className="h-4 w-4 text-[#0070BA]" />
            {!collapsed && <span>Invite Users</span>}
          </Link>

          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            {collapsed && (
              <button
                type="button"
                onClick={toggleCollapsed}
                title="Expand Side Panel"
                className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              >
                <PanelLeftOpen className="h-4 w-4 text-[#0070BA]" />
                <span>Show Panel</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link href="/settings" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 cursor-pointer" title="Setup & Settings">
              <Settings className="h-5 w-5" />
            </Link>

            {/* Interactive User Profile Menu Button */}
            <div className="relative">
              <button
                onClick={() => setProfileCardOpen(!profileCardOpen)}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors cursor-pointer"
                title="User Profile & Account"
              >
                <div className="h-8 w-8 rounded-full bg-[#0070BA] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {user?.name?.[0] || user?.email?.[0] || "R"}
                </div>
                <span className="text-xs font-bold text-slate-700">{user?.name || user?.email || "Ravi Saini"}</span>
              </button>

              {/* User Profile Popover Card matching Screenshot 2 */}
              {profileCardOpen && (
                <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl bg-slate-50 border border-slate-200 p-4 shadow-2xl font-sans text-slate-800 animate-fadeIn">
                  {/* Card Header: Sign Out on Left, Close on Right */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                    <button
                      onClick={() => {
                        setProfileCardOpen(false);
                        logout();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-blue-600" />
                      <span>Sign Out</span>
                    </button>

                    <button
                      onClick={() => setProfileCardOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/50 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* User Info Details matching Screenshot 2 */}
                  <div className="py-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-slate-200 text-slate-500 font-bold text-xl flex items-center justify-center border-2 border-white shadow-xs">
                          {user?.name?.[0] || "R"}
                        </div>
                        <span className="h-4 w-4 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0" title="Online Status" />
                      </div>

                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="font-bold text-base text-slate-900 truncate">{user?.name || "Ravi Saini"}</h4>
                        <p className="text-xs text-slate-500 truncate">{user?.email || "ravi@digital-twin-solutions.com"}</p>
                        <p className="text-[11px] text-slate-500">TaskPMP User ID: <span className="font-mono font-semibold text-slate-700">906280277</span></p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <span>Organization ID: <strong className="font-mono font-semibold text-slate-700">889826678</strong></span>
                          <button
                            onClick={() => alert("Copied Organization ID: 889826678 to clipboard")}
                            className="text-blue-600 hover:text-blue-800 p-0.5 cursor-pointer"
                            title="Copy Organization ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Mode Switcher in Profile Card */}
                  <div className="py-2.5 border-t border-slate-200/60">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Display Mode</span>
                    <div className="flex items-center gap-2">
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
                            type="button"
                            onClick={() => applyThemeMode(m.id as any)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md border text-xs font-bold transition-all cursor-pointer",
                              isSelected
                                ? "border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-2xs"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Footer Navigation matching Screenshot 2 */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-start gap-2 text-xs font-semibold text-slate-700">
                    <Link href="/settings" onClick={() => setProfileCardOpen(false)} className="hover:text-blue-600 hover:underline">
                      My Accounts
                    </Link>
                    <span className="text-slate-300">•</span>
                    <div className="relative group">
                      <button className="inline-flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                        <span>My Portals</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        <NotificationDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}
