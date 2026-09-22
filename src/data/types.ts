/**
 * data/types.ts
 *
 * Core domain types for the Order Tracking feature.
 *
 * Two layers of "status" are modeled on purpose:
 *  1. `OrderStatus`   — the raw status as it comes from the (mock) system.
 *  2. `DeliveryState` — the *derived* UI state, computed in lib/getOrderStatus.ts,
 *                       which accounts for edge cases the raw status alone
 *                       can't express (delayed, disputed, tracking unavailable).
 *
 * Components should only ever render based on `DeliveryState`, never on
 * `OrderStatus` directly — that keeps all "what does this mean for the UI"
 * logic in one place instead of scattered across components.
 */

/** The literal status value as reported by the order system. */
export type OrderStatus =
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

/** A single checkpoint in the order's journey, used to render the timeline. */
export interface TrackingEvent {
  status: OrderStatus;
  label: string;
  /** ISO 8601 timestamp. Undefined if this step hasn't happened yet. */
  timestamp?: string;
  location?: string;
}

/** Minimal product info shown in the order summary. */
export interface OrderProduct {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

/**
 * The raw order record, as if it came from an API.
 * This is intentionally "dumb" — it doesn't know whether it's delayed,
 * disputed, etc. That interpretation happens in getOrderStatus.ts.
 */
export interface Order {
  id: string;
  status: OrderStatus;
  placedAt: string; // ISO 8601
  estimatedDelivery: string; // ISO 8601
  actualDeliveredAt?: string; // ISO 8601, only set once status === "delivered"
  products: OrderProduct[];
  trackingEvents: TrackingEvent[];
  /**
   * True only when the customer has actively disputed a "delivered" order
   * (e.g. tapped "I didn't receive this"). Drives the disputed edge case.
   */
  customerReportedNotReceived?: boolean;
  supportContact: {
    phone?: string;
    email?: string;
  };
}

/**
 * The derived, UI-facing delivery state. This is what every component
 * should branch on instead of raw `OrderStatus`.
 */
export type DeliveryState =
  | "on_track" // normal happy path, still within ETA
  | "delivered" // delivered, customer has not disputed it
  | "delayed" // ETA has passed, not yet delivered
  | "disputed" // marked delivered, but customer says they didn't get it
  | "tracking_unavailable"; // order exists, but no tracking events yet

/** Simple async states for simulating a real data fetch with mock data. */
export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };