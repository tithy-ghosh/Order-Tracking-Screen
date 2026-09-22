import type { DeliveryState, Order } from "@/data/types";

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


function isPast(isoTimestamp: string): boolean {
  return new Date(isoTimestamp).getTime() < Date.now();
}


export type DeliveryStateMetaTone = "neutral" | "positive" | "warning" | "critical";

export interface DeliveryStateMeta {
  title: string;
  description: string;
  actionLabel: string;
  tone: DeliveryStateMetaTone;
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
