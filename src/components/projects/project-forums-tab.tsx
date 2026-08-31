"use client";

import { useState } from "react";
import { Project } from "@/types";
import { MessageSquare, Pin, Bell, Plus, User, Calendar, ThumbsUp, MessageCircle } from "lucide-react";

interface ProjectForumsTabProps {
  project: Project;
}

export default function ProjectForumsTab({ project }: ProjectForumsTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const posts = [
    {
      id: "1",
      title: "[Announcement] Release Milestone 2.0 Deployment Schedule",
      author: "Project Manager",
      date: "2026-08-30",
      type: "Announcement",
      content: "Team, we have scheduled the release candidate build for Milestone 2.0 on Friday, Sep 4th. Please ensure all code reviews and regression tests are completed by Thursday evening.",
      replies: 5,
      likes: 12,
      isSticky: true,
    },
    {
      id: "2",
      title: "[Sticky] Guidelines for Submitting High-Severity Escalations",
      author: "Admin User",
      date: "2026-08-25",
      type: "Sticky",
      content: "Please review the updated SLA escalation workflow. Any critical production bugs must be tagged with URGENT priority to trigger the automated SLA SMS notification system.",
      replies: 8,
      likes: 19,
      isSticky: true,
    },
    {
      id: "3",
      title: "Best Practices for Database Migration Scripts",
      author: "Divakar Pandiy",
      date: "2026-08-20",
      type: "Discussion",
      content: "When writing Prisma schema migrations for SQLite and PostgreSQL compatibility, avoid engine-specific raw SQL constraints. Use Prisma migrations standard syntax.",
      replies: 3,
      likes: 7,
      isSticky: false,
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 rounded-md shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#0070BA]" />
            <span>Project Forums & Announcements</span>
          </h2>
          <p className="text-xs text-slate-500">Collaborate, share sticky posts, and discuss team updates.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Forum Topic</span>
        </button>
      </div>

      {/* Forum Topics List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`rounded-md border bg-white p-4 shadow-xs transition-all hover:border-[#0070BA]/50 ${
              post.isSticky ? "border-amber-300 bg-amber-50/20" : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {post.isSticky && <Pin className="h-4 w-4 text-amber-600 fill-amber-600 flex-shrink-0" />}
                <h3 className="text-sm font-bold text-slate-900 hover:text-[#0070BA] cursor-pointer">
                  {post.title}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  post.type === "Announcement"
                    ? "bg-purple-100 text-purple-800"
                    : post.type === "Sticky"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {post.type}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{post.content}</p>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {post.date}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{post.likes}</span>
                </span>
                <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{post.replies} Replies</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
