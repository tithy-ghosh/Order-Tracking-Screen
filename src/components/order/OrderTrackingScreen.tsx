"use client";

import { useRef } from "react";
import type { Order } from "@/data/types";
import { getDeliveryState } from "@/lib/getOrderStatus";
import { ScreenShell } from "@/components/ui/screen-shell";
import { OrderPageHeader } from "./OrderPageHeader";
import { OrderStateBanner } from "./OrderStateBanner";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { DeliveryInfo } from "./DeliveryInfo";
import { OrderSummary } from "./OrderSummary";
import { ContactSupportButton } from "./ContactSupportButton";

interface OrderTrackingScreenProps {
  order: Order;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-mute">
      {children}
    </h2>
  );
}

export function OrderTrackingScreen({ order }: OrderTrackingScreenProps) {
  const deliveryState = getDeliveryState(order);
  const supportRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLElement>(null);

  const scrollToSupport = () => {
    supportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToItems = () => {
    itemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // The banner's primary action differs per state:
  //  - delivered orders jump to the item list ("view order details").
  //  - everything else with a problem routes to the support section.
  //  - on-track orders get no action pill — the timeline below already
  //    shows everything at a glance.
  const bannerOnAction =
    deliveryState === "delivered" ? scrollToItems : deliveryState === "on_track" ? undefined : scrollToSupport;

  return (
    <ScreenShell>
      <OrderPageHeader orderId={order.id} />

      <section aria-label="Delivery status" className="mb-6">
        <OrderStateBanner order={order} deliveryState={deliveryState} onAction={bannerOnAction} />
      </section>

      <section aria-label="Delivery progress" className="mb-6 scroll-mt-6">
        <SectionLabel>Progress</SectionLabel>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <OrderStatusTimeline order={order} deliveryState={deliveryState} />
        </div>
      </section>

      <section aria-label="Delivery details" className="mb-6">
        <DeliveryInfo order={order} deliveryState={deliveryState} />
      </section>

      <section aria-label="Items in this order" ref={itemsRef} className="mb-6 scroll-mt-6">
        <SectionLabel>Items</SectionLabel>
        <OrderSummary products={order.products} />
      </section>

      <section aria-label="Contact support" ref={supportRef} className="scroll-mt-6">
        <h2 className="mb-2 px-1 text-[13px] font-semibold text-ink">
          Need help with this order?
        </h2>
        <ContactSupportButton supportContact={order.supportContact} />
      </section>
    </ScreenShell>
  );
}