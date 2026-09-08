"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { assignToMe } from "@/app/dashboard/(lab)/tickets/actions";

export function AssignToMeButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await assignToMe(ticketId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-signal-500/30 bg-signal-500/10 px-2.5 py-1 text-xs font-semibold text-signal-300 hover:bg-signal-500/20 disabled:opacity-60"
    >
      <UserPlus className="h-3 w-3" />
      {isPending ? "Assigning…" : "Assign to Me"}
    </button>
  );
}
