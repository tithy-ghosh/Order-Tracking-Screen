/**
 * components/ui/empty-state.tsx
 *
 * Custom empty/error state primitive (shadcn has no built-in one).
 * Used directly for the fetch-error case and for search-with-no-results
 * on the orders screen — one visual language for every "nothing to
 * show, here's why and what to do" moment.
 */

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong bg-card-surface px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-card">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <p className="mx-auto max-w-[260px] text-[13px] leading-snug text-ink-mute">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-1 rounded-full px-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}