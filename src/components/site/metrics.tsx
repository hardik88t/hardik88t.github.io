import { agentic } from "@/lib/content";
import { cn } from "@/lib/utils";

// Bento layout: hairline cells on a 6-column grid. The first two cells get
// the largest type. Every value is taken verbatim from content.json.
const SPANS = [
  "col-span-2 md:col-span-3 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
] as const;

const VALUE_SIZE = [
  "text-[clamp(4.5rem,11vw,9rem)]",
  "text-[clamp(3rem,6vw,4.5rem)]",
  "text-[clamp(3rem,6vw,4.5rem)]",
  "text-5xl",
  "text-5xl",
  "text-5xl",
  "text-5xl",
  "text-5xl",
  "text-5xl",
] as const;

export function Metrics() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-6">
      {agentic.metrics.map((m, i) => (
        <figure
          key={m.label}
          className={cn(
            "relative flex min-h-[156px] flex-col justify-between bg-panel p-5 md:p-6",
            SPANS[i],
            i === 0 && "bg-panel-2",
          )}
        >
          {i === 0 && (
            <span aria-hidden="true" className="glow pointer-events-none absolute -top-24 -right-24 size-72 opacity-70" />
          )}
          <p className="relative flex items-baseline gap-1 font-mono leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums">
            <span className={cn(VALUE_SIZE[i])}>{m.value}</span>
            {"unit" in m && (
              <span className="text-[clamp(1.5rem,3vw,2.25rem)] text-muted">{m.unit}</span>
            )}
          </p>
          <figcaption className="relative mt-5">
            <span className="block text-[15px] leading-5 font-medium text-fg">{m.label}</span>
            <span className="mt-1 block text-[13px] leading-5 text-muted">{m.context}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
