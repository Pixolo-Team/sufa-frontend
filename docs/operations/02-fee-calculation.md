# 02 - Fee Calculation Spec

> 🟢 **Built.** Implemented in `apps/frontend/src/utils/fee-calculator.util.ts`.
>
> Locked rules: **NO holiday check** - count every session day mechanically.
> **NO rounding** - both prices come from the database. **Session days come from
> the batch**, not a fixed Mon/Wed/Fri. The **end date is editable** by staff.

## Where the numbers come from

Nothing is derived or rounded in the app. `center_plans` stores **two** prices
per plan per center:

| Column | Used for |
| --- | --- |
| `price` | A **full calendar month** inside the billed range (flat) |
| `per_session_price` | A **partial month** - multiply by the session days in range |

Because the per-session price is stored, there is no rate to compute from the
monthly price and no rounding step. Two centers can price the same plan
differently, and each can carry its own per-session price.

## Inputs

- **Center** and **batch** - the batch supplies the session weekdays
  (`batch_days`), so pro-rata counting follows the batch the student joins.
- **Plan** - duration (1 / 3 / 6 / 12 months) and attendance (3-day / 2-day).
- **Start date** = join date, **end date** = auto-filled default, **editable**.

### Default end date

- Start on the **1st** of a month → default end = **last day of that month**.
- Start **mid-month** (day > 1) → default end = **last day of the *next* month**
  (bundles the partial joining month with one full month).
- Staff can override to any later date.
- A **multi-month plan** (3, 6 or 12 months) pins both dates: it starts on the
  1st and runs its full term at the flat price. ⚠️ Confirm whether a
  multi-month plan should instead allow a mid-month start with pro-rata.

## Amount algorithm (month-by-month, editable range)

Walk every calendar month that overlaps `[startDate, endDate]`:

```
For each month M overlapping [start, end]:
  if M is fully inside [start, end]:
      amount += center_plan.price                 # stored flat price
  else:                                           # partial month
      amount += sessionDaysInRange(M) × center_plan.per_session_price

total = amount                                    # no rounding, ever
```

- `sessionDaysInRange(M)` = the batch's session weekdays falling inside
  `[start, end]` within month `M`. For a 2-day plan, the student's chosen subset
  of those days.
- **No holiday check** - every matching weekday counts.
- A **full** calendar month always uses the flat price, never `sessions × rate`.

## Worked examples

These double as the calculator's test cases. Both use Ghatkopar East, 1-month
3-day: flat ₹3,400, per-session ₹285.

| # | Input | Result |
| --- | --- | --- |
| A | start 11 Jun, default end 31 Jul, Evening batch (Mon/Wed/Fri) | 9 × ₹285 + ₹3,400 = **₹5,965** |
| B | same, end edited to 30 Jun | 9 × ₹285 = **₹2,565** |
| C | start 26 Jul, default end 31 Aug, Evening batch | 2 × ₹285 + ₹3,400 = **₹3,970** |
| D | as C, but the **Morning** batch (Tue/Thu/Sat) | 3 × ₹285 + ₹3,400 = **₹4,255** |

Example D is the one that proves session days are read from the batch: the same
dates and the same plan produce a different total because the batch runs on
different weekdays.
