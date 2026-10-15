import { ArrowUpRight, Bot, Globe, Layers, Smartphone } from "lucide-react";
import { services } from "@/lib/content";

// Each service line takes one of the semantic task-state hues, used only as a
// lane colour here (never as a brand accent).
const LANES = {
  "web-apps": { icon: Globe, text: "text-ink-running", bar: "bg-s-running", tile: "border-s-running/45 bg-s-running/10" },
  "ui-ux": { icon: Layers, text: "text-ink-review", bar: "bg-s-review", tile: "border-s-review/45 bg-s-review/10" },
  native: { icon: Smartphone, text: "text-ink-merged", bar: "bg-s-merged", tile: "border-s-merged/45 bg-s-merged/10" },
  "ai-agents": { icon: Bot, text: "text-ink-queued", bar: "bg-s-queued", tile: "border-s-queued/50 bg-s-queued/10" },
} as const;

export function Services() {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => {
          const lane = LANES[s.id as keyof typeof LANES];
          const Icon = lane.icon;
          return (
            <article key={s.id} className="flex flex-col bg-panel p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className={`grid size-11 place-items-center rounded-md border ${lane.tile} ${lane.text}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <span className={`mt-6 h-0.5 w-10 rounded-full ${lane.bar}`} aria-hidden="true" />
              <h3 className="mt-5 text-[21px] leading-tight font-semibold tracking-[-0.015em] text-fg">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-muted">{s.pitch}</p>
              <ul className="mt-6 hairline-x border-y border-line">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3 py-3 text-[14px] leading-6 text-fg">
                    <span aria-hidden="true" className={`mt-[9px] size-1.5 shrink-0 rounded-full ${lane.bar}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="mt-8 flex flex-wrap items-center gap-x-2 text-[15px] text-muted">
        Projects can span more than one line.
        <a
          href="#contact"
          className="inline-flex h-11 items-center gap-1 px-1 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-s-running"
        >
          Describe the brief
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
