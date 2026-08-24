"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerAction, type RegisterState } from "@/lib/actions/register";

type CourseOption = {
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  format: string;
};

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-signal-500 focus:ring-signal-500/20"
  }`;

export function RegisterForm({
  courses,
  defaultCourseSlug,
}: {
  courses: CourseOption[];
  defaultCourseSlug?: string;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [courseSlug, setCourseSlug] = useState(
    defaultCourseSlug && courses.some((c) => c.slug === defaultCourseSlug)
      ? defaultCourseSlug
      : (courses[0]?.slug ?? ""),
  );

  const [fieldErrors, setFieldErrors] = useState<RegisterState["fieldErrors"]>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const result = await registerAction({ name, email, phone, password, courseSlug });

    if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
      setSubmitting(false);
      return;
    }
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      // Account was created but auto sign-in failed — send them to log in manually.
      setSubmitting(false);
      router.push("/login");
      return;
    }

    router.push(`/register/payment?course=${encodeURIComponent(courseSlug)}`);
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
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass(!!fieldErrors?.name)}
          placeholder="Your full name"
          autoComplete="name"
        />
        {fieldErrors?.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass(!!fieldErrors?.email)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {fieldErrors?.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass(!!fieldErrors?.phone)}
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
        {fieldErrors?.phone && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass(!!fieldErrors?.password)} pr-11`}
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
        {fieldErrors?.password && (
          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
        )}
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-slate-700">Choose your program</p>
        <div className="space-y-2.5">
          {courses.map((course) => {
            const active = course.slug === courseSlug;
            return (
              <label
                key={course.slug}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
                  active
                    ? "border-signal-500 bg-signal-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="course"
                    value={course.slug}
                    checked={active}
                    onChange={() => setCourseSlug(course.slug)}
                    className="h-4 w-4 accent-signal-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.format}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    ₹{course.price.toLocaleString("en-IN")}
                  </p>
                  {course.originalPrice && (
                    <p className="text-xs text-slate-400 line-through">
                      ₹{course.originalPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {fieldErrors?.courseSlug && (
          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.courseSlug}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-signal-600/20 transition-all duration-200 hover:bg-signal-700 hover:shadow-lg hover:shadow-signal-600/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Creating your account..." : "Continue to Payment"}
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        Already registered?{" "}
        <a href="/login" className="font-semibold text-signal-700 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
