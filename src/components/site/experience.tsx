import { Badge } from "@/components/ui/badge";
import { profile } from "@/lib/content";

export function Experience() {
  return (
    <div className="grid gap-14">
      <ol className="space-y-0">
        {profile.experience.map((job) => {
          const current = job.to === "Present";
          return (
            <li
              key={`${job.company}-${job.role}-${job.from}`}
              className="group relative grid gap-4 pb-14 last:pb-0 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10"
            >
              <div className="font-mono text-[13px] leading-6 text-muted md:pt-0.5 md:text-right">
                <p className="text-fg">
                  {job.from} – {job.to}
                </p>
                <p>{job.location}</p>
              </div>

              <div className="relative pl-8 before:absolute before:top-[22px] before:bottom-[-56px] before:left-[7px] before:w-px before:bg-line group-last:before:hidden">
                <span
                  aria-hidden="true"
                  className={
                    current
                      ? "absolute top-[5px] left-0 size-[15px] rounded-full border-2 border-s-merged bg-s-merged/30"
                      : "absolute top-[5px] left-0 size-[15px] rounded-full border-2 border-line-strong bg-bg"
                  }
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-xl leading-7 font-semibold tracking-[-0.01em] text-fg">{job.role}</h3>
                  {current && <Badge variant="merged">Current</Badge>}
                </div>
                <p className="text-[15px] leading-6 text-muted">{job.company}</p>
                <ul className="mt-4 space-y-2.5">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-6 text-fg/90">
                      <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-line-strong" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <li key={s} className="rounded-sm bg-panel-2 px-2 py-1 font-mono text-[11.5px] leading-5 text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 border-t border-line pt-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
        <p className="eyebrow">Education</p>
        <ul className="space-y-6">
          {profile.education.map((ed) => (
            <li key={ed.institution}>
              <h3 className="text-lg leading-7 font-semibold text-fg">{ed.institution}</h3>
              <p className="text-[15px] leading-6 text-muted">
                {ed.degree} · {ed.from} – {ed.to}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
