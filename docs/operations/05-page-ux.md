# 05 - Page UX

> 🟢 **Built** against the dummy data in [06-dummy-data.md](06-dummy-data.md).
> Everything below describes the shipped page; 🔴 items still need real values.

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
| `components/operations/OperationsApp.tsx` | Gate → launcher → tools, holds the selected center |
| `components/operations/use-fee-inputs.ts` | Shared calculator state (calculator + student QR) |
| `components/operations/FeeInputFields.tsx` | Center / batch / plan / days / dates inputs |
| `components/operations/operations.module.scss` | Mobile-first styles |
| `utils/fee-calculator.util.ts` | The [02](02-fee-calculation.md) algorithm |
| `utils/fee-structure-image.util.ts` | Draws the shareable fee-structure PNG |
| `utils/operations.util.ts` | Batch timing / weekday formatting |
| `data/operations.data.ts` | 🔴 DUMMY payload, shaped like `GET /operations/centers` |

Data is the static typed config described in [04-api.md](04-api.md); swapping it
for the live endpoint needs no UI change.

Dependency added: `qrcode` (+ `@types/qrcode`).

## PIN gate

- On load, if no valid flag in `localStorage`, show a passcode screen.
- Correct PIN → store a flag in `localStorage`, reveal the tools.
- Shared single PIN for all staff (no per-user accounts).
- ✅ **Checked on the frontend** (simple client-side compare). Note: this is
  light obfuscation, not real security - anyone reading the JS can find the PIN.
  Fine for an unlisted internal tool. PIN value 🔴 DUMMY `1234` (see
  [06-dummy-data.md](06-dummy-data.md)). Replace.

## Tool 1 - Fee Calculator

Inputs: center, **batch**, plan (1-month / 3-month), days per week (2 / 3),
**start date**, **end date**.

The batch matters: it carries the session weekdays, so it decides how many
sessions a partial month contains.

- **End date auto-fills** from the start date (default rule in
  [02-fee-calculation.md](02-fee-calculation.md#default-end-date)) but is
  **editable** - staff can shorten/extend it (e.g. 31 Jul → 30 Jun).
- Changing start date recomputes the default end date; a manual end-date edit
  sticks until start date changes again.

Output: total amount + line-item breakdown per month (which months are full ₹ vs
partial `sessions × the plan's stored per-session price`). No holiday
adjustment and no rounding.

**As built:** plan and days/week are segmented switches, not dropdowns. There is
no Calculate button - the total recomputes live. A 2-day plan shows a day-picker
capped at 2 of the center's session weekdays (defaults to the first two). A
3-month plan snaps the start to the 1st, pins the end date and bills the flat
term price. ⚠️ That rule is inherited from the retired 6-month plan - confirm
whether a 3-month plan should allow a mid-month start with pro-rata. Picking a
combination the center does not sell shows a notice instead of a total.

Verified in-browser against the worked examples in
[02-fee-calculation.md](02-fee-calculation.md), including example D, where
switching to the Morning batch changes the same dates from ₹3,970 to ₹4,255.

## Tool 2 - Send Fee Structure

Inputs: center (required), parent name (optional), parent phone (required for
the text route). Action: build the fee structure for that center as an image
and as text, and hand it to WhatsApp.

Message content (✅ confirmed): **plans + prices for the chosen center + academy
name, address, timings. No QR / UPI in this message.** Exact wording + per-center
address/timings still needed (Q6/Q7).

**As built:** no coach data is stored (see `DATABASE.md`), so the message and
image are signed off with the academy name only, no sender picker. An Image /
Message preview toggle:

- **Image** - the structure drawn to a PNG on a canvas, with **Copy image**
  (clipboard, for pasting into a chat) and **Send image** (the OS share sheet,
  which is the only route into WhatsApp - a `wa.me` link cannot carry an
  attachment).
- **Message** - the text, with **Copy message** and **WhatsApp**. A bare
  10-digit number gets `91` prefixed automatically.

Timings in both come from the center's **batches**, one line each.

## Tool 3 - Payment QR

Uses **one global UPI ID + payee** for everything (✅ confirmed - not per-center).

- **Global QR:** static UPI QR (no amount) shown/downloadable to share with any
  parent; parent types the amount.
- **Dynamic QR:** inputs (plan, days/week, center for pricing, name + number
  optional) → compute amount via [02-fee-calculation.md](02-fee-calculation.md)
  → generate a UPI QR encoding
  `upi://pay?pa=<global-upi>&pn=<payee>&am=<amount>&cu=INR`, kept visually
  simple. Downloadable / shareable.

QR rendering: a small client-side QR library (e.g. `qrcode`) added as a
dependency, rendered into a canvas/img in the browser.

**As built:** a Global / Student switch. Student mode reuses the calculator
fields, takes an optional **student name** and **parent phone**, and bakes the
computed total into `am=`. The name and plan also go into `tn` (the UPI
transaction note) so the credit can be matched to a student in the settlement
report - see [04-api.md](04-api.md#reconciliation-note). Download saves a PNG;
with a phone number the action becomes WhatsApp, otherwise it is the native
share sheet, falling back to copying the UPI link.

## Mobile-first

Coaches use this on-spot on phones, so the layout is mobile-first with large tap
targets and easy copy/share actions.

**As built:** one column with 44px minimum tap targets; the date pair goes
side-by-side from 480px; from 992px the layout becomes a persistent 260px tool
rail beside the panel. Verified at 375px and 1280px with no horizontal overflow
and a clean console.
