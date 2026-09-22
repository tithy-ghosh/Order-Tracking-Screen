import { ChevronRight, Mail, Phone } from "lucide-react";

import type { Order } from "@/data/types";

interface ContactSupportButtonProps {
  supportContact: Order["supportContact"];

  label?: string;
}

export function ContactSupportButton({ supportContact }: ContactSupportButtonProps) {
  const { phone, email } = supportContact;

  if (!phone && !email) {
    return (
      <p className="text-[13px] text-ink-mute">Support contact unavailable for this order.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {phone && (
        <a
          href={`tel:${phone}`}
          className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-paper/60"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Phone className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-ink">Call support</span>
            <span className="block truncate text-[12px] text-ink-mute">{phone}</span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-brand"
            aria-hidden="true"
          />
        </a>
      )}
      {phone && email && <div className="mx-5 h-px bg-line" aria-hidden="true" />}
      {email && (
        <a
          href={`mailto:${email}`}
          className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-paper/60"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Mail className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-ink">Email support</span>
            <span className="block truncate text-[12px] text-ink-mute">{email}</span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-brand"
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}