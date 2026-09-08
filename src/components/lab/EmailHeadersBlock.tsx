"use client";

import { useState } from "react";
import { ChevronRight, Check, Copy, Code2 } from "lucide-react";

export function EmailHeadersBlock({ rawHeaders }: { rawHeaders: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(rawHeaders);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — no-op,
      // the header text is still visible to select and copy manually.
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-ink-950">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Code2 className="h-3.5 w-3.5" />
          Email Headers
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </span>
        {expanded && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy for header analyzer
              </>
            )}
          </span>
        )}
      </button>
      {expanded && (
        <pre className="max-h-64 overflow-auto border-t border-white/10 px-3 py-2.5 font-mono text-[11px] leading-5 whitespace-pre-wrap text-slate-300">
          {rawHeaders}
        </pre>
      )}
    </div>
  );
}
