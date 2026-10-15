import { ArrowUpRight } from "lucide-react";
import { footer, profile } from "@/lib/content";

export function SiteFooter() {
  const links = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "CV (PDF)", href: profile.links.cv },
    { label: "avinya.it", href: profile.links.business },
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:px-8">
        <p className="max-w-[34rem] text-[clamp(1.25rem,2.4vw,1.6rem)] leading-[1.35] font-medium tracking-[-0.02em] text-fg">
          {footer}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1 rounded-md px-2 text-muted transition-colors hover:text-fg"
            >
              {l.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          ))}
          <a href="#top" className="inline-flex h-11 items-center rounded-md px-2 text-muted transition-colors hover:text-fg">
            Back to top
          </a>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 pb-10 font-mono text-[11px] text-muted sm:px-6 lg:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          {profile.location} · {profile.timezone}
        </span>
      </div>
    </footer>
  );
}
