import { ReactNode } from "react";
import clsx from "clsx";

export function Badge({
  children,
  tone = "signal",
  className,
}: {
  children: ReactNode;
  tone?: "signal" | "flare" | "neutral";
  className?: string;
}) {
  const tones = {
    signal: "bg-signal-50 text-signal-700 border-signal-200",
    flare: "bg-flare-50 text-flare-700 border-flare-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
