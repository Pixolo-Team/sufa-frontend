# 05 - Page UX

> ⏳ **Blocked** on requirements. Draft outline below.

Route: `src/pages/operations/index.astro`, wrapped in `BaseLayout`. Not linked
from the public site. Interactivity via vanilla `<script>` blocks.

## PIN gate

- On load, if no valid flag in `localStorage`, show a passcode screen.
- Correct PIN → store a flag in `localStorage`, reveal the tools.
- Shared single PIN for all staff (no per-user accounts).
- ✅ **Checked on the frontend** (simple client-side compare). Note: this is
  light obfuscation, not real security - anyone reading the JS can find the PIN.
  Fine for an unlisted internal tool. PIN value 🔴 DUMMY `1234` (see
  [06-dummy-data.md](06-dummy-data.md)). Replace.

## Tool 1 - Fee Calculator

Inputs: center, plan (1-month / 6-month), days per week (2 / 3), **start date**,
**end date**.

- **End date auto-fills** from the start date (default rule in
  [02-fee-calculation.md](02-fee-calculation.md#default-end-date)) but is
  **editable** - staff can shorten/extend it (e.g. 31 Jul → 30 Jun).
- Changing start date recomputes the default end date; a manual end-date edit
  sticks until start date changes again.

Output: total amount + line-item breakdown per month (which months are full ₹ vs
partial `sessions × 285`). No holiday adjustment.

## Tool 2 - Send Fee Structure

Inputs: center (required), parent name (optional), parent phone (required).
Action: build the fee-structure text for that center and open
`wa.me/<phone>?text=<encoded message>` so staff tap send.

Message content (✅ confirmed): **plans + prices for the chosen center + academy
name, address, timings. No QR / UPI in this message.** Exact wording + per-center
address/timings still needed (Q6/Q7).

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

## Mobile-first

Coaches use this on-spot on phones, so the layout is mobile-first with large tap
targets and easy copy/share actions.
