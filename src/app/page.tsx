import { Shell } from "@/components/site/shell";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Pipeline } from "@/components/site/pipeline";
import { Metrics } from "@/components/site/metrics";
import { Guardrails } from "@/components/site/guardrails";
import { Work } from "@/components/site/work";
import { Services } from "@/components/site/services";
import { Stack } from "@/components/site/stack";
import { Experience } from "@/components/site/experience";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/footer";
import { Badge } from "@/components/ui/badge";
import { agentic } from "@/lib/content";

const SECTION =
  "mx-auto max-w-[1200px] scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 md:py-28 lg:px-8";

export default function Home() {
  return (
    <Shell>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />

        <section id="workflow" aria-labelledby="workflow-title" className={SECTION}>
          <SectionHeading
            id="workflow-title"
            index="01"
            kicker="Workflow"
            title={agentic.title}
            lead={agentic.thesis}
          >
            <p className="mt-5 max-w-[46rem] text-[15px] leading-7 text-muted">{agentic.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Agents in the fleet">
              {agentic.agents.map((a) => (
                <li key={a}>
                  <Badge variant="outline" className="normal-case tracking-normal text-[12.5px] py-1">
                    {a}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[12px] text-muted">{agentic.scope}</p>
          </SectionHeading>

          <div className="mt-14">
            <h3 className="eyebrow mb-5">How the fleet works · select a step</h3>
            <Pipeline />
          </div>

          <div className="mt-20">
            <h3 className="eyebrow mb-5">By the numbers</h3>
            <Metrics />
          </div>

          <div className="mt-20">
            <Guardrails />
          </div>
        </section>

        <section id="work" aria-labelledby="work-title" className={SECTION}>
          <SectionHeading
            id="work-title"
            index="02"
            kicker="Work"
            title="Selected work"
            lead="Featured case files first. Interface sketches stand in for screenshots; open a case for the detail."
          />
          <div className="mt-14">
            <Work />
          </div>
        </section>

        <section id="services" aria-labelledby="services-title" className={SECTION}>
          <SectionHeading
            id="services-title"
            index="03"
            kicker="Services"
            title="Services for clients"
            lead="Four service lines, delivered through the same gated workflow."
          />
          <div className="mt-14">
            <Services />
          </div>
        </section>

        <section id="stack" aria-labelledby="stack-title" className={SECTION}>
          <SectionHeading id="stack-title" index="04" kicker="Stack" title="Stack and skills" lead="Grouped by area." />
          <div className="mt-14">
            <Stack />
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-title" className={SECTION}>
          <SectionHeading id="experience-title" index="05" kicker="Experience" title="Where I have worked" />
          <div className="mt-14">
            <Experience />
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className={SECTION}>
          <SectionHeading id="contact-title" index="06" kicker="Contact" title="Start a project" />
          <div className="mt-14">
            <Contact />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
