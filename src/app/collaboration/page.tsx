"use client";

import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Plus,
  Search,
  Send,
  ThumbsUp,
  MessageCircle,
  Share2,
  BookOpen,
  Layers,
  Tag,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  Pin,
  CheckCircle2,
  X
} from "lucide-react";

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "forums" | "kb">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: "p-1",
      author: "Ravi Saini",
      avatar: "RS",
      role: "Project Manager",
      time: "10 mins ago",
      pinned: true,
      title: "🚀 Command Center Automation v2.4 Deployed",
      content:
        "We have successfully pushed the latest Workflow Automation Rules engine and dynamic project prefix generators to production. All portal configurations are now live!",
      likes: 8,
      comments: [
        { id: "c-1", author: "Sushil Verma", time: "5 mins ago", text: "Great work team! Testing the sequential key generator now." },
      ],
      tags: ["Release", "Automation"],
    },
    {
      id: "p-2",
      author: "Amin Ibrahim",
      avatar: "AI",
      role: "Lead Engineer",
      time: "1 hour ago",
      pinned: false,
      title: "📋 Site Inspection & Construction Checklist Updated",
      content:
        "Updated Jindal site incharge primary checklist with load testing and concrete work phases. Please review the updated task lists under DT-01 project.",
      likes: 4,
      comments: [],
      tags: ["SiteInspection", "WBS"],
    },
  ]);

  const [forumTopics, setForumTopics] = useState([
    { id: "ft-1", category: "Technical & Architecture", title: "API Webhook Integration Best Practices", replies: 12, views: 145, lastActive: "2 hours ago" },
    { id: "ft-[#0070BA]", category: "Client Delivery", title: "Site Load Testing Standard Operating Procedures", replies: 8, views: 98, lastActive: "1 day ago" },
    { id: "ft-3", category: "General", title: "Q3 Project Milestone Review & Sprint Goals", replies: 24, views: 310, lastActive: "3 days ago" },
  ]);

  const [selectedKbCategory, setSelectedKbCategory] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const [kbArticles, setKbArticles] = useState([
    {
      id: "kb-1",
      category: "Project Management",
      title: "Project Creation & Sequential Key Auto-Generation Guide",
      readTime: "5 min read",
      updated: "Updated Today",
      summary: "Master creating projects from scratch, auto-generating sequential project keys (DT-01, DT-02), and managing task lists.",
      uses: "Used by Project Managers and Team Leads to initialize new client projects with structured task lists and clean data isolation.",
      steps: [
        { title: "Step 1: Open Projects Hub", desc: "Navigate to the Projects menu (/projects) and click the + New Project button at top right." },
        { title: "Step 2: Auto Project Prefix", desc: "The Project Prefix / ID field automatically calculates the highest existing prefix (e.g. DT-31) and pre-fills the next key (DT-32)." },
        { title: "Step 3: Select Template Option", desc: "Choose Create from Scratch (Blank) for clean 0 tasks initialization, or select a pre-built template layout." },
        { title: "Step 4: Save & Access", desc: "Click Save Project to validate and persist the project. Open the project and click + Add Task List to define deliverable groups." },
      ],
      bestPractices: "Always set realistic start and due dates. Use project prefix defaults configured under Setup > Project Settings."
    },
    {
      id: "kb-2",
      category: "Workflow Rules",
      title: "Configuring Visual Workflow Automation Rules & Searchable Criteria",
      readTime: "8 min read",
      updated: "Updated Yesterday",
      summary: "Learn how to build automated workflow rules using visual flow diagrams, multi-field triggers, condition criteria, and action associations.",
      uses: "Automates repetitive task assignment notifications, email alerts, WhatsApp updates, and field changes upon user action or dates.",
      steps: [
        { title: "Step 1: Navigate to Setup", desc: "Open Setup (gear icon) -> AUTOMATION -> Workflow Rules. Click + Create Rule." },
        { title: "Step 2: Define Execution Mode", desc: "Select Based on User action (e.g. When Task is Created or Status Changed) or Based on Date & Time." },
        { title: "Step 3: Select Triggers", desc: "Pick trigger actions (is Created, is Updated, Document attached) and choose target fields." },
        { title: "Step 4: Add Condition Criteria", desc: "In Condition 1 - Criteria block, pick searchable fields (Project Name, Task Status), operators (Is, Contains), and target values." },
        { title: "Step 5: Associate Actions", desc: "Click + Add Action popover and choose Update Field, Associate Webhook, Associate Custom Function, or Associate Email Alert." },
      ],
      bestPractices: "Test workflow rules on a demo project first before turning on production email or webhook notifications."
    },
    {
      id: "kb-3",
      category: "Time Tracking",
      title: "Logging Work Hours & Timesheet Submission Approval SOP",
      readTime: "6 min read",
      updated: "Updated 2 days ago",
      summary: "Complete guide for logging billable/non-billable work hours, running task timers, exporting timesheets, and manager approvals.",
      uses: "Ensures accurate time tracking across client projects, billable ratio monitoring, and streamlined manager approvals.",
      steps: [
        { title: "Step 1: Start Task Timers", desc: "Open any Task Detail Drawer and click the Play/Pause timer control or click + Log Time." },
        { title: "Step 2: Enter Work Log", desc: "Specify total hours, work date, billing type (Billable/Non-Billable), and work description notes." },
        { title: "Step 3: Submit Timesheet", desc: "Go to Time Logs (/time-tracking) -> Click Export / Submit for weekly or monthly manager review." },
        { title: "Step 4: Manager Approval", desc: "Managers navigate to My Approvals (/my-approvals) to review, Approve, Reject (with comments), or Recall submissions." },
      ],
      bestPractices: "Log work hours daily to maintain accurate real-time resource allocation metrics on the Home Dashboard."
    },
    {
      id: "kb-4",
      category: "Help Desk",
      title: "SLA Policy Engine & Ticket-to-Task Bridge SOP",
      readTime: "7 min read",
      updated: "Updated 3 days ago",
      summary: "Understand SLA response and resolution breach timers, priority escalations, and converting support tickets into project tasks.",
      uses: "Maintains high customer satisfaction by enforcing response SLAs and bridging support tickets into engineering deliverables.",
      steps: [
        { title: "Step 1: Ticket Logging", desc: "Navigate to Tickets (/tickets) -> Click + New Ticket. Set priority (Urgent, High, Medium, Low)." },
        { title: "Step 2: Automatic SLA Calculation", desc: "The SLA Engine calculates response target (e.g. 1.2 hrs) and resolution breach deadlines automatically." },
        { title: "Step 3: Ticket-to-Task Bridge", desc: "Open ticket details -> Click Bridge to Task to create an linked engineering task in a target project." },
        { title: "Step 4: Ticket Resolution", desc: "Mark ticket status as RESOLVED or CLOSED when the task deliverable is completed." },
      ],
      bestPractices: "Address Urgent SLA tickets immediately to maintain a 100% SLA Compliance Rate on the Portal Home Dashboard."
    },
    {
      id: "kb-5",
      category: "Setup",
      title: "Multi-Tenant Portal Configuration & Custom URL Setup",
      readTime: "4 min read",
      updated: "Updated 4 days ago",
      summary: "How to configure organization name, custom portal URL slug (https://taskpmp.app/portal/digitaltwin), and default project prefixes.",
      uses: "Customizes branding and portal routing for enterprise organizations.",
      steps: [
        { title: "Step 1: Access Portal Configuration", desc: "Navigate to Setup -> PORTAL CONFIGURATION -> Configuration." },
        { title: "Step 2: Update Organization Profile", desc: "Click the edit icon next to Company Name to update your organization name." },
        { title: "Step 3: Change Portal URL", desc: "In the Portal URL Change section, click Edit URL to customize your portal slug (e.g. digitaltwin). Click Save URL." },
        { title: "Step 4: Configure Project Prefix", desc: "Go to Project Settings under PORTAL CONFIGURATION and set your default Project Prefix (e.g. DT)." },
      ],
      bestPractices: "Only Portal Admins should modify global portal URL slugs to ensure continuous team access."
    },
  ]);

  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAddPost = () => {
    if (!newContent.trim()) {
      alert("Please enter post content.");
      return;
    }

    const newEntry = {
      id: `p-${Date.now()}`,
      author: "Ravi Saini",
      avatar: "RS",
      role: "Project Manager",
      time: "Just now",
      pinned: false,
      title: newTitle.trim() || "Team Announcement",
      content: newContent.trim(),
      likes: 0,
      comments: [],
      tags: ["TeamUpdate"],
    };

    setPosts([newEntry, ...posts]);
    setNewTitle("");
    setNewContent("");
    setShowNewPostModal(false);
    alert("Post published successfully to Team Collaboration feed!");
  };

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              { id: `c-${Date.now()}`, author: "Ravi Saini", time: "Just now", text: text.trim() },
            ],
          };
        }
        return p;
      })
    );

    setCommentInput({ ...commentInput, [postId]: "" });
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Collaboration Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 bg-white p-4 -m-6 mb-2 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Collaboration Hub</h1>
          <p className="text-xs text-slate-500">
            Team feed updates, announcements, project forums, knowledge base articles, and live discussions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0070BA] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs View Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 text-xs font-bold pt-2 bg-white px-4 rounded-t-lg">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("feed")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "feed" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Team Status Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("forums")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "forums" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Project Forums</span>
          </button>

          <button
            onClick={() => setActiveTab("kb")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "kb" ? "border-[#0070BA] text-[#0070BA]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Knowledge Base (KB)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 rounded-md border border-slate-200 pl-8 pr-3 py-1 text-xs focus:border-[#0070BA] focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: TEAM STATUS FEED */}
      {activeTab === "feed" && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Quick Post Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0070BA] text-white font-bold flex items-center justify-center text-xs">
                RS
              </div>
              <input
                type="text"
                placeholder="Share an update, announcement, or status with the team..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPostText.trim()) {
                    setNewContent(newPostText);
                    setNewPostText("");
                    handleAddPost();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-[#0070BA] focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newPostText.trim()) {
                    setNewContent(newPostText);
                    setNewPostText("");
                    handleAddPost();
                  } else {
                    setShowNewPostModal(true);
                  }
                }}
                className="bg-[#0070BA] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts
              .filter(
                (p) =>
                  !searchQuery ||
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-400 text-amber-900 font-bold flex items-center justify-center text-xs border border-amber-300">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{post.author}</h4>
                          <span className="text-[10px] text-slate-400">({post.role})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                      </div>
                    </div>

                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0070BA] text-[10px] font-bold border border-blue-200">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">{post.title}</h3>
                    <p className="text-slate-700 leading-relaxed text-xs">{post.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 hover:text-[#0070BA] cursor-pointer"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-blue-600" />
                        <span>{post.likes} Likes</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-slate-500" />
                        <span>{post.comments.length} Comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-lg space-y-2 border border-slate-100">
                      {post.comments.map((c) => (
                        <div key={c.id} className="text-xs space-y-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{c.author}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-slate-700">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInput[post.id] || ""}
                      onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment(post.id);
                      }}
                      className="flex-1 rounded border border-slate-200 px-3 py-1.5 text-xs focus:border-[#0070BA] focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold cursor-pointer text-xs"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT FORUMS */}
      {activeTab === "forums" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Discussion Forums</h3>
              <p className="text-slate-500 text-xs">Participate in technical architecture, client delivery, and general project threads</p>
            </div>
            <button
              onClick={() => {
                const topicName = prompt("Enter Forum Topic Title:");
                if (topicName && topicName.trim()) {
                  setForumTopics([
                    { id: `ft-${Date.now()}`, category: "General", title: topicName.trim(), replies: 0, views: 1, lastActive: "Just now" },
                    ...forumTopics,
                  ]);
                  alert("Forum topic created successfully!");
                }
              }}
              className="bg-[#0070BA] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              + Create Topic
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">TOPIC TITLE</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4 text-center">REPLIES</th>
                  <th className="py-3 px-4 text-center">VIEWS</th>
                  <th className="py-3 px-4 text-right">LAST ACTIVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {forumTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <td className="py-3.5 px-4 font-bold text-slate-900 hover:text-[#0070BA]">
                      {topic.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0070BA] text-[10px] font-bold border border-blue-200">
                        {topic.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">{topic.replies}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">{topic.views}</td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">{topic.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KNOWLEDGE BASE (KB) */}
      {activeTab === "kb" && (
        <div className="space-y-4 font-sans text-xs">
          {/* KB Top Header Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Learning Materials &amp; Knowledge Base</h3>
              <p className="text-slate-500 text-xs">Step-by-step feature guides, system uses, procedures, and practical tutorials</p>
            </div>
            <button
              onClick={() => {
                const title = prompt("Enter KB Article Title:");
                if (title && title.trim()) {
                  setKbArticles([
                    {
                      id: `kb-${Date.now()}`,
                      category: "General Documentation",
                      title: title.trim(),
                      readTime: "3 min read",
                      updated: "Just now",
                      summary: "Custom user guide for " + title.trim(),
                      uses: "Internal process reference guide.",
                      steps: [
                        { title: "Step 1: Introduction", desc: "Overview of " + title.trim() },
                        { title: "Step 2: Execution", desc: "Follow step-by-step instructions for completing procedure." },
                      ],
                      bestPractices: "Keep guides updated regularly."
                    },
                    ...kbArticles,
                  ]);
                  alert("KB Article published successfully!");
                }
              }}
              className="bg-[#0070BA] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              + Write KB Article
            </button>
          </div>

          {/* Module Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {["ALL", "Project Management", "Workflow Rules", "Time Tracking", "Help Desk", "Setup"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedKbCategory(cat)}
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedKbCategory === cat
                    ? "bg-[#0070BA] text-white border-[#0070BA] font-bold shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat === "ALL" ? "All Modules" : cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kbArticles
              .filter(
                (a) =>
                  (selectedKbCategory === "ALL" || a.category === selectedKbCategory) &&
                  (!searchQuery ||
                    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.summary.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0070BA] hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0070BA] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                      {article.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{article.readTime}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0070BA] flex items-center justify-between gap-2">
                    <span>{article.title}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0070BA] transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                  </h4>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{article.summary}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[#0070BA] font-bold">
                      <BookOpen className="h-3 w-3" /> Learn Feature Steps &amp; Uses
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{article.updated}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Announcement / Post</h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Announcement title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2.5 text-xs font-semibold focus:border-[#0070BA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Content</label>
                <textarea
                  rows={4}
                  placeholder="Write your announcement content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2.5 text-xs focus:border-[#0070BA] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddPost}
                className="px-5 py-2 bg-[#0070BA] hover:bg-blue-700 text-white font-bold rounded-md cursor-pointer"
              >
                Publish Announcement
              </button>
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Material Article Reader Drawer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slideLeft text-xs overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#0070BA] font-bold text-[10px]">
                  {selectedArticle.category}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">{selectedArticle.title}</h2>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                  <span>⏱️ {selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>🗓️ {selectedArticle.updated}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="h-8 w-8 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Article Content Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Summary Box */}
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0070BA]">Overview &amp; Executive Summary</h4>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedArticle.summary}</p>
              </div>

              {/* Business Uses */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-[#0070BA]" />
                  <span>Primary Business Uses &amp; Scenarios</span>
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedArticle.uses}
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <span>Step-by-Step Execution Guide</span>
                </h4>

                <div className="space-y-3">
                  {selectedArticle.steps?.map((step: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1 hover:border-[#0070BA]/50 transition-colors">
                      <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-[#0070BA] text-white flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span>{step.title}</span>
                      </h5>
                      <p className="text-slate-600 text-xs pl-7 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              {selectedArticle.bestPractices && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Best Practice Recommendation</span>
                  </h4>
                  <p className="text-xs text-emerald-900 font-medium">{selectedArticle.bestPractices}</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between sticky bottom-0">
              <span className="text-[11px] text-slate-500 font-semibold">Was this guide helpful?</span>
              <button
                onClick={() => {
                  alert("Thank you for your feedback!");
                  setSelectedArticle(null);
                }}
                className="px-4 py-2 bg-[#0070BA] hover:bg-blue-700 text-white font-bold rounded-md cursor-pointer text-xs"
              >
                Close Learning Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
