# 02 - Fee Calculation Spec

> 🟢 **Buildable** with dummy data. Real per-center prices + 6-month scope come
> from [06-dummy-data.md](06-dummy-data.md) for now.
>
> Locked rules: **NO holiday check** - count every Mon/Wed/Fri mechanically.
> **Round final total to nearest ₹10** (units digit ≤5 → down, ≥6 → up).
> **6-month = 3-day only, starts on the 1st.** The **end date is editable** by
> staff (auto-filled default, override allowed).

## Rounding (final total)

Round the **final total** (after summing all months) to the nearest ₹10, but the
half-point ₹5 rounds **down**, not up:

```
units = total % 10
rounded = total - units + (units >= 6 ? 10 : 0)
```

| total | rounded |
| --- | --- |
| 283 | 280 |
| 285 | 280 |
| 286 | 290 |
| 289 | 290 |

- Applies **once, to the grand total** - not per-month.
- The ₹285 per-session rate itself is unchanged.

## Confirmed inputs

- **Per-session rate = ₹285** (rounded up from ₹3400 ÷ 12 = ₹283.33).
  Used for **2-day plans** and **mid-month pro-rata partials**.
- **Full 3-day month = flat ₹3,400** - NOT `12 × 285` (= ₹3,420). The flat
  monthly price overrides the per-session rate for a full month. *(pending final
  confirm - see note in 01 §Pricing Q1.)*
- **2-day full month = `8 × 285` = ₹2,280.**
- **6-month = ₹9,000** (duration/attendance scope still to confirm).

## Inputs

- **Center** (sets prices), **plan** (3-day / 2-day), **start date**, **end date**.
- **Start date** = join date (staff picks).
- **End date** = auto-filled default (below), but **editable** by staff.

### Default end date

- Start on the **1st** of a month → default end = **last day of that month**.
- Start **mid-month** (day > 1) → default end = **last day of the *next* month**
  (bundles the partial joining month with one full month - the "Option A" rule).
- Staff can override to any later date.

## Amount algorithm (month-by-month, editable range)

Walk every calendar month that overlaps `[startDate, endDate]`:

```
For each month M overlapping [start, end]:
  if M is fully inside [start, end]:
      amount += flatMonthPrice        # 3-day = ₹3,400, 2-day = ₹2,280 (per center)
  else:                               # partial month
      amount += sessionDaysInRange(M) × 285

total = roundToNearest10_halfDown(amount)   # see Rounding section
```

- `sessionDaysInRange(M)` = count of the student's weekdays (Mon/Wed/Fri for
  3-day; the 2 chosen days for 2-day) that fall inside `[start, end]` within
  month `M`.
- **No holiday check** - every matching weekday counts.
- A **full** calendar month inside the range always uses the flat price, never
  `sessions × 285`.

### Worked example A - 3-day, start 11 Jun, default end 31 Jul

- **June** (partial, 11-30): Mon/Wed/Fri = 11? → count actual dates in 11-30 Jun
  × 285.
- **July** (full month inside range): flat **₹3,400**.
- Total = `juneSessions × 285 + 3,400`.

### Worked example B - same student, end edited to 30 Jun

- **June** only, and 11-30 Jun is **not** a full calendar month → partial.
- Total = `juneSessions × 285`. (No July, no flat month.)

### Worked example C - 3-day, start 26 Jul, default end 31 Aug

- **July** (partial, 26-31): Mon 28, Wed 30 = 2 sessions → `2 × 285` = ₹570.
- **August** (full): flat ₹3,400.
- Total = **₹3,970**.

> These three examples double as the calculator's test cases.
