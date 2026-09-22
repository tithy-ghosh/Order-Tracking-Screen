import { CalendarDays, Truck } from "lucide-react";

import { formatTime, formatWeekdayDate } from "@/lib/formatDate";
import type { DeliveryState, Order } from "@/data/types";
import { cn } from "@/lib/utils";

interface DeliveryInfoProps {
  order: Order;
  deliveryState: DeliveryState;
}

export function DeliveryInfo({ order, deliveryState }: DeliveryInfoProps) {
  const isDelivered = order.status === "delivered" && order.actualDeliveredAt;

  const deliveryLabel = isDelivered ? "Delivered" : "Estimated delivery";
  const deliveryDateIso = isDelivered ? order.actualDeliveredAt! : order.estimatedDelivery;
  const delayed = deliveryState === "delayed";

  return (
    <dl className="grid grid-cols-2 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper-deep text-ink-mute">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
            Order placed
          </dt>
          <dd className="mt-1 text-[14px] font-semibold text-ink">
            {formatWeekdayDate(order.placedAt)}
          </dd>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            delayed ? "bg-amber-soft text-amber" : "bg-brand-soft text-brand"
          )}
        >
          <Truck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
            {deliveryLabel}
          </dt>
          <dd className={cn("mt-1 text-[14px] font-semibold", delayed ? "text-amber" : "text-ink")}>
            {formatWeekdayDate(deliveryDateIso)}
            <span className="font-medium text-ink-mute"> · {formatTime(deliveryDateIso)}</span>
          </dd>
        </div>
      </div>
    </dl>
  );
}