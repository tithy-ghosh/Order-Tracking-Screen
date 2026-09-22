/**
 * components/ui/empty-state.tsx
 *
 * Not a shadcn component — this one is custom, since shadcn has no
 * built-in "empty/error state" primitive. Built from Card + Button so
 * it still matches the rest of the design system.
 *
 * Used directly for the fetch-error case (useOrder's "error" status),
 * and composed into OrderStateBanner for tracking_unavailable, so the
 * same visual language covers every "nothing to show, here's why and
 * what to do" moment in the app.
 *
 * Copy guidance: explain what happened and what to do next, in the
 * interface's voice — no apologies, no vague "Oops!" messaging.
 */

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}