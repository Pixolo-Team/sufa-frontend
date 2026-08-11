# 01 - Requirements

## Problems we are solving

1. **Fee calculation is manual and error-prone.** Plans differ by duration
   (1-month vs 3-month), by attendance (2 vs 3 days/week), and new students join
   mid-month and must be pro-rated. Staff currently work this out by hand.
2. **Sending a fee structure is slow.** When a parent asks for fees, a coach or
   manager should be able to send the right fee structure (which differs by
   center) to the parent's WhatsApp number quickly - ideally one tap.
3. **Collecting payment is clumsy.** We want (a) one global QR we can send to any
   parent, and (b) the option to generate a student-specific QR with the exact
   amount pre-filled, on the spot, and send it.

## Known facts (from stakeholder)

- Sessions run **Monday, Wednesday, Friday** *at the current center*. Days are
  **not fixed** - each center/batch has its own, read from `batch_days`.
- A full month at 3 days/week = **12 sessions** = **₹3,400** (this center).
- Plans run **1, 3, 6 and 12 months**, each at 2 or 3 days a week.
- A student attending only **2 of the 3 days** = **8 sessions/month** (`4 × 2`).
- Billing cycle is the **calendar month** (1st → 30/31).
- Mid-month joiners are pro-rated. Example given: a student joining **26 July**
  is charged for **26 July → 31 August**.
- The fee structure **differs by center**.

## Locked decisions

| Area | Decision |
| --- | --- |
| WhatsApp | `wa.me` tap-to-send (pre-filled message, staff taps send). No paid API. |
| Payment QR | Both - one global static UPI QR **and** per-student dynamic UPI QR with amount pre-filled. |
| Access | Shared PIN gate, remembered in the browser. |
| Data source | Academy database + API. Schema & endpoints designed in this folder. |

## Open questions (BLOCKING - please fill in)

> These drive both the calculator and the database model. Answers can be rough.

### Pricing

1. **Per-session rate.** Is a fee simply `sessions × rate`?
   - **Answer:** ✅ **Resolved by storing it.** Each center plan stores its own
     `per_session_price` alongside the flat `price`, so nothing is derived from
     ₹3400 ÷ 12 and the two never have to agree. A full month always bills the
     flat price; a partial month bills `sessions × per_session_price`.
     Ghatkopar East stores ₹285; another center can store anything else.

2. **Plan durations.** Which durations are sold?
   - **Answer:** ✅ **1, 3, 6 and 12 months**, each at 3-day and 2-day
     attendance, at **two centers**. (Confirmed Aug 2026 - an earlier draft of
     this doc said "1 and 3 months only, no 6-month plan"; that was stale.)
   - ⚠️ **To confirm:** can a student **join a multi-month plan mid-month**? A
     plan longer than 1 month is currently treated as a fixed term starting on
     the 1st, with no pro-rata.

3. **Rounding** on the final amount - nearest ₹1, ₹10, or ₹50?
   - **Answer:** ✅ **No rounding at all.** Superseded by storing the
     per-session price: the total is stored prices multiplied and summed.

### Pro-rata (mid-month joiner)

4. Joining 26 Jul → charged "26 Jul - 31 Aug." Confirm the rule:
   **remaining sessions of the joining month (charged per-session) + one full
   next month (flat ₹3,400)**, then the cycle resets to the 1st?
   Or simply: count every session day from join date to the end date × rate?
   - **Answer:** ✅ **Option A.** First payment = (remaining sessions in the
     joining month × the stored per-session price) **+** one full next month at
     the flat plan price.
     Cycle then resets to the 1st of the following month. See
     [02-fee-calculation.md](02-fee-calculation.md#pro-rata-algorithm-option-a).

5. When counting sessions, do we **skip public holidays**, or count every
   session day mechanically?
   - **Answer:** ✅ **No holiday check.** Count every session day mechanically.
     (Confirmed - do not factor holidays into the formula.)

### Centers

6. List **both centers**, and for each: 1-month (3-day) price, 3-month price,
   2-day price and per-session price, plus the **address**, the **coaches**, and
   each **batch** (days + timings) - needed for the fee message, see Q7. Prices
   **differ per center** (confirmed). Payment UPI is **global**, not per-center
   (see Q9), so no UPI column here.
   - **Answer:** 🔴 DUMMY data in [06-dummy-data.md](06-dummy-data.md) (2 fake
     centers, prices and batch days differ per center). Replace with real data.

### Fee-structure message

7. What should the WhatsApp "fee structure" message contain?
   - **Answer:** ✅ **Fee structure + center details only** - plans & prices,
     academy **name, address, batch timings**, signed off by the sending coach.
     **No QR / UPI** in this message (Payment QR is a separate tool). Delivered
     as **both** a copy-pasteable image and text. Still need one **real example**
     of the wording + the address/timings per center (see Q6).
   - **Example wording:** 🔴 DUMMY template in
     [06-dummy-data.md](06-dummy-data.md#fee-structure-message-template-dummy-wording).

### Optional / to confirm

8. Do we need to **store each generated fee/QR** against a student (for
   history/receipts), or is generation ephemeral (compute + send, nothing
   saved)?
   - **Answer:** ✅ **Ephemeral for now.** Nothing saved. No `fee_quote` table.
     Compute in-browser, send, forget. (Can add history later.)

9. Is there an existing **UPI ID / payee** already in use we should reuse for the
   global QR, or is that per-center only?
   - **Answer:** ✅ **One global common UPI + one global QR** for all centers.
     Not per-center.
   - **Global UPI ID:** ✅ real value provided - `skorostunitedfootballschool@kotak`.
   - **Payee name:** 🔴 DUMMY `Skorost United Football Academy` - see
     [06-dummy-data.md](06-dummy-data.md). Confirm this is the exact name to
     show in UPI apps.
