type Bucket = { label: string; count: number };

function buildBuckets(timestamps: Date[]): Bucket[] {
  if (timestamps.length === 0) return [];

  const sorted = [...timestamps].sort((a, b) => a.getTime() - b.getTime());
  const spanMs = sorted[sorted.length - 1].getTime() - sorted[0].getTime();
  const useHourly = spanMs <= 1000 * 60 * 60 * 48; // <= 48h span buckets by hour, else by day

  const keyOf = (d: Date) =>
    useHourly
      ? `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCHours()}`
      : `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

  const labelOf = (d: Date) =>
    useHourly
      ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit" })
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const counts = new Map<string, { label: string; count: number; sortKey: number }>();
  for (const d of sorted) {
    const key = keyOf(d);
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { label: labelOf(d), count: 1, sortKey: d.getTime() });
    }
  }

  return [...counts.values()].sort((a, b) => a.sortKey - b.sortKey);
}

export function SiemTimeline({ timestamps }: { timestamps: Date[] }) {
  const buckets = buildBuckets(timestamps);
  if (buckets.length === 0) return null;

  const max = Math.max(...buckets.map((b) => b.count));
  const width = 800;
  const height = 120;
  const barGap = 4;
  const barWidth = Math.max(4, (width - barGap * (buckets.length - 1)) / buckets.length);

  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
      <p className="mb-3 text-xs font-medium text-slate-500">Event timeline</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-24 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Event count over time"
      >
        {buckets.map((b, i) => {
          const barHeight = Math.max(2, (b.count / max) * (height - 20));
          const x = i * (barWidth + barGap);
          const y = height - 20 - barHeight;
          const tooltip = `${b.label}: ${b.count} event${b.count === 1 ? "" : "s"}`;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="var(--color-signal-500)"
                opacity={0.85}
              >
                <title>{tooltip}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>{buckets[0]?.label}</span>
        {buckets.length > 1 && <span>{buckets[buckets.length - 1]?.label}</span>}
      </div>
    </div>
  );
}
