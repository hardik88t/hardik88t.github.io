"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { agentic } from "@/lib/content";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Which guardrails (by index in content.agentic.guardrails) apply at each step.
// Mapped from the guardrail wording; steps without a direct match point to the
// full list.
const STEP_GUARDS: Record<string, number[]> = {
  spec: [],
  isolate: [0],
  context: [1],
  build: [3, 7],
  gates: [2, 3, 4, 5],
  review: [6, 7],
  merge: [6],
  ship: [],
};

const AUTOPLAY_MS = 3200;

export function Pipeline() {
  const steps = agentic.pipeline;
  const reduce = useReducedMotion() ?? false;
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);

  // The packet loops through the steps until the visitor chooses one.
  useEffect(() => {
    if (reduce || picked || !inView) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, picked, inView, steps.length]);

  const current = steps[active];
  const guards = STEP_GUARDS[current.id].map((i) => agentic.guardrails[i]);

  return (
    <div ref={ref} className="space-y-10">
      <ol className="relative grid gap-6 md:grid-cols-8 md:gap-2" aria-label="Agent pipeline, eight steps">
        {steps.map((step, i) => {
          const isActive = i === active;
          const isPast = i < active;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.id} className="relative flex flex-col md:block">
              {/* connector to the next step: vertical on mobile, horizontal on desktop */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bg-line transition-colors duration-500",
                    "left-[15px] top-8 bottom-[-24px] w-px md:top-[15px] md:bottom-auto md:left-1/2 md:h-px md:w-[calc(100%+0.5rem)]",
                    isPast && "bg-s-running/70",
                  )}
                />
              )}
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(i);
                  setPicked(true);
                }}
                className={cn(
                  "group relative z-10 flex w-full cursor-pointer items-start gap-4 rounded-md text-left md:flex-col md:gap-3 md:py-0",
                  "min-h-11",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full border bg-bg font-mono text-[11px] transition-colors duration-300",
                    isActive
                      ? "border-s-running text-ink-running"
                      : isPast
                        ? "border-s-running/60 text-fg"
                        : "border-line-strong text-muted group-hover:text-fg",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                  {isActive && (
                    <motion.span
                      layoutId="pipeline-packet"
                      aria-hidden="true"
                      className="absolute -inset-[5px] rounded-full border-2 border-s-running/80"
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    />
                  )}
                </span>
                <span className="min-w-0 pt-1 md:pt-0">
                  <span className={cn("block text-[15px] leading-6 font-semibold", isActive ? "text-fg" : "text-fg/90")}>
                    {step.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[12px] leading-5 text-muted md:mt-1">
                    {step.label}
                  </span>
                </span>
              </button>

              {/* mobile: details open inline under the active step */}
              {isActive && (
                <div className="mt-3 w-full pl-12 md:hidden">
                  <StepDetail step={step} guards={guards} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* desktop: details below the track */}
      <div
        aria-live="polite"
        className="hidden md:block"
      >
        <StepDetail step={current} guards={guards} desktop />
      </div>
    </div>
  );
}

function StepDetail({
  step,
  guards,
  desktop = false,
}: {
  step: (typeof agentic.pipeline)[number];
  guards: string[];
  desktop?: boolean;
}) {
  return (
    <div className={cn("surface rounded-lg p-5 sm:p-6", desktop && "grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-10 p-8")}>
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-running uppercase">
          Step {agentic.pipeline.findIndex((s) => s.id === step.id) + 1} · {step.title}
        </p>
        <p className={cn("mt-3 text-muted", desktop ? "text-[18px] leading-8" : "text-[15px] leading-7")}>
          {step.detail}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {step.artifacts.map((a) => (
            <Badge key={a} variant="outline" className="normal-case tracking-normal text-[12px]">
              {a}
            </Badge>
          ))}
        </div>
      </div>
      <div className={cn(!desktop && "mt-6 border-t border-line pt-5")}>
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Guardrails in force</p>
        {guards.length > 0 ? (
          <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-fg">
            {guards.map((g) => (
              <li key={g} className="flex gap-3">
                <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-s-merged" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] leading-6 text-muted">
            No step-specific rule. The pipeline-wide guardrails below apply throughout.
          </p>
        )}
      </div>
    </div>
  );
}
