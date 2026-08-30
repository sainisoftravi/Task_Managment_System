"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Time Tracking", href: "/time-tracking", icon: Clock },
  { name: "Knowledge Base", href: "/kb", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto bg-white shadow-md transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">TaskPMP</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5" />
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
