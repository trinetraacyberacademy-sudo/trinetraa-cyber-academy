import { LabHeader } from "@/components/lab/LabHeader";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      <LabHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
