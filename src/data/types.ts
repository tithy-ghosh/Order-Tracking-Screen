
export type OrderStatus =
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";


export interface TrackingEvent {
  status: OrderStatus;
  label: string;
 
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
  
  customerReportedNotReceived?: boolean;
  supportContact: {
    phone?: string;
    email?: string;
  };
}


export type DeliveryState =
  | "on_track" 
  | "delivered" 
  | "delayed" 
  | "disputed" // marked delivered, but customer says they didn't get it
  | "tracking_unavailable"; // order exists, but no tracking events yet


export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };