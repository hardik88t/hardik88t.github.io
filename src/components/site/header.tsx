"use client";

import { useEffect, useState } from "react";
import { Command as CommandIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CommandMenu } from "@/components/site/command-menu";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { profile } from "@/lib/content";
import { useActiveSection } from "@/lib/hooks";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mod, setMod] = useState("⌘");

  useEffect(() => {
    if (!/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)) setMod("Ctrl");
  }, []);

  // Global shortcut: Cmd+K / Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <a href="#top" aria-label={`${profile.name}, back to top`} className="flex min-w-0 items-center gap-3 rounded-md">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-md border border-line-strong bg-panel font-mono text-[12px] font-semibold text-fg"
          >
            {profile.monogram}
          </span>
          <span className="hidden truncate text-[15px] font-semibold tracking-tight text-fg sm:block lg:hidden xl:block">
            {profile.name}
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center px-3 text-sm transition-colors",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                      "after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-s-running after:transition-transform after:duration-300",
                      isActive && "after:scale-x-100",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCmdOpen(true)}
            aria-label="Open command palette"
            className="hidden h-11 border-line text-muted hover:text-fg sm:inline-flex"
          >
            <CommandIcon aria-hidden="true" />
            <span className="hidden xl:inline">Command</span>
            <kbd className="hidden font-mono text-[11px] text-muted xl:inline">
              {mod}K
            </kbd>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden md:inline-flex">
            <a href="#contact">Start a project</a>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
                Menu
              </SheetTitle>
              <SheetDescription className="sr-only">Jump to a section or start a project</SheetDescription>
              <nav aria-label="Mobile sections" className="-mx-2">
                <ul>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                      <SheetClose asChild>
                        <a
                          href={`#${item.id}`}
                          className="flex h-12 items-center justify-between rounded-md px-2 text-[17px] font-medium text-fg transition-colors hover:bg-panel-2"
                        >
                          {item.label}
                          <span aria-hidden="true" className="font-mono text-xs text-muted">
                            {String(NAV_ITEMS.indexOf(item) + 1).padStart(2, "0")}
                          </span>
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5">
                <SheetClose asChild>
                  <Button asChild>
                    <a href="#contact">Start a project</a>
                  </Button>
                </SheetClose>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuOpen(false);
                    window.setTimeout(() => setCmdOpen(true), 150);
                  }}
                >
                  <CommandIcon aria-hidden="true" />
                  Command palette
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}

