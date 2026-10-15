import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[11px] leading-4 tracking-[0.06em] uppercase",
  {
    variants: {
      variant: {
        default: "border-line-strong text-muted",
        outline: "border-line text-fg",
        queued: "border-s-queued/40 bg-s-queued/10 text-ink-queued",
        running: "border-s-running/45 bg-s-running/10 text-ink-running",
        review: "border-s-review/45 bg-s-review/10 text-ink-review",
        merged: "border-s-merged/45 bg-s-merged/10 text-ink-merged",
        failed: "border-s-failed/45 bg-s-failed/10 text-ink-failed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
