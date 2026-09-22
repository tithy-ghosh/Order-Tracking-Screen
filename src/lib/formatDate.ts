/**
 * lib/formatDate.ts
 *
 * Small formatting helpers shared by any component that displays
 * order timestamps (timeline events, estimated delivery, etc.).
 * Centralized so date formatting is consistent everywhere and locale
 * changes only need to happen in one place.
 */

/** e.g. "Mar 14" — used where time-of-day isn't needed. */
export function formatDate(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(isoTimestamp));
}

/** e.g. "Mar 14, 3:45 PM" */
export function formatDateTime(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
}

/** e.g. "Thu, Mar 14" — used for delivery estimates. */
export function formatWeekdayDate(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(isoTimestamp));
}

/** e.g. "3:45 PM" */
export function formatTime(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
}