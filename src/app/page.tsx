import Link from "next/link";
import { Ticket, Layers, ShieldCheck, BarChart3, Clock, ArrowRight, CheckCircle2, Zap, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TaskPMP <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-semibold ml-1">Enterprise</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:scale-[1.02] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 flex-1">
        {/* Glowing Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-primary-600/20 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold text-primary-300 mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" />
            <span>Unified Ticket & Project Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15] mb-6">
            Help Desk ticketing meets <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Project Management Excellence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Inspired by Zoho Desk & Zoho Projects. Seamlessly ingest support tickets, calculate SLA metrics, convert customer issues into actionable engineering tasks with 2-way sync, and export rich Excel & PDF reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-600/30 hover:bg-primary-500 hover:scale-[1.02] transition-all"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-sm"
            >
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Demo Login (Auto-fill)</span>
            </Link>
          </div>

          {/* Key Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Help Desk & SLA Engine</h3>
              <p className="text-sm text-slate-400">
                Automated SLA timers, priority escalations, public vs. private agent threading, and direct knowledge base linkages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Work Breakdown Structure</h3>
              <p className="text-sm text-slate-400">
                Hierarchical projects, milestones, task lists, subtasks, drag-and-drop Kanban boards, and Gantt charts with dependencies.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Excel & PDF Reports</h3>
              <p className="text-sm text-slate-400">
                Generate formatted multi-tab Excel workbooks with `=SUM` formulas and executive summary PDF reports on-demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TaskPMP System. Unified Ticket & Project Management.</p>
          <div className="flex gap-6 text-slate-400">
            <Link href="/login" className="hover:text-white">Sign In</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
