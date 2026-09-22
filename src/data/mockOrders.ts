/**
 * data/mockOrders.ts
 *
 * Static mock dataset standing in for a backend. Deliberately includes one
 * order for every DeliveryState so the UI can be exercised end-to-end:
 *
 *   ORD-1001  on_track              — normal happy path, ETA still ahead
 *   ORD-1002  delayed               — ETA has passed, still "out_for_delivery"
 *   ORD-1003  disputed              — marked "delivered", customer disagrees
 *   ORD-1004  tracking_unavailable  — order placed, no tracking events yet
 *   ORD-1005  delivered             — delivered normally, no dispute
 *
 * Import `getMockOrderById` from components/hooks instead of reaching into
 * this array directly — that keeps the "data access" seam in one place,
 * making it trivial to swap in a real fetch() later.
 */

import type { Order } from "./types";

const now = new Date();

/** Helper: returns an ISO string offset from now by a number of hours. */
function hoursFromNow(hours: number): string {
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
}

export const mockOrders: Order[] = [
  // 1. Happy path — on track, ETA is still in the future.
  {
    id: "ORD-1001",
    status: "out_for_delivery",
    placedAt: hoursFromNow(-48),
    estimatedDelivery: hoursFromNow(6),
    products: [
      {
        id: "P-01",
        name: "Wireless Noise-Cancelling Headphones",
        imageUrl: "/products/headphones.jpg",
        quantity: 1,
        price: 89.99,
      },
    ],
    trackingEvents: [
      { status: "processing", label: "Order confirmed", timestamp: hoursFromNow(-48) },
      { status: "shipped", label: "Shipped from warehouse", timestamp: hoursFromNow(-30) },
      { status: "out_for_delivery", label: "Out for delivery", timestamp: hoursFromNow(-1), location: "Sylhet Sorting Hub" },
    ],
    supportContact: { email: "support@example.com", phone: "+880-1234-567890" },
  },

  // 2. Delayed — ETA has already passed, order still not delivered.
  {
    id: "ORD-1002",
    status: "out_for_delivery",
    placedAt: hoursFromNow(-72),
    estimatedDelivery: hoursFromNow(-5), // in the past → triggers "delayed"
    products: [
      {
        id: "P-02",
        name: "Ceramic Coffee Mug Set (4-pack)",
        imageUrl: "/products/mugs.jpg",
        quantity: 1,
        price: 24.5,
      },
    ],
    trackingEvents: [
      { status: "processing", label: "Order confirmed", timestamp: hoursFromNow(-72) },
      { status: "shipped", label: "Shipped from warehouse", timestamp: hoursFromNow(-50) },
      { status: "out_for_delivery", label: "Out for delivery", timestamp: hoursFromNow(-20), location: "Dhaka Hub" },
    ],
    supportContact: { email: "support@example.com" },
  },

  // 3. Disputed — system says delivered, customer says otherwise.
  {
    id: "ORD-1003",
    status: "delivered",
    placedAt: hoursFromNow(-96),
    estimatedDelivery: hoursFromNow(-24),
    actualDeliveredAt: hoursFromNow(-22),
    products: [
      {
        id: "P-03",
        name: "Mechanical Keyboard (Blue Switches)",
        imageUrl: "/products/keyboard.jpg",
        quantity: 1,
        price: 65.0,
      },
    ],
    trackingEvents: [
      { status: "processing", label: "Order confirmed", timestamp: hoursFromNow(-96) },
      { status: "shipped", label: "Shipped from warehouse", timestamp: hoursFromNow(-70) },
      { status: "out_for_delivery", label: "Out for delivery", timestamp: hoursFromNow(-24) },
      { status: "delivered", label: "Delivered — left at front door", timestamp: hoursFromNow(-22) },
    ],
    customerReportedNotReceived: true, // triggers "disputed"
    supportContact: { email: "support@example.com", phone: "+880-1234-567890" },
  },

  // 4. Tracking unavailable — order exists, no tracking events yet.
  {
    id: "ORD-1004",
    status: "processing",
    placedAt: hoursFromNow(-1),
    estimatedDelivery: hoursFromNow(96),
    products: [
      {
        id: "P-04",
        name: "Running Shoes — Size 9",
        imageUrl: "/products/shoes.jpg",
        quantity: 1,
        price: 54.99,
      },
    ],
    trackingEvents: [], // empty on purpose → triggers "tracking_unavailable"
    supportContact: { email: "support@example.com" },
  },

  // 5. Delivered normally — no dispute, nothing unusual.
  {
    id: "ORD-1005",
    status: "delivered",
    placedAt: hoursFromNow(-120),
    estimatedDelivery: hoursFromNow(-48),
    actualDeliveredAt: hoursFromNow(-47),
    products: [
      {
        id: "P-05",
        name: "Desk Lamp with USB Charging Port",
        imageUrl: "/products/lamp.jpg",
        quantity: 2,
        price: 19.99,
      },
    ],
    trackingEvents: [
      { status: "processing", label: "Order confirmed", timestamp: hoursFromNow(-120) },
      { status: "shipped", label: "Shipped from warehouse", timestamp: hoursFromNow(-90) },
      { status: "out_for_delivery", label: "Out for delivery", timestamp: hoursFromNow(-48) },
      { status: "delivered", label: "Delivered — signed by recipient", timestamp: hoursFromNow(-47) },
    ],
    supportContact: { email: "support@example.com" },
  },
];

/** Looks up a mock order by id. Returns undefined if not found. */
export function getMockOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id);
}