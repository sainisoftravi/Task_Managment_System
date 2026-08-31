import Link from "next/link";
import { Ticket, ShieldCheck, Layers, BarChart3, ArrowRight, Zap, Sparkles, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col font-sans selection:bg-primary-500 selection:text-white overflow-hidden relative">
      {/* Background Gradients & Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[130px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="relative z-40 border-b border-slate-800/60 bg-[#070C18]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">TaskPMP</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                Enterprise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Connected Node Network */}
      <main className="flex-1 relative z-20 max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col justify-between">
        
        {/* Animated Connecting SVG Rays Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block opacity-60">
          {/* Path to Top Right Ticket Flow */}
          <path
            d="M 500 240 C 650 200, 750 160, 820 180"
            fill="none"
            stroke="url(#gradient-cyan)"
            strokeWidth="2"
            className="animate-dash-stream"
          />
          {/* Path to Middle Right Kanban */}
          <path
            d="M 520 270 C 650 300, 720 330, 800 370"
            fill="none"
            stroke="url(#gradient-blue)"
            strokeWidth="2"
            className="animate-dash-stream"
          />
          {/* Path to Lower Right Gantt */}
          <path
            d="M 480 300 C 620 400, 700 480, 820 540"
            fill="none"
            stroke="url(#gradient-indigo)"
            strokeWidth="2"
            className="animate-dash-stream"
          />
          {/* Path to Bottom Feature Cards */}
          <path
            d="M 380 300 C 350 420, 250 500, 240 580"
            fill="none"
            stroke="url(#gradient-blue)"
            strokeWidth="1.5"
            className="animate-dash-stream"
          />
          <path
            d="M 440 300 C 470 440, 520 520, 520 580"
            fill="none"
            stroke="url(#gradient-cyan)"
            strokeWidth="1.5"
            className="animate-dash-stream"
          />

          <defs>
            <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Content & CTA */}
        <div className="relative z-20 max-w-4xl mx-auto text-center pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
            <span>Unified Ticket & Project Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12] mb-6">
            Help Desk Meets <br />
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#34D399] bg-clip-text text-transparent">
              Project Management
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Unified Ticket & Project Management Operations. Seamlessly ingest support tickets, calculate SLA metrics, convert customer issues into actionable engineering tasks with 2-way sync, and export rich Excel & PDF reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-blue-400/20"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-lg"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Demo Login (Auto-fill)</span>
            </Link>
          </div>
        </div>

        {/* Floating Right Product Showcase Cards (Connected by Glowing Nodes) */}
        <div className="hidden xl:block absolute right-0 top-16 w-96 space-y-6 pointer-events-none z-20">
          
          {/* Widget 1: Ticket Flow & SLA Metrics */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-xl animate-float-slow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" /> Ticket Flow
              </span>
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">SLA metrics</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20 pt-2">
              <div className="w-1/6 bg-blue-500 rounded-t h-3/4 animate-pulse" />
              <div className="w-1/6 bg-indigo-500 rounded-t h-full" />
              <div className="w-1/6 bg-emerald-500 rounded-t h-2/3" />
              <div className="w-1/6 bg-amber-500 rounded-t h-1/2" />
              <div className="w-1/6 bg-red-500 rounded-t h-4/5" />
              <div className="w-1/6 bg-cyan-500 rounded-t h-full animate-pulse" />
            </div>
            {/* Glowing Connection Dot */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 animate-pulse-glow" />
          </div>

          {/* Widget 2: Interactive Kanban Board Preview */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-xl animate-float-medium relative">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200">Kanban Board</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active Sync</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px]">
              <div className="bg-slate-800/80 rounded p-1.5 border border-slate-700/50">
                <span className="font-semibold text-slate-400 block mb-1">To Do</span>
                <div className="bg-slate-900 p-1 rounded text-slate-300 font-medium truncate">Fix API lag</div>
              </div>
              <div className="bg-slate-800/80 rounded p-1.5 border border-slate-700/50">
                <span className="font-semibold text-blue-400 block mb-1">In Progress</span>
                <div className="bg-slate-900 p-1 rounded text-slate-300 font-medium truncate">UI Redesign</div>
              </div>
              <div className="bg-slate-800/80 rounded p-1.5 border border-slate-700/50">
                <span className="font-semibold text-amber-400 block mb-1">Review</span>
                <div className="bg-slate-900 p-1 rounded text-slate-300 font-medium truncate">SLA Escalation</div>
              </div>
              <div className="bg-slate-800/80 rounded p-1.5 border border-slate-700/50">
                <span className="font-semibold text-emerald-400 block mb-1">Done</span>
                <div className="bg-slate-900 p-1 rounded text-slate-300 font-medium truncate">Export PDF</div>
              </div>
            </div>
            {/* Glowing Connection Dot */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/80 animate-pulse-glow" />
          </div>

          {/* Widget 3: Gantt Timeline Chart Preview */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-xl animate-float-slow relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Gantt Timeline Chart</span>
              <span className="text-[10px] text-indigo-400 font-medium">Finish-to-Start</span>
            </div>
            <div className="space-y-2 pt-1 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-400 truncate">Design</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full w-2/3 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-400 truncate">Develop</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-4/5 rounded-full ml-[20%]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-400 truncate">Deploy</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-1/3 rounded-full ml-[70%]" />
                </div>
              </div>
            </div>
            {/* Glowing Connection Dot */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/80 animate-pulse-glow" />
          </div>

        </div>

        {/* Feature Cards Grid (3 Columns matching bottom of image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 relative z-30">
          
          {/* Card 1: Help Desk & SLA Engine */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-xl relative">
            {/* Embedded Live SLA Heatmap Preview Widget */}
            <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
                <span>SLA Heatmap Status</span>
                <span className="text-emerald-400 font-semibold">98.4% Compliant</span>
              </div>
              <div className="grid grid-cols-6 gap-1 h-10">
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-blue-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-amber-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-blue-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
                <div className="bg-red-500/80 rounded" />
                <div className="bg-emerald-500/80 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Help Desk & SLA Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated SLA timers, priority escalations, public vs. private agent threading, and direct knowledge base linkages.
            </p>
            {/* Top Node Connector */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/80 animate-pulse-glow" />
          </div>

          {/* Card 2: Work Breakdown Structure */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-xl relative">
            {/* Embedded Doughnut Analytics Preview Widget */}
            <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 font-medium">WBS Completion</span>
                <span className="text-lg font-black text-white">84.2%</span>
                <span className="block text-[9px] text-slate-500">24 Tasks Remaining</span>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-emerald-400 border-r-cyan-400 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                84%
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                Work Breakdown Structure
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hierarchical projects, milestones, task lists, subtasks, drag-and-drop Kanban boards, and Gantt charts with dependencies.
            </p>
            {/* Top Node Connector */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/80 animate-pulse-glow" />
          </div>

          {/* Card 3: Excel & PDF Reports */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-xl relative">
            {/* Embedded Spreadsheet & PDF Export Preview Widget */}
            <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Open_Items.xlsx
                </span>
                <span className="text-slate-400 font-mono">=SUM(F2:F50)</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" /> Executive_Summary.pdf
                </span>
                <span className="text-slate-400">KPI Report</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Excel & PDF Reports
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate formatted multi-tab Excel workbooks with `=SUM` formulas and executive summary PDF reports on-demand.
            </p>
            {/* Top Node Connector */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse-glow" />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-30 border-t border-slate-800/60 bg-[#070C18]/90 py-8 text-xs text-slate-500 text-center backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TaskPMP System. Unified Ticket & Project Management Operations.</p>
          <div className="flex gap-6 text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
