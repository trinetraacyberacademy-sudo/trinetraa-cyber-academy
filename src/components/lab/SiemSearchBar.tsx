"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Search } from "lucide-react";

const examples = [
  { query: "sourcetype=AUTHENTICATION geo", note: "keyword + field filter" },
  { query: 'sender="it-helpdesk@fakecorp-support-verify.com"', note: "quoted field value" },
  { query: "department=Finance AND sourcetype=EMAIL_GATEWAY", note: "boolean AND" },
  { query: "recipient=david.okafor@fakecorp-demo.com OR recipient=james.patel@fakecorp-demo.com", note: "boolean OR" },
  { query: "hash=a3f5c9d8e1b2f4a6", note: "pivot on a file hash" },
  { query: "url=fakecorp-portal-verify.com", note: "who received/clicked a link" },
  { query: "subject=\"Overdue Invoice\" earliest=-7d", note: "time range" },
  { query: "sourcetype=NETWORK NOT department=IT", note: "negation" },
];

export function SiemSearchBar({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();

  function runQuery(q: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/dashboard/siem?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runQuery(value);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='sourcetype=EMAIL_GATEWAY sender="..." earliest=-7d'
            className="w-full rounded-lg border border-white/10 bg-ink-900 py-2.5 pr-4 pl-9 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-signal-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-signal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-500"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          aria-label="Query syntax help"
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
            showHelp
              ? "border-signal-500/50 bg-signal-500/10 text-signal-300"
              : "border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </form>

      {showHelp && (
        <div className="absolute right-0 z-10 mt-2 w-full max-w-xl rounded-xl border border-white/10 bg-ink-900 p-4 shadow-xl">
          <p className="text-xs font-semibold text-white">TrinetraQL syntax</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Fields: sourcetype, sender, recipient, employee, department, hash, subject, ticket,
            ip, url. Combine with AND / OR / NOT. Time: earliest=-24h, earliest=2026-09-01,
            latest=...
          </p>
          <ul className="mt-3 space-y-1.5">
            {examples.map((ex) => (
              <li key={ex.query}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(ex.query);
                    setShowHelp(false);
                    runQuery(ex.query);
                  }}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/5"
                >
                  <span className="font-mono text-signal-300">{ex.query}</span>
                  <span className="ml-2 text-slate-500">— {ex.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
