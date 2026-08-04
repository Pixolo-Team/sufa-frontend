# 03 - Database Schema

> 🟡 **Partial.** Shape below reflects confirmed decisions. Still blocked on the
> per-center price/address/timing values and the 6-month plan scope.

## Confirmed decisions affecting the schema

- Prices **differ per center** → keep a per-center price table.
- Payment UPI is **global**, not per-center → no per-center payment table; a
  single global setting instead.
- **No storing** of quotes/QR for now → **no `fee_quote` table.** Calculation is
  ephemeral in the browser.
- The fee message needs each center's **address + timings** → add those to the
  center row.

## Entities

- **center** - `id`, `name`, `slug`, `address`, `timings`, `active`.
  One row per academy center. `address` + `timings` feed the fee message.
- **plan** - `id`, `name` (e.g. "1-Month 3-Day", "6-Month", "1-Month 2-Day"),
  `duration_months`, `days_per_week`, `sessions_per_month`, `active`.
- **center_plan_price** - `center_id`, `plan_id`, `price`. Per-center pricing so
  the same plan can cost differently by center. Composite PK `(center_id, plan_id)`.
- **global config** (single row or key/value) - `upi_id`, `payee_name`,
  `per_session_rate` (₹285). Used by both the global static QR and the dynamic
  amount QR. Optionally holds `access_pin` if the PIN moves server-side later.

## Not included (deferred)

- `fee_quote` / history - deferred (open question 8 = ephemeral for now).
- per-center UPI - not needed (global UPI).

Final columns, types, indexes, and seed data land here once the per-center table
values (Q6) and 6-month scope (Q2) arrive.
