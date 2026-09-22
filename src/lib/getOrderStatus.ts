/**
 * lib/getOrderStatus.ts
 *
 * The single source of truth for turning a raw `Order` into a `DeliveryState`.
 *
 * Why this exists as its own module instead of being computed inline in
 * components: the 3 required edge cases (delayed / disputed / tracking
 * unavailable) all depend on *interpreting* the raw order data, not just
 * reading a field. Centralizing that interpretation here means:
 *
 *   - Every component (timeline, banner, summary) agrees on the same state.
 *   - The rules can be unit-tested in isolation, with no rendering involved.
 *   - Adding a new edge case later means editing one function, not hunting
 *     through JSX for scattered if-statements.
 */

import type { DeliveryState, Order } from "@/data/types";

/**
 * Derives the UI-facing delivery state for an order.
 *
 * Precedence matters here — checks run in this order:
 *   1. Disputed takes priority over "delivered", since a customer dispute
 *      changes what the UI must show even though status === "delivered".
 *   2. Tracking-unavailable is checked before delayed/on-track, since with
 *      zero tracking events we can't meaningfully say "on track" or "late".
 *   3. Delayed is judged purely by whether the ETA has passed while the
 *      order is still short of "delivered".
 */
export function getDeliveryState(order: Order): DeliveryState {
  if (order.status === "delivered") {
    return order.customerReportedNotReceived ? "disputed" : "delivered";
  }

  if (order.trackingEvents.length === 0) {
    return "tracking_unavailable";
  }

  if (isPast(order.estimatedDelivery)) {
    return "delayed";
  }

  return "on_track";
}

/** True if the given ISO timestamp is earlier than the current time. */
function isPast(isoTimestamp: string): boolean {
  return new Date(isoTimestamp).getTime() < Date.now();
}

/**
 * Human-readable copy for each delivery state, used by OrderStateBanner.
 * Keeping the copy here (next to the logic that decides the state) means
 * a content change never requires touching a component file.
 */
export interface DeliveryStateMeta {
  title: string;
  description: string;
  /** Label for the primary action button shown alongside this state. */
  actionLabel: string;
  /** Visual tone — maps to color/icon choices in the UI layer. */
  tone: "neutral" | "positive" | "warning" | "critical";
}

const DELIVERY_STATE_META: Record<DeliveryState, DeliveryStateMeta> = {
  on_track: {
    title: "On the way",
    description: "Your order is on track and will arrive by the estimated date.",
    actionLabel: "Track shipment",
    tone: "neutral",
  },
  delivered: {
    title: "Delivered",
    description: "Your order has been delivered. We hope you enjoy it!",
    actionLabel: "View order details",
    tone: "positive",
  },
  delayed: {
    title: "Delivery delayed",
    description:
      "Your order has passed its estimated delivery time. We're checking with the courier — thanks for your patience.",
    actionLabel: "Contact support",
    tone: "warning",
  },
  disputed: {
    title: "Delivery issue reported",
    description:
      "This order is marked as delivered, but you've told us it didn't arrive. Our support team is looking into it.",
    actionLabel: "Check dispute status",
    tone: "critical",
  },
  tracking_unavailable: {
    title: "Tracking not available yet",
    description:
      "Your order has been placed and is being prepared. Tracking details will appear here once it ships.",
    actionLabel: "Contact support",
    tone: "neutral",
  },
};

/** Returns the display copy + tone for a given delivery state. */
export function getDeliveryStateMeta(state: DeliveryState): DeliveryStateMeta {
  return DELIVERY_STATE_META[state];
}