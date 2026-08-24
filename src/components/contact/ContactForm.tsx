"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiryAction, type EnquiryState } from "@/lib/actions/enquiry";
import { waLink } from "@/lib/site-data";

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-signal-500 focus:ring-signal-500/20"
  }`;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<EnquiryState["fieldErrors"]>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const result = await submitEnquiryAction({ name, email, phone, message });

    setSubmitting(false);
    if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-signal-200 bg-signal-50 px-6 py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-signal-600" />
        <p className="font-display text-lg font-semibold text-slate-900">
          Thanks — we&apos;ve got your message
        </p>
        <p className="text-sm text-slate-600">
          We&apos;ll get back to you shortly. For anything urgent,{" "}
          <a
            href={waLink("Hi, I have an urgent question about Trinetraa Cyber Academy.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-signal-700 hover:underline"
          >
            WhatsApp us directly
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-semibold text-signal-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass(!!fieldErrors?.name)}
          placeholder="Your name"
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
        />
        {fieldErrors?.phone && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={inputClass(!!fieldErrors?.message)}
          placeholder="What would you like to know?"
        />
        {fieldErrors?.message && (
          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-signal-600/20 transition-all duration-200 hover:bg-signal-700 hover:shadow-lg hover:shadow-signal-600/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending..." : "Send Message"}
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </button>
    </form>
  );
}
