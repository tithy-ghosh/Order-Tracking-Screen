"use client";

import { use } from "react";
import { PackageOpen } from "lucide-react";

import { useOrder } from "@/hooks/useOrder";
import { OrderTrackingScreen } from "@/components/order/OrderTrackingScreen";
import { OrderPageHeader } from "@/components/order/OrderPageHeader";
import { ScreenShell } from "@/components/ui/screen-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderId } = use(params);
  const state = useOrder(orderId, { forceError: orderId === "demo-error" });

  if (state.status === "loading") {
    return <OrderTrackingSkeleton />;
  }

  if (state.status === "error") {
    return (
      <ScreenShell aria-label="Order tracking">
        <OrderPageHeader orderId={orderId} />
        <EmptyState
          icon={PackageOpen}
          title="Couldn't load this order"
          description={state.message}
          actionLabel="Try again"
          onAction={state.refetch}
        />
      </ScreenShell>
    );
  }

  return <OrderTrackingScreen order={state.data} />;
}

function OrderTrackingSkeleton() {
  return (
    <ScreenShell aria-busy="true" aria-label="Loading order tracking">
      <header className="mb-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mt-5 h-3 w-28" />
        <Skeleton className="mt-2 h-7 w-44" />
      </header>

      <Skeleton className="mb-6 h-28 w-full rounded-2xl" />

      <div className="mb-2 px-1">
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mb-6 h-64 w-full rounded-2xl" />

      <Skeleton className="mb-6 h-24 w-full rounded-2xl" />

      <div className="mb-2 px-1">
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="mb-6 h-52 w-full rounded-2xl" />

      <Skeleton className="h-24 w-full rounded-2xl" />
    </ScreenShell>
  );
}