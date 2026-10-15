import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrchestratorPanel } from "@/components/site/orchestrator-panel";
import { profile } from "@/lib/content";

const EMPHASIS = "a fleet of AI agents";

export function Hero() {
  const [before, after] = profile.headline.split(EMPHASIS);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 pt-10 pb-16 sm:px-6 md:pt-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel/60 px-3 py-1.5 text-[13px] text-fg">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-s-merged" />
              {profile.availability}
            </span>
          </div>

          <h1 id="hero-title" className="display mt-7 text-[clamp(2.5rem,5.2vw,4.4rem)] text-fg">
            {before}
            <span className="relative text-ink-running">
              {EMPHASIS}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-s-running/70" />
            </span>
            {after}
          </h1>

          <p className="mt-6 max-w-[36rem] text-[17px] leading-7 text-muted sm:text-[18px] sm:leading-8">
            {profile.sub}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="default">
              <a href="#contact">
                Start a project
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#workflow">See the agent workflow</a>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <a
              href={profile.links.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1 rounded-md font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-s-running"
            >
              Read the CV
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
            <span aria-hidden="true" className="hidden h-4 w-px bg-line-strong sm:block" />
            <span>
              {profile.role} · {profile.location}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <OrchestratorPanel />
        </div>
      </div>
    </section>
  );
}
