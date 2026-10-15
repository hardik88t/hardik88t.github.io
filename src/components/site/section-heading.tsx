import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Editorial section header: a mono index on the left rail, title and lead on the right. */
export function SectionHeading({
  id,
  index,
  kicker,
  title,
  lead,
  className,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  lead?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12", className)}>
      <p className="eyebrow flex items-center gap-3 lg:pt-3">
        <span className="text-fg">{index}</span>
        <span aria-hidden="true" className="inline-block h-px w-8 bg-line-strong align-middle lg:hidden" />
        <span>{kicker}</span>
      </p>
      <div className="min-w-0">
        <h2 id={id} className="display text-[clamp(2rem,4.4vw,3.4rem)] text-fg">
          {title}
        </h2>
        {lead && <p className="mt-5 max-w-[46rem] text-[17px] leading-7 text-muted">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
