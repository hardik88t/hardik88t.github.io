"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseVisual } from "@/components/site/case-visual";
import { GithubIcon } from "@/components/site/brand-icons";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  agentNoteFor,
  featuredProjects,
  otherProjects,
  projectLinks,
  type Project,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const CASE_NUMBER = (p: Project) =>
  String(
    [...featuredProjects, ...otherProjects].findIndex((x) => x.slug === p.slug) + 1,
  ).padStart(2, "0");

function Categories({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.categories.map((c) => (
        <Badge key={c} variant="outline" className="normal-case tracking-normal text-[11.5px]">
          {CATEGORY_LABELS[c] ?? c}
        </Badge>
      ))}
    </div>
  );
}

function FeaturedCard({
  project,
  wide,
  onOpen,
}: {
  project: Project;
  wide: boolean;
  onOpen: (p: Project) => void;
}) {
  return (
    <article
      className={cn(
        "surface group relative flex flex-col overflow-hidden rounded-lg transition-colors duration-300 hover:border-line-strong",
        wide && "md:col-span-2",
      )}
    >
      <div className={cn("relative border-b border-line", wide ? "aspect-[16/8]" : "aspect-[16/10]")}>
        <CaseVisual slug={project.slug} accent={project.accent} title={project.title} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
          <span>Case {CASE_NUMBER(project)}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-3 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-fg">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="cursor-pointer text-left after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-muted">{project.oneLiner}</p>
        <div className="mt-4">
          <Categories project={project} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-6 font-mono text-[11.5px] text-muted">
          {project.stack.slice(0, wide ? 6 : 4).map((s) => (
            <span key={s} className="whitespace-nowrap">
              {s}
            </span>
          ))}
          {project.stack.length > (wide ? 6 : 4) && (
            <span>+{project.stack.length - (wide ? 6 : 4)}</span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[13px] text-muted">
          <span className="truncate">{project.role}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-fg transition-transform duration-300 group-hover:translate-x-0.5">
            View case
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}

function IndexRow({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <li className="group relative grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 py-4 transition-colors hover:bg-panel-2/60 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,14rem)_auto] md:gap-6 md:px-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line">
        <CaseVisual slug={project.slug} accent={project.accent} title={project.title} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
          <span>Case {CASE_NUMBER(project)}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
          {project.anonymized && (
            <>
              <span aria-hidden="true">·</span>
              <span>Client work, anonymised</span>
            </>
          )}
        </div>
        <h3 className="mt-1.5 text-lg leading-tight font-semibold tracking-[-0.01em] text-fg">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="cursor-pointer text-left after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-1 text-[14px] leading-6 text-muted">{project.oneLiner}</p>
      </div>
      <div className="col-span-2 md:col-span-1">
        <Categories project={project} />
      </div>
      <ArrowUpRight aria-hidden="true" className="hidden size-5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-fg md:block" />
    </li>
  );
}

function ProjectDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;
  const links = projectLinks(project);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="relative aspect-[21/8] border-b border-line">
          <CaseVisual slug={project.slug} accent={project.accent} title={project.title} />
        </div>

        <div className="p-6 md:p-8">
          <p className="eyebrow">
            Case {CASE_NUMBER(project)} · {project.year}
          </p>
          <DialogTitle className="display mt-3 text-3xl text-fg md:text-4xl">{project.title}</DialogTitle>
          <DialogDescription className="mt-3 text-[16px] leading-7 text-muted">
            {project.oneLiner}
          </DialogDescription>

          <Tabs key={project.slug} defaultValue="overview" className="mt-7">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="agents">How agents helped</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6">
              <p className="text-[16px] leading-7 text-fg/90">{project.description}</p>
              <p className="eyebrow mt-7">Highlights</p>
              <ul className="mt-3 hairline-x border-y border-line">
                {project.highlights.map((h) => (
                  <li key={h} className="py-3 text-[15px] leading-6 text-fg">
                    {h}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="stack" className="pt-6">
              <p className="eyebrow">Built with</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s}>
                    <Badge variant="outline" className="normal-case tracking-normal text-[13px] py-1">
                      {s}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[14px] leading-6 text-muted">
                Role: <span className="text-fg">{project.role}</span>
              </p>
            </TabsContent>

            <TabsContent value="agents" className="pt-6">
              <p className="text-[16px] leading-7 text-fg/90">{agentNoteFor(project.slug)}</p>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            {links.github && (
              <Button asChild variant="outline">
                <a href={links.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="size-4" />
                  View on GitHub
                </a>
              </Button>
            )}
            {links.live && (
              <Button asChild variant="outline">
                <a href={links.live} target="_blank" rel="noopener noreferrer">
                  Visit live site
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            )}
            {project.anonymized && (
              <p className="text-[13px] leading-5 text-muted">
                Client work. Names and identifying details are withheld; the visual is an illustrative sketch.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (p: Project) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {featuredProjects.map((p, i) => (
          <FeaturedCard key={p.slug} project={p} wide={i === 0} onOpen={openProject} />
        ))}
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
          <p className="eyebrow">More work</p>
          <p className="font-mono text-[11px] text-muted">{otherProjects.length} case files</p>
        </div>
        <ul className="divide-y divide-line">
          {otherProjects.map((p) => (
            <IndexRow key={p.slug} project={p} onOpen={openProject} />
          ))}
        </ul>
      </div>

      <ProjectDialog project={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
