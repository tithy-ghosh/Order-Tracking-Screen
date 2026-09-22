# Order Tracking Screen

A mobile-first **order tracking** screen for an e-commerce store, built with
Next.js (App Router), TypeScript, and Tailwind CSS. It renders a delivery
timeline, current status, ETA, item summary, and support options — and
handles the trickier situations a courier status alone doesn't resolve.

## Highlights

- **Delivery timeline** — confirmed → shipped → out for delivery → delivered,
  with dates, times, locations, and a filled progress rail.
- **Status banner** — a plain-language summary with the right next action:
  on the way, delivered, delayed, item disputed, or tracking not available.
- **ETA** — estimated delivery date/time (turns amber when the order runs late).
- **Product summary** — items, quantities, and prices with a subtotal / total.
- **Support** — call or email the store directly from the order screen.
- **Loading & error states** — skeleton layout while loading, inline retryable
  error, and a not-found state.
- **Responsive** — designed for ~360–430px phone widths, centered up to 448px.
- **Design system** — all colors/shadows are defined as tokens in
  `src/app/globals.css` and used consistently across every screen.

## Getting Started

Prerequisites: Node.js 18.18+ (this repo uses Next.js 16 and Turbopack).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script      | Purpose                                    |
| ----------- | ------------------------------------------ |
| `npm run dev`    | Start the dev server (Turbopack)     |
| `npm run build`  | Production build                     |
| `npm start`      | Serve the production build           |
| `npm run lint`   | ESLint (Next + TypeScript rules)     |
| `npx tsc --noEmit` | Type-check without emitting       |

## Demo orders

The data layer is a mock behind a simulated network delay
(`src/hooks/useOrder.ts`), standing in for a real API. It ships with one order
for every delivery situation:

| Order       | Situation                                                              |
| ----------- | ---------------------------------------------------------------------- |
| `ORD-1001`  | **On track** — normal happy path, ETA still in the future               |
| `ORD-1002`  | **Delayed** — ETA has passed, still out for delivery                    |
| `ORD-1003`  | **Disputed** — marked delivered, but the customer says it didn't arrive |
| `ORD-1004`  | **Tracking unavailable** — placed, no tracking events yet               |
| `ORD-1005`  | **Delivered** — delivered normally, no issues                           |

Timestamps in `src/data/mockOrders.ts` are generated relative to load time, so
the delayed / on-track states stay correct no matter when the app is opened.

## Demo error states

- `/order/ORD-9999` — an order ID that doesn't exist (empty/not-found state).
- `/order/demo-error` — a forced network error with a **Try again** retry.

## Project structure

```
src/
  app/
    page.tsx                 # Orders screen (search, filter, cards)
    order/[orderId]/page.tsx # Tracking screen route (loading/error/success)
    globals.css              # Design tokens + base styles
  components/
    order/                   # OrderTrackingScreen, timeline, banner, summary…
    ui/                      # Button, Badge, Card, Skeleton, EmptyState, shell
  hooks/useOrder.ts          # Simulated fetch hook (delay, error, refetch)
  lib/                       # getOrderStatus, formatDate, cn
  data/                      # Order types + mock orders
```

Status logic lives in one place: `src/lib/getOrderStatus.ts` turns a raw order
into a `DeliveryState` (`on_track | delivered | delayed | disputed |
tracking_unavailable`), and every screen section reads from it — so the
timeline, banner, and summary always agree.

## Prompts Used


**Step 1 — Project brief (Claude):**
> "I want to build an order tracking screen for an e-commerce app — mobile-first,
> Next.js, TypeScript, Tailwind. It needs a delivery timeline (confirmed → shipped
> → out for delivery → delivered), a status banner for edge cases like delayed or
> disputed orders, ETA, product summary, support options, and loading/error states.
> Before writing any code, break this into phases and give me the folder structure
> first."

**Step 2 — Folder structure:**
> "Give me the folder structure for this project first, before any phase work."

**Step 3 — Phase-by-phase build:**
> "Now give me the work for Phase 1 only. Don't move to the next phase until I
> confirm this one is done."
> (repeated for each subsequent phase — data layer, status logic, UI components,
> loading/error states, responsiveness)

**UI design (opencode):**
> Used opencode to design and refine the visual styling on top of the structure
> and components from the phases above, using the tokens defined in
> `src/app/globals.css`.