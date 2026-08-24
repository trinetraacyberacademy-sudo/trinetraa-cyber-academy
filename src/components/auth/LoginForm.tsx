"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-signal-500 focus:ring-signal-500/20"
  }`;

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password. Please try again.");
      setSubmitting(false);
      return;
    }

    const session = await getSession();
    router.push(session?.user?.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass(!!error)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass(!!error)} pr-11`}
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-signal-600/20 transition-all duration-200 hover:bg-signal-700 hover:shadow-lg hover:shadow-signal-600/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Logging in..." : "Log In"}
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        New here?{" "}
        <a href="/register" className="font-semibold text-signal-700 hover:underline">
          Register for a program
        </a>
      </p>
    </form>
  );
}
