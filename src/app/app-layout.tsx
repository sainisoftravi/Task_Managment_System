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
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Users as UsersIcon } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Users", href: "/users", icon: UsersIcon },
  { name: "Time Tracking", href: "/time-tracking", icon: Clock },
  { name: "Knowledge Base", href: "/kb", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar matching Zoho Projects Dark Navigation Bar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto bg-[#0D1117] border-r border-slate-800 text-slate-300 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">TaskPMP</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Zoho Edition</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold transition-all",
                  isActive
                    ? "bg-[#0070BA] text-white shadow-sm font-bold"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-800/80 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                {user?.name?.[0] || user?.email?.[0] || "?"}
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name || user.email}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
