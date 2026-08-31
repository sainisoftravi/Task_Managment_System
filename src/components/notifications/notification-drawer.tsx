"use client";

import { useState } from "react";
import { Bell, Flag, AtSign, Check, CheckCheck, X, ChevronRight, ExternalLink } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  project: string;
  read: boolean;
  flagged: boolean;
  isMention: boolean;
  link: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [activeTab, setActiveTab] = useState<"all" | "flagged" | "mentions">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Task Assigned",
      message: "Divakar Pandiy assigned you to task 'API Gateway Memory Leak Fix'",
      time: "10 mins ago",
      project: "Mobile App Development",
      read: false,
      flagged: true,
      isMention: false,
      link: "/projects",
    },
    {
      id: "2",
      title: "@Mentioned in Forum",
      message: "@Admin User please review the deployment schedule for Milestone 2.0",
      time: "1 hour ago",
      project: "Website Redesign",
      read: false,
      flagged: false,
      isMention: true,
      link: "/projects",
    },
    {
      id: "3",
      title: "SLA Warning Alert",
      message: "Ticket TKT-8921 resolution SLA timer has reached 80% threshold",
      time: "3 hours ago",
      project: "Help Desk Support",
      read: true,
      flagged: true,
      isMention: false,
      link: "/tickets",
    },
  ]);

  if (!isOpen) return null;

  const toggleFlag = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, flagged: !n.flagged } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "flagged") return n.flagged;
    if (activeTab === "mentions") return n.isMention;
    return true;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col font-sans">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#0070BA]" />
          <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            title="Mark all as read"
            className="text-[11px] font-bold text-[#0070BA] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center border-b border-slate-200 text-xs font-semibold bg-white px-2 pt-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors ${
            activeTab === "all" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setActiveTab("flagged")}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors flex items-center justify-center gap-1 ${
            activeTab === "flagged" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Flag className="h-3 w-3" />
          Flagged
        </button>
        <button
          onClick={() => setActiveTab("mentions")}
          className={`flex-1 pb-2 border-b-2 text-center transition-colors flex items-center justify-center gap-1 ${
            activeTab === "mentions" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AtSign className="h-3 w-3" />
          @Mentions
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <span>No notifications found</span>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2 ${
                !item.read ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                  {!item.read && <span className="h-2 w-2 rounded-full bg-[#0070BA] flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-medium text-slate-500">{item.project}</span>
                  <span className="font-mono">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => toggleFlag(item.id)}
                title={item.flagged ? "Unflag Notification" : "Flag Notification"}
                className={`p-1 rounded hover:bg-slate-100 flex-shrink-0 ${
                  item.flagged ? "text-amber-500 fill-amber-500" : "text-slate-300"
                }`}
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
