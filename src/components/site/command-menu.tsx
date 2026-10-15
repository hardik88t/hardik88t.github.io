"use client";

import { ArrowDownToLine, Copy, FileText, Sun } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { NAV_ITEMS } from "@/lib/nav";
import { copyText } from "@/lib/utils";
import { profile } from "@/lib/content";
import { applyTheme, currentTheme } from "@/lib/theme";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  let reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    // assume motion is fine
  }
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Close first, then act, so focus returns before any scroll or copy.
  const run = (action: () => unknown) => {
    onOpenChange(false);
    window.setTimeout(() => {
      void action();
    }, 60);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description="Jump to a section or run an action"
    >
      <CommandInput placeholder="Jump to a section or run an action" />
      <CommandList>
        <CommandEmpty>No matches. Try “work” or “email”.</CommandEmpty>

        <CommandGroup heading="Sections">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.id} value={`go to ${item.label}`} onSelect={() => run(() => scrollToSection(item.id))}>
              <ArrowDownToLine aria-hidden="true" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem value="copy email address" onSelect={() => run(() => copyText(profile.email))}>
            <Copy aria-hidden="true" />
            Copy email address
          </CommandItem>
          <CommandItem value="open github" onSelect={() => run(() => openExternal(profile.links.github))}>
            <GithubIcon />
            Open GitHub
          </CommandItem>
          <CommandItem value="open linkedin" onSelect={() => run(() => openExternal(profile.links.linkedin))}>
            <LinkedinIcon />
            Open LinkedIn
          </CommandItem>
          <CommandItem value="open cv pdf" onSelect={() => run(() => openExternal(profile.links.cv))}>
            <FileText aria-hidden="true" />
            Open CV (PDF)
          </CommandItem>
          <CommandItem
            value="switch theme light dark"
            onSelect={() => run(() => applyTheme(currentTheme() === "dark" ? "light" : "dark"))}
          >
            <Sun aria-hidden="true" />
            Switch theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
