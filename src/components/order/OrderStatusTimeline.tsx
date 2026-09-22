/**
 * components/order/OrderStatusTimeline.tsx
 *
 * The core visual requirement: a clear, at-a-glance delivery
 * progress/timeline. Everything else stays quiet so this reads clearly.
 *
 * Redesign intent:
 *  - Completed steps collapse to a check inside a filled brand gradient
 *    node, so "how far along" reads in a glance.
 *  - The current step keeps its real icon, tinted ring, and stays white.
 *  - The connecting rail is filled with a brand gradient up to the current
 *    step and grey below — a literal progress bar.
 *  - "delayed" reskins the current step amber; "disputed" flags the
 *    delivered step in brick.
 */

import { Check, Package, PackageCheck, Truck, CheckCircle2, TriangleAlert } from "lucide-react";

import type { DeliveryState, Order, OrderStatus, TrackingEvent } from "@/data/types";
import { formatDateTime } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

const STEP_ORDER: OrderStatus[] = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export const STEP_LABEL: Record<OrderStatus, string> = {
  processing: "Order confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const STEP_ICON: Record<OrderStatus, typeof Package> = {
  processing: Package,
  shipped: PackageCheck,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
};

export interface OrderStatusTimelineProps {
  order: Order;
  deliveryState: DeliveryState;
}

export function OrderStatusTimeline({ order, deliveryState }: OrderStatusTimelineProps) {
  const currentIndex = STEP_ORDER.indexOf(order.status);
  const eventsByStatus = indexEventsByStatus(order.trackingEvents);

  return (
    <ol className="relative flex flex-col gap-5" aria-label="Delivery progress">
      {STEP_ORDER.map((step, index) => {
        const Icon = STEP_ICON[step];
        const event = eventsByStatus.get(step);
        const isLastStep = index === STEP_ORDER.length - 1;

        const isDone = index < currentIndex || (index === currentIndex && step === "delivered");
        const isCurrent = index === currentIndex && step !== "delivered";
        const isDelayedStep = isCurrent && deliveryState === "delayed";
        const isDisputedStep = step === "delivered" && deliveryState === "disputed";

        return (
          <li key={step} className="relative flex gap-4">
            {/* connecting rail */}
            {!isLastStep && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[18px] top-10 h-[calc(100%-8px)] w-0.5",
                  isDone
                    ? "bg-gradient-to-b from-brand to-brand/25"
                    : "bg-line-strong"
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isDone && "border-brand bg-gradient-to-br from-[#4a72ea] to-brand text-white shadow-[0_2px_6px_rgb(47_85_212/0.35)]",
                isCurrent && !isDelayedStep &&
                  "border-brand bg-white text-brand ring-4 ring-brand/10",
                isDelayedStep &&
                  "border-amber bg-white text-amber ring-4 ring-amber/15",
                !isDone && !isCurrent && "border-line-strong bg-white text-ink-faint"
              )}
            >
              {isDone ? (
                <Check className="h-4.5 w-4.5" strokeWidth={3} aria-hidden="true" />
              ) : (
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              )}

              {isDisputedStep && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brick text-white shadow-card"
                  title="Delivery disputed"
                >
                  <TriangleAlert className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
              )}
            </span>

            <div className={cn("flex flex-col pb-0.5 pt-1", isCurrent && "pt-0.5")}>
              <span
                className={cn(
                  "text-[14px]",
                  isDone || isCurrent ? "font-semibold text-ink" : "font-medium text-ink-mute"
                )}
              >
                {STEP_LABEL[step]}
              </span>

              {event?.timestamp ? (
                <span className="mt-0.5 text-[12px] text-ink-mute">
                  {formatDateTime(event.timestamp)}
                  {event.location ? ` · ${event.location}` : ""}
                </span>
              ) : isCurrent ? (
                <span className="mt-0.5 text-[12px] font-medium text-ink-mute">
                  In progress…
                </span>
              ) : null}

              {isDelayedStep && (
                <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-amber-soft px-2 py-0.5 text-[11px] font-semibold text-amber">
                  Running later than expected
                </span>
              )}

              {isDisputedStep && (
                <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-brick-soft px-2 py-0.5 text-[11px] font-semibold text-brick">
                  Reported not received
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Builds a status → event lookup so rendering doesn't re-scan the array per step. */
function indexEventsByStatus(events: TrackingEvent[]): Map<OrderStatus, TrackingEvent> {
  const map = new Map<OrderStatus, TrackingEvent>();
  for (const event of events) {
    map.set(event.status, event);
  }
  return map;
}