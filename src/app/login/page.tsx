"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@taskpmp.local");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your email & password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDemo = () => {
    setEmail("admin@taskpmp.local");
    setPassword("admin123");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Left Form Column */}
      <div className="flex flex-1 flex-col justify-between px-8 py-12 sm:px-16 lg:px-20 xl:px-24 bg-white shadow-xl z-10 border-r border-slate-100">
        <div className="mx-auto w-full max-w-md my-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Log in to your account</h1>
            <p className="mt-2 text-sm text-slate-500">Please enter your details to access your workspace</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full rounded-lg border border-slate-300 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-300 pl-11 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">Remember for 30 days</span>
              </label>

              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Auto-fill demo credentials
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-[#0070BA] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#005ea6] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">OR</span>
              </div>
            </div>

            {/* Secondary Demo Action Button */}
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none transition-all cursor-pointer"
            >
              <KeyRound className="h-4 w-4 text-slate-500" />
              <span>Log in with Demo Credentials</span>
            </button>
          </form>

          {/* Terms Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            By creating an account, you agree to our{" "}
            <Link href="/register" className="font-medium text-slate-700 underline hover:text-slate-900">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/register" className="font-medium text-slate-700 underline hover:text-slate-900">
              Privacy Policy
            </Link>.
          </div>
        </div>

        {/* Bottom Signup Link */}
        <div className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Right Vibrant Blue Graphic Column */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden bg-gradient-to-br from-[#0B57D0] via-[#0842A0] to-[#041E49] p-12 lg:p-16 flex-col justify-between">
        {/* Top Text */}
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Empowering unified support & dev teams
          </h2>
          <p className="mt-3 text-base text-blue-100/80 font-normal">
            Ticket ingestion, SLA management, interactive Gantt charts, and automated Excel & PDF exports.
          </p>
        </div>

        {/* Floating 3D Angled Mockup Tablet */}
        <div className="relative z-10 my-auto flex items-center justify-center pt-8">
          <div className="transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 ease-out shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 bg-slate-900/50 backdrop-blur-md max-w-2xl">
            <img
              src="/dashboard-preview.jpg"
              alt="TaskPMP Dashboard Mockup"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Decorative ambient background curves */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
