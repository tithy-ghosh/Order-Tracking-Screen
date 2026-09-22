/**
 * components/order/OrderStateBanner.tsx
 *
 * Sits above the timeline and states the situation in plain language,
 * with the single most useful next action for it. Copy comes from
 * getDeliveryStateMeta() so a message change never touches this file —
 * this component only decides how each tone *looks* and what the action
 * does when pressed.
 *
 * Redesign intent: each tone gets a soft-tinted tile for its icon, a left
 * accent bar, and a pill-shaped primary action — so severity reads from
 * color and icon, and the banner stays calm at any size.
 */

import { ArrowRight } from "lucide-react";

import type { DeliveryState, Order } from "@/data/types";
import {
  getDeliveryStateMeta,
  type DeliveryStateMetaTone,
} from "@/lib/getOrderStatus";
import { cn } from "@/lib/utils";

interface OrderStateBannerProps {
  order: Order;
  deliveryState: DeliveryState;
  /** Called when the primary action is pressed. The caller decides what
   *  it does (scroll to the timeline, open a support modal, jump to a
   *  dispute form) — this component only knows the label. */
  onAction?: () => void;
}

const TONE_STYLES: Record<
  DeliveryStateMetaTone,
  {
    border: string;
    accent: string;
    bg: string;
    iconTile: string;
    button: string;
  }
> = {
  neutral: {
    border: "border-brand/15",
    accent: "bg-gradient-to-b from-brand to-brand/60",
    bg: "bg-[linear-gradient(135deg,#edf1fc_0%,#ffffff_70%)]",
    iconTile: "bg-brand-soft text-brand",
    button: "bg-brand text-white hover:bg-brand-strong",
  },
  positive: {
    border: "border-green/15",
    accent: "bg-gradient-to-b from-green to-green/60",
    bg: "bg-[linear-gradient(135deg,#e6f4ee_0%,#ffffff_70%)]",
    iconTile: "bg-green-soft text-green",
    button: "bg-green text-white hover:bg-[#0e6f4e]",
  },
  warning: {
    border: "border-amber/25",
    accent: "bg-gradient-to-b from-amber to-amber/60",
    bg: "bg-[linear-gradient(135deg,#f9f0dc_0%,#ffffff_70%)]",
    iconTile: "bg-amber-soft text-amber",
    button: "bg-amber text-white hover:bg-[#8e5a0a]",
  },
  critical: {
    border: "border-brick/25",
    accent: "bg-gradient-to-b from-brick to-brick/60",
    bg: "bg-[linear-gradient(135deg,#fbe9e5_0%,#ffffff_70%)]",
    iconTile: "bg-brick-soft text-brick",
    button: "bg-brick text-white hover:bg-[#8f2f24]",
  },
};

function ToneIcon({ tone }: { tone: DeliveryStateMetaTone }) {
  const common = "h-5 w-5 shrink-0";
  switch (tone) {
    case "positive":
      return (
        <svg viewBox="0 0 20 20" fill="none" className={common} aria-hidden>
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg viewBox="0 0 20 20" fill="none" className={common} aria-hidden>
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="0.9" fill="currentColor" />
        </svg>
      );
    case "critical":
      return (
        <svg viewBox="0 0 20 20" fill="none" className={common} aria-hidden>
          <path d="M10 2 18 16H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="0.9" fill="currentColor" />
        </svg>
      );
    case "neutral":
    default:
      return (
        <svg viewBox="0 0 20 20" fill="none" className={common} aria-hidden>
          <rect x="2.5" y="6" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 9h2.3l2.2 2.4V14h-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="6" cy="15.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="15" cy="15.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
  }
}

export function OrderStateBanner({ order, deliveryState, onAction }: OrderStateBannerProps) {
  const meta = getDeliveryStateMeta(deliveryState);
  const styles = TONE_STYLES[meta.tone];

  return (
    <div
      role={meta.tone === "critical" || meta.tone === "warning" ? "alert" : "status"}
      aria-label={`Order ${order.id} status: ${meta.title}`}
      className={cn(
        "relative overflow-hidden rounded-2xl border px-4 py-4 shadow-card",
        styles.border,
        styles.bg
      )}
    >
      <span aria-hidden="true" className={cn("absolute left-0 top-0 h-full w-1", styles.accent)} />

      <div className="flex items-start gap-3 pl-1">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            styles.iconTile
          )}
        >
          <ToneIcon tone={meta.tone} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-tight text-ink">{meta.title}</p>
          <p className="mt-1 text-[13px] leading-snug text-ink-soft">{meta.description}</p>
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                styles.button
              )}
            >
              {meta.actionLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}