import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OrderPageHeaderProps {
  orderId: string;
}

/** Shared header for the tracking screen and its loading/error screens. */
export function OrderPageHeader({ orderId }: OrderPageHeaderProps) {
  return (
    <header className="mb-6">
      <Link href="/" className="group inline-flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-card transition-colors group-hover:border-brand group-hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[13px] font-medium text-ink-soft transition-colors group-hover:text-brand">
          All orders
        </span>
      </Link>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-mute">
        Order {orderId}
      </p>
      <h1 className="mt-1 text-[24px] font-semibold tracking-tight text-ink">Order tracking</h1>
    </header>
  );
}