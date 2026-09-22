/**
 * lib/utils.ts
 *
 * `cn()` merges class names and resolves conflicting Tailwind classes
 * (e.g. cn("p-2", condition && "p-4") correctly keeps only "p-4").
 * This is the standard shadcn/ui utility — every generated component
 * imports it, so it needs to exist before running `npx shadcn add ...`.
 */

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}