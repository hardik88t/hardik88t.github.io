"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { profile, services } from "@/lib/content";
import { copyText } from "@/lib/utils";

const SERVICE_OPTIONS = [...services.map((s) => s.title), "Something else"];

const fieldClass =
  "h-11 w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 font-mono text-[14px] text-fg placeholder:text-muted/70 focus-visible:border-s-running focus-visible:outline-none";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[12px] text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Contact() {
  const uid = useId();
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function onCopy() {
    const ok = await copyText(profile.email);
    setCopy(ok ? "copied" : "failed");
    window.setTimeout(() => setCopy("idle"), 2200);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus({ tone: "error", text: "Fill in the required fields to open a ticket." });
      return;
    }
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const brief = String(data.get("brief") ?? "").trim();
    const subject = `Project enquiry: ${service}`;
    const body = `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${brief}`;
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({
      tone: "ok",
      text: "Mail draft opened in your email app. Nothing has been sent from this page.",
    });
    window.location.href = href;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="min-w-0">
        <p className="text-[17px] leading-7 text-muted">
          Describe the product, the timeline and what a good result looks like. The ticket opens as an email
          draft addressed to me.
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-fg">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-s-merged" />
          {profile.availability}
          <span className="text-muted">· {profile.timezone}</span>
        </p>

        <div className="surface mt-8 rounded-lg p-5 sm:p-6">
          <p className="eyebrow">Email</p>
          <p className="mt-3 font-mono text-[18px] break-all text-fg sm:text-xl">{profile.email}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={onCopy}>
              {copy === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copy === "copied" ? "Copied" : "Copy address"}
            </Button>
            <Button asChild variant="ghost">
              <a href={`mailto:${profile.email}`}>
                Open mail app
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 font-mono text-xs text-muted">
            {copy === "failed" && "Copy was blocked. Select the address above and copy it."}
          </p>
        </div>

        <ul className="hairline-x mt-6 border-y border-line">
          {[
            { label: "LinkedIn", href: profile.links.linkedin, icon: <LinkedinIcon className="size-4" /> },
            { label: "GitHub", href: profile.links.github, icon: <GithubIcon className="size-4" /> },
            { label: "CV (PDF)", href: profile.links.cv, icon: null },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 items-center justify-between gap-3 text-[15px] text-fg transition-colors hover:text-ink-running"
              >
                <span className="flex items-center gap-3">
                  {l.icon && <span className="text-muted group-hover:text-fg">{l.icon}</span>}
                  {l.label}
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-running" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onSubmit} aria-labelledby={`${uid}-title`} className="min-w-0">
        <div className="surface overflow-hidden rounded-lg">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <span id={`${uid}-title`} className="flex items-center gap-2 font-mono text-xs text-fg">
              <Terminal aria-hidden="true" className="size-3.5 text-muted" />
              ticket.sh
            </span>
            <span className="font-mono text-[11px] text-muted">open a ticket</span>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <p className="font-mono text-[13px] leading-6 text-muted">
              <span className="text-ink-running">$</span> ticket open --to hardik
            </p>

            <Field label="name">
              <input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
            </Field>
            <Field label="email">
              <input name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="you@company.com" />
            </Field>
            <Field label="service">
              <select name="service" defaultValue={SERVICE_OPTIONS[0]} className={`${fieldClass} cursor-pointer`}>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o} value={o} className="bg-panel text-fg">
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="brief">
              <textarea
                name="brief"
                required
                rows={5}
                minLength={10}
                className={`${fieldClass} h-auto resize-y py-2 leading-6`}
                placeholder="What are you building, by when, and what would success look like?"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2">
              <Button type="submit">
                Open ticket
                <ArrowRight aria-hidden="true" />
              </Button>
              <p aria-live="polite" className={status?.tone === "error" ? "font-mono text-xs text-ink-failed" : "font-mono text-xs text-muted"}>
                {status ? `> ${status.text}` : "> nothing is sent from this page"}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
