# 05 - Page UX

> 🟢 **Built** against the dummy data in [06-dummy-data.md](06-dummy-data.md).
> Everything below describes the shipped page; 🔴 items still need real values.
>
> ⚠️ **Wireframe stage.** This is being treated as a wireframe while the
> `/operations` UI as a whole gets redesigned - expect layout/visuals to change
> again. What's below is accurate to the current build, not a final design.

Route: `apps/frontend/src/pages/operations/index.astro`. Not linked from the
public site and served `noindex, nofollow`.

## Implementation

The page is a thin Astro route in a chrome-free `OperationsLayout.astro` (no
marketing Header/Footer, no analytics, no smooth-scroll) that mounts a **single
React island**, `OperationsApp`, with `client:only="react"` - so the PIN gate
decides what to render before anything paints.

React (not vanilla `<script>`) because the state is genuinely interdependent:
the end date derives from the start date but a manual edit has to stick, the
breakdown re-renders on every input, and the gate swaps the whole screen. The
`neevo` component library is reused for inputs, selects and buttons.

| File | Role |
| --- | --- |
| `layouts/OperationsLayout.astro` | Chrome-free shell, `noindex` |
| `components/operations/OperationsApp.tsx` | Gate → launcher → pages, holds the selected center |
| `components/operations/BatchesList.tsx` | Batches page - center tabs, plans table, text/image share |
| `components/operations/PaymentQr.tsx` | Payments page - Global QR / Fee Payment / Custom tabs |
| `components/operations/Segmented.tsx` | Tab row; `visibleCount` pins how many fit before it scrolls |
| `components/operations/use-fee-inputs.ts` | Shared calculator state (used by the Fee Payment tab) |
| `components/operations/FeeInputFields.tsx` | Center / batch / months / days-per-week / registration / dates inputs |
| `components/operations/operations.module.scss` | Mobile-first styles |
| `utils/fee-calculator.util.ts` | The [02](02-fee-calculation.md) algorithm |
| `utils/fee-structure-image.util.ts` | Draws the shareable PNG; `sections` picks fees / timings / both |
| `utils/operations.util.ts` | Batch timing / weekday / plan-label formatting |
| `data/operations.data.ts` | 🔴 partly DUMMY payload, shaped like `GET /operations/centers` - UPI ID is now real, the rest is still placeholder |

Data is the static typed config described in [04-api.md](04-api.md); swapping it
for the live endpoint needs no UI change.

Dependency added: `qrcode` (+ `@types/qrcode`).

> **Retired:** `CentersList.tsx`, `FeeCalculator.tsx` and `FeeStructure.tsx` were
> each their own page/tool in an earlier revision. All three were folded into
> `BatchesList.tsx` and `PaymentQr.tsx` below - see "What changed" at the
> bottom of this doc.

## PIN gate

- On load, if no valid flag in `localStorage`, show a passcode screen.
- Correct PIN → store a flag in `localStorage`, reveal the pages.
- Shared single PIN for all staff (no per-user accounts).
- ✅ **Checked on the frontend** (simple client-side compare). Note: this is
  light obfuscation, not real security - anyone reading the JS can find the PIN.
  Fine for an unlisted internal tool. PIN value 🔴 DUMMY `1234` (see
  [06-dummy-data.md](06-dummy-data.md)). Replace.

## Home

Two icons: **Batches** and **Payments**. No separate "Fee Calculator", "Send
Fee Structure" or "Centers" tiles - those three are now folded into the two
pages below.

## Page 1 - Batches

Staff reference **and** the quickest way to send a batch's details to a parent.
No registration-options card (removed - not needed here).

- Centers (`Ghatkopar East` / `Ghatkopar West`) are **tabs**, not a stacked
  list.
- For the selected center: address, then each batch with its age group,
  schedule pills (from `formatBatchTimingLines`), and its **plans in a
  table** (`Plan` / `Price` columns) rather than a flex price-row list.

### Sharing

A page-level **Share as** toggle (`Text` / `Image`) sets the format once, then
every batch card carries the same three buttons:

| Button | Sends |
| --- | --- |
| **Timings** | Batch name, age group, address, schedule. **No prices** |
| **Fees** | Plans + prices, registration options, address |
| **Fees + timings** | Everything above |

- **Text** goes through `navigator.share({ text })`, falling back to a
  clipboard copy when the share sheet is unavailable.
- **Image** renders the card with `renderFeeStructureImage` and shares the PNG
  via `navigator.share({ files })`, falling back to a download. The renderer
  takes a `sections` argument (`plans` / `registration` / `schedule`), and the
  canvas height and the eyebrow title (`SCHEDULE` / `FEE STRUCTURE` /
  `FEES & SCHEDULE`) follow whichever blocks are switched on.
- **Registration prices ride with `plans`, never with a timings-only card** -
  otherwise a "just the timings" share would leak fees.

## Page 2 - Payments

Three tabs, switched with a `Segmented` control: **Global QR**, **Fee
Payment**, **Custom**.

### Global QR

Static UPI QR, no amount encoded (`upi://pay?pa=<upi>&pn=<payee>&cu=INR`).
Parent types the amount themselves. Downloadable / shareable.

### Fee Payment

This tab now does everything the old "Fee Calculator" and "Send Fee
Structure" tools did, off **one shared** center/batch selection - no second
picker, no separate page.

Inputs: center, batch, **number of months**, **days per week**, registration
(optional), start date, end date, name (optional), phone (optional).

- **Months**, **days per week** and **registration** are all one-tap segmented
  tab rows (not dropdowns - staff were paying two taps per field). The rows
  scroll sideways when the options do not fit: months shows **3 at a time**,
  registration **2 at a time**, via `Segmented`'s `visibleCount` prop.
- The pair resolves a plan together: months lists the durations the batch
  sells, days-per-week the attendance options at that duration. **Changing the
  duration keeps the current days-per-week** (a 2-day student switching 1 → 3
  months stays on 2 days) - the options are keyed by days-per-week, not by
  plan id, so they also keep their identity across a duration change instead
  of remounting.
- When the plan's days-per-week is fewer than the batch's session days, a
  day-picker chip row appears below (e.g. batch runs Mon/Wed/Fri, plan is
  2 days/week → pick which 2).
- **End date auto-fills** from the start date (default rule in
  [02-fee-calculation.md](02-fee-calculation.md#default-end-date)) but is
  **editable**. A multi-month plan snaps the start to the 1st and pins the
  end date to the flat term price.

Once a batch and plan are picked, two things render below the inputs:

1. **Fees breakdown** - total due, then one row per billed month (e.g.
   `11-31 Aug: 9 x Rs 285 - part month`, `Sep 2026: full month - flat price`),
   plus the registration row when one is selected, and the date-range
   footnote. This is what the old standalone Fee Calculator showed.
   There is deliberately **no fee-structure image/message here**: at the point
   of taking payment the parent already has the fee structure, they only need
   to see how the amount was arrived at. Sharing the structure lives on the
   Batches page instead.
2. **Payment QR** - the computed total (via [02-fee-calculation.md](02-fee-calculation.md))
   baked into `am=`, plus the student name and plan in `tn` (the UPI note) -
   see [04-api.md](04-api.md#reconciliation-note). Download saves a PNG; with
   a phone number entered the action becomes WhatsApp, otherwise the native
   share sheet, falling back to copying the UPI link.

### Custom

For amounts that don't map to a batch/plan (e.g. a jersey order). An amount
field plus an optional **Description**, with name/phone optional. The
description goes into **both** the UPI `tn` note (so the payer sees what they
are paying for in their UPI app, capped at 50 characters) and the share
message - `Hi Hussain, here is the QR code for the payment of your Jersey
order 2026. Amount: Rs 500.` Same Download/Share/WhatsApp actions as Fee
Payment.

> Caveat: some UPI apps let the payer edit `tn`, so treat it as a label, not
> a guarantee - see [04-api.md](04-api.md#reconciliation-note).

## Mobile-first

Coaches use this on-spot on phones, so the layout is mobile-first with large tap
targets and easy copy/share actions.

**As built:** one column with 44px minimum tap targets; the date pair goes
side-by-side from 480px; from 992px the layout becomes a persistent 260px tool
rail beside the panel. Verified at 375px and 1280px with no horizontal overflow
and a clean console.

⚠️ **Segmented rows must never size to content.** `.segmentedOption` originally
used `flex: 1` with `white-space: nowrap`, so once a row held more (or longer)
tabs than fitted, the buttons shrank below their text, the labels bled out of
the card and the whole page picked up a horizontal scrollbar (measured 587px of
content in a 375px viewport). The row now scrolls inside itself
(`overflow-x: auto`, scrollbar hidden) and `visibleCount` pins each option to an
exact fraction of the row. Re-check this whenever an option label gets longer or
a row gains an option.

For the same reason, do not hardcode `gridTemplateColumns` on `.buttonRow` -
it is already mobile-first (1 column, 2 from 480px) and an inline override
reintroduces the overflow.

## What changed (revision history)

The page originally shipped with **four** tools: Fee Calculator, Send Fee
Structure, Payment QR, Centers. Based on direct feedback that this duplicated
the same center/batch selection and fee math in multiple places, it was
consolidated to the **two pages** described above:

- `CentersList.tsx` → renamed/rebuilt as `BatchesList.tsx` (centers as tabs,
  no registration-options card, plans as a table).
- `FeeCalculator.tsx` → retired. Its calculation is what the Fee Payment tab
  already computes to bake into the QR amount - no separate "calculate first,
  then go generate a QR" step.
- `FeeStructure.tsx` → retired. Sharing the fee structure moved to the
  **Batches** page (where staff are already looking at the batch), as
  text-or-image share buttons. It briefly lived on the Fee Payment tab as an
  inlined copy of the old component; that was removed once it was clear the
  parent already has the structure by the time they are paying.
- Payment QR's "Student QR" tab was renamed **Fee Payment**, and a third
  **Custom** tab was added for amounts not tied to a batch/plan (with a
  Description that reaches the payer's UPI app).
- The Plan dropdown became **Number of months** + **Days per week**, first as
  cascading selects, then as one-tap segmented rows.
- The Fee Payment tab gained the **fees breakdown** the retired Fee Calculator
  used to show.
- Every duration now sells both a 2-day and a 3-day plan
  (`operations.data.ts`), so days-per-week is a stable choice rather than
  something that appears and disappears per duration.
