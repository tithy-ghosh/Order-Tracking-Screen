import type { OrderProduct } from "@/data/types";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  products: OrderProduct[];
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

export function OrderSummary({ products }: OrderSummaryProps) {
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const units = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h3 className="text-[14px] font-semibold text-ink">Items</h3>
        <span className="text-[12px] font-medium text-ink-mute">
          {units} {units === 1 ? "item" : "items"}
        </span>
      </div>

      <ul role="list" className="divide-y divide-line">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3.5 px-5 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl border border-line bg-paper object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{product.name}</p>
              <p className="mt-1 text-[12px] text-ink-mute">Qty {product.quantity}</p>
            </div>
            <p className="shrink-0 text-[14px] font-semibold text-ink">
              {formatPrice(product.price * product.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-1.5 border-t border-line bg-paper/40 px-5 py-4">
        <div className="flex items-center justify-between text-[13px] text-ink-soft">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] text-ink-soft">
          <span>Shipping</span>
          <span className={cn("font-semibold text-green")}>Free</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
          <span className="text-[14px] font-semibold text-ink">Total</span>
          <span className="text-[15px] font-bold text-ink">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}