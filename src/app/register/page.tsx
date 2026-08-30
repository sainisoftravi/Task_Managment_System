"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-600">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">Register for Task & Ticket System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 pr-10 focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
