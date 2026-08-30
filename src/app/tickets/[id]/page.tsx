"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Ticket as TicketType,
  TicketComment,
  KnowledgeBaseArticle,
  TimeLog,
  Task,
  Project,
  TaskPriority,
  TaskStatus,
} from "@/types";
import { colorForPriority, colorForStatus, formatDateTime, generateTicketKey } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/utils";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  LinkIcon,
  Clock,
  User,
  AlertCircle,
  FileText,
  Split,
  Copy,
  TrendingUp,
  Bell,
  Check,
  Search,
  X,
} from "lucide-react";

interface TicketDetailProps {
  params: { id: string };
}

export default function TicketDetailPage({ params }: TicketDetailProps) {
  const { id } = params;
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [convertedTask, setConvertedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentType, setCommentType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [showKbSelector, setShowKbSelector] = useState(false);
  const [kbSearch, setKbSearch] = useState("");
  const [availableKb, setAvailableKb] = useState<KnowledgeBaseArticle[]>([]);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [childTicketTitle, setChildTicketTitle] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [convertProjectId, setConvertProjectId] = useState("");

    const headers = getAuthHeaders();

  useEffect(() => {
    fetchTicket();
    fetchComments();
    fetchKbArticles();
    fetchTimeLogs();
    fetchProjects();
  }, [id]);

  async function fetchTicket() {
    const res = await fetch(`/api/tickets/${id}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTicket(data.ticket);
      if (data.ticket.convertedTask) {
        setConvertedTask(data.ticket.convertedTask);
      }
    }
    setLoading(false);
  }

  async function fetchComments() {
    const res = await fetch(`/api/tickets/${id}/comments`, { headers });
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
  }

  async function fetchKbArticles() {
    const res = await fetch(`/api/tickets/${id}/kb`, { headers });
    if (res.ok) {
      const data = await res.json();
      setKbArticles(data.articles);
    }
  }

  async function fetchTimeLogs() {
    const res = await fetch(`/api/tickets/${id}/time-logs`, { headers });
    if (res.ok) {
      const data = await res.json();
      setTimeLogs(data.timeLogs);
    }
  }

  async function fetchProjects() {
    const res = await fetch("/api/projects", { headers });
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
    }
  }

  async function fetchAvailableKb() {
    const res = await fetch("/api/kb?published=true", { headers });
    if (res.ok) {
      const data = await res.json();
      setAvailableKb(data.articles);
    }
  }

  async function addComment() {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/tickets/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ content: commentText, type: commentType }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev].reverse());
      setCommentText("");
    }
  }

  async function linkKbArticle(articleId: string) {
    const res = await fetch(`/api/tickets/${id}/kb`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ articleId }),
    });
    if (res.ok) {
      setShowKbSelector(false);
      fetchKbArticles();
    }
  }

  async function unlinkKbArticle(articleId: string) {
    const res = await fetch(`/api/tickets/${id}/kb?articleId=${articleId}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      setKbArticles((prev) => prev.filter((a) => a.id !== articleId));
    }
  }

  async function convertTicketToTask() {
    if (!convertProjectId) return;
    const res = await fetch("/api/bridge/tickets-to-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ ticketId: id, projectId: convertProjectId }),
    });
    if (res.ok) {
      const data = await res.json();
      setConvertedTask(data.task);
      setShowConvertForm(false);
      fetchTicket();
    }
  }

  async function createChildTicket() {
    if (!childTicketTitle.trim()) return;
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        title: childTicketTitle,
        description: `Split from ticket ${generateTicketKey(id)}. Original: ${ticket?.title}`,
        priority: ticket?.priority,
        status: "OPEN",
        category: ticket?.category,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setShowSplitForm(false);
      setChildTicketTitle("");
      router.push(`/tickets/${data.ticket.id}`);
    }
  }

  if (loading) {
    return <div className="p-6">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="p-6 text-center text-slate-500">Ticket not found</div>;
  }

  const filteredKb = availableKb.filter((a) =>
    a.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
    a.tags?.some((t) => t.toLowerCase().includes(kbSearch.toLowerCase())),
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm text-slate-500">{generateTicketKey(ticket.id)}</span>
          <h1 className="text-xl font-bold text-slate-900">{ticket.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {ticket.slaBreached && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              <AlertCircle className="h-3 w-3" /> SLA Breached
            </span>
          )}
          <button
            onClick={() => setShowConvertForm(true)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Copy className="h-4 w-4" /> Convert to Task
          </button>
        </div>
      </div>

      {/* Header metadata */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded px-2 py-1 text-xs font-medium ${colorForPriority(ticket.priority)}`}>
            {ticket.priority} Priority
          </span>
          <span className={`rounded px-2 py-1 text-xs font-medium ${colorForStatus(ticket.status)}`}>
            {ticket.status.replace("_", " ")}
          </span>
          {ticket.category && (
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">{ticket.category}</span>
          )}
          {ticket.customer && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
              <User className="h-3 w-3" /> {ticket.customer.name}
            </span>
          )}
          {ticket.dueDate && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              <Bell className="h-3 w-3" /> Due {formatDateTime(ticket.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSplitForm(true)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          <Split className="h-4 w-4" /> Split Ticket
        </button>
        <button
          onClick={() => { setShowKbSelector(true); fetchAvailableKb(); }}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          <LinkIcon className="h-4 w-4" /> Link KB Article
        </button>
      </div>

      {/* KB Articles */}
      {kbArticles.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Linked Knowledge Base Articles</h3>
          <div className="space-y-2">
            {kbArticles.map((article) => (
              <div key={article.id} className="flex items-start justify-between rounded-md border border-slate-200 p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-600" />
                    <span className="font-medium text-slate-900">{article.title}</span>
                  </div>
                  {article.summary && <p className="mt-1 text-sm text-slate-600">{article.summary}</p>}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {article.tags?.map((tag) => (
                      <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.25 text-xs text-slate-600">#{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => unlinkKbArticle(article.id)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Unlink article"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Converted task display */}
      {convertedTask && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">Converted to Project Task</h3>
          <Link
            href={`/projects/${convertedTask.project?.id}/tasks/${convertedTask.id}`}
            className="mt-1 block font-medium text-emerald-700 hover:text-emerald-800"
          >
            {convertedTask.title} — in {convertedTask.project?.name}
          </Link>
        </div>
      )}

      {/* Time logs for this ticket */}
      {timeLogs.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Time Logged</h3>
          <div className="space-y-2">
            {timeLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{log.user?.name || "Unknown"} — {log.description}</span>
                <span className="font-medium">
                  {formatDuration(log.durationMinutes)}
                  <span className={`ml-1 text-xs ${log.billableType === "BILLABLE" ? "text-emerald-600" : "text-slate-500"}`}>
                    ({log.billableType === "BILLABLE" ? "Billable" : "Non-billable"})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments section */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Conversation</h3>
          <div className="mt-1 flex gap-2">
            <button
              onClick={() => setCommentType("PUBLIC")}
              className={`px-3 py-1 text-xs font-medium ${
                commentType === "PUBLIC"
                  ? "rounded-md bg-blue-100 text-blue-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Public Reply
            </button>
            <button
              onClick={() => setCommentType("PRIVATE")}
              className={`px-3 py-1 text-xs font-medium ${
                commentType === "PRIVATE"
                  ? "rounded-md bg-slate-100 text-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Internal Note
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={commentType === "PUBLIC" ? "Write a public reply..." : "Write an internal note..."}
              className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
              rows={3}
            />
            <button
              onClick={addComment}
              disabled={!commentText.trim()}
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`border-b border-slate-100 p-4 ${comment.type === "PRIVATE" ? "bg-slate-50" : "bg-white"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                  {comment.author?.name?.[0] || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {comment.author?.name || comment.author?.email || "Unknown"}
                    </span>
                    <span className={`text-xs ${comment.type === "PRIVATE" ? "text-slate-500" : "text-blue-600"}`}>
                      {comment.type === "PRIVATE" ? "Internal Note" : "Public Reply"}
                    </span>
                    <span className="text-xs text-slate-400">{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <div
                    className="mt-1 text-sm text-slate-700"
                    dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, "<br>") }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Ticket Modal */}
      {showSplitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Split Ticket</h3>
            <p className="mt-1 text-sm text-slate-600">
              Create a new child ticket from this one. The current ticket will be updated with a reference.
            </p>
            <input
              type="text"
              placeholder="Child ticket title"
              value={childTicketTitle}
              onChange={(e) => setChildTicketTitle(e.target.value)}
              className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSplitForm(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={createChildTicket}
                disabled={!childTicketTitle.trim()}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Create Child Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KB Selector Modal */}
      {showKbSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Link Knowledge Base Article</h3>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
                className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500"
              />
            </div>
            <div className="mt-3 max-h-64 overflow-y-auto">
              {filteredKb.map((article) => (
                <button
                  key={article.id}
                  onClick={() => linkKbArticle(article.id)}
                  className="w-full rounded-md border border-slate-200 p-3 text-left hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-900">{article.title}</div>
                  {article.summary && <p className="text-sm text-slate-600">{article.summary}</p>}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowKbSelector(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Task Modal */}
      {showConvertForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Convert Ticket to Task</h3>
            <p className="mt-1 text-sm text-slate-600">
              This will create a project task linked to this ticket. Status updates will sync bidirectionally.
            </p>
            <select
              value={convertProjectId}
              onChange={(e) => setConvertProjectId(e.target.value)}
              className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.key})</option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConvertForm(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={convertTicketToTask}
                disabled={!convertProjectId}
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
