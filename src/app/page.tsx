"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Package, Search, SearchX, X } from "lucide-react";

import { mockOrders } from "@/data/mockOrders";
import type { DeliveryState, Order } from "@/data/types";
import {
  getDeliveryState,
  getDeliveryStateMeta,
  type DeliveryStateMeta,
  type DeliveryStateMetaTone,
} from "@/lib/getOrderStatus";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { ScreenShell } from "@/components/ui/screen-shell";
import { EmptyState } from "@/components/ui/empty-state";

type TabKey = "all" | "in_progress" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
];

const TONE_BADGE: Record<DeliveryStateMetaTone, string> = {
  neutral: "bg-brand-soft text-brand",
  positive: "bg-green-soft text-green",
  warning: "bg-amber-soft text-amber",
  critical: "bg-brick-soft text-brick",
};

const TONE_STRIP: Record<DeliveryStateMetaTone, string> = {
  neutral: "bg-gradient-to-r from-brand to-brand/60",
  positive: "bg-gradient-to-r from-green to-green/60",
  warning: "bg-gradient-to-r from-amber to-amber/60",
  critical: "bg-gradient-to-r from-brick to-brick/60",
};

const DEMO_LINK_CLASSES =
  "inline-flex items-center rounded-full border border-line bg-paper px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-brand hover:text-brand";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

interface OrderRow {
  order: Order;
  state: DeliveryState;
  meta: DeliveryStateMeta;
  tone: DeliveryStateMetaTone;
  total: number;
  units: number;
  primaryProduct?: Order["products"][number];
  extraProducts: number;
}

function buildRow(order: Order): OrderRow {
  const state = getDeliveryState(order);
  const meta = getDeliveryStateMeta(state);
  return {
    order,
    state,
    meta,
    tone: meta.tone,
    total: order.products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    units: order.products.reduce((sum, p) => sum + p.quantity, 0),
    primaryProduct: order.products[0],
    extraProducts: order.products.length - 1,
  };
}

function matchesTab(order: Order, tab: TabKey): boolean {
  if (tab === "all") return true;
  return tab === "completed" ? order.status === "delivered" : order.status !== "delivered";
}

function matchesSearch(order: Order, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (order.id.toLowerCase().includes(q)) return true;
  return order.products.some((p) => p.name.toLowerCase().includes(q));
}

export default function Home() {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      mockOrders
        .filter((o) => matchesTab(o, tab))
        .filter((o) => matchesSearch(o, query))
        .map(buildRow),
    [tab, query]
  );

  const countFor = (key: TabKey) => mockOrders.filter((o) => matchesTab(o, key)).length;
  const hasQuery = query.trim().length > 0;

  return (
    <ScreenShell>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-card">
            <Package className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[12px] font-medium text-ink-mute">Harbor Goods · Orders</p>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-ink">
              Your orders
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-[300px] text-[13px] leading-snug text-ink-soft">
          Track deliveries, follow packages, and get help when something doesn&apos;t feel right.
        </p>
      </header>

      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID or item"
          className="w-full rounded-xl border border-line bg-white py-2.5 pl-11 pr-9 text-[14px] text-ink shadow-card outline-none transition-all placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-mute transition-colors hover:bg-paper-deep hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Filter orders"
        className="mb-5 grid grid-cols-3 gap-1 rounded-xl border border-line bg-paper-deep/70 p-1 shadow-[inset_0_1px_2px_rgb(16_20_24/0.04)]"
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition-all",
                active
                  ? "bg-white text-ink shadow-card"
                  : "text-ink-soft hover:bg-white/60 hover:text-ink"
              )}
            >
              {t.label}
              <span
                className={cn("text-[11px] font-medium", active ? "text-ink-mute" : "text-ink-faint")}
                aria-hidden="true"
              >
                {countFor(t.key)}
              </span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No orders found"
          description={
            hasQuery
              ? `Nothing matches "${query.trim()}". Try a different order ID or item.`
              : "There are no orders in this view right now."
          }
          actionLabel={hasQuery ? "Clear search" : undefined}
          onAction={hasQuery ? () => setQuery("") : undefined}
        />
      ) : (
        <ul role="list" className="flex flex-col gap-3.5">
          {rows.map((row) => (
            <li key={row.order.id}>
              <OrderCard row={row} />
            </li>
          ))}
        </ul>
      )}

      <section
        aria-label="Demo error states"
        className="mt-8 rounded-2xl border border-dashed border-line-strong bg-card-surface/60 p-4"
      >
        <h2 className="text-[13px] font-semibold text-ink">Demo error states</h2>
        <p className="mt-0.5 text-[12px] leading-snug text-ink-mute">
          Routes that exercise the tracking screen&apos;s loading, error, and empty states.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/order/ORD-9999" className={DEMO_LINK_CLASSES}>
            Order not found
          </Link>
          <Link href="/order/demo-error" className={DEMO_LINK_CLASSES}>
            Simulated network error
          </Link>
        </div>
      </section>
    </ScreenShell>
  );
}

function OrderCard({ row }: { row: OrderRow }) {
  const { order, meta, tone, total, units, primaryProduct, extraProducts } = row;
  const delivered = order.actualDeliveredAt;
  const deliveryText = delivered ? "Delivered" : "Est. delivery";
  const deliveryDate = delivered ?? order.estimatedDelivery;

  return (
    <Link
      href={`/order/${order.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-float"
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-[3px]", TONE_STRIP[tone])}
      />

      <div className="px-4 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
            {order.id}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              TONE_BADGE[tone]
            )}
          >
            {meta.title}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {primaryProduct && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryProduct.imageUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-ink">
              {primaryProduct?.name}
              {extraProducts > 0 && <span className="font-medium text-ink-soft"> +{extraProducts} more</span>}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-mute">
              {units} {units === 1 ? "item" : "items"} · {formatPrice(total)}
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3 text-[12px] text-ink-mute">
          <span>Placed {formatDate(order.placedAt)}</span>
          <span className="flex items-center gap-1 font-semibold text-ink">
            <span className="font-medium text-ink-soft">{deliveryText}</span>
            {formatDate(deliveryDate)}
            <ChevronRight
              className="h-3.5 w-3.5 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}