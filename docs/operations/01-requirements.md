# 01 - Requirements

## Problems we are solving

1. **Fee calculation is manual and error-prone.** Plans differ by duration
   (1-month vs 6-month), by attendance (2 vs 3 days/week), and new students join
   mid-month and must be pro-rated. Staff currently work this out by hand.
2. **Sending a fee structure is slow.** When a parent asks for fees, a coach or
   manager should be able to send the right fee structure (which differs by
   center) to the parent's WhatsApp number quickly - ideally one tap.
3. **Collecting payment is clumsy.** We want (a) one global QR we can send to any
   parent, and (b) the option to generate a student-specific QR with the exact
   amount pre-filled, on the spot, and send it.

## Known facts (from stakeholder)

- Sessions run **Monday, Wednesday, Friday**.
- A full month at 3 days/week = **12 sessions** = **₹3,400**.
- **6 months = ₹9,000**.
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

1. **Per-session rate.** Is a fee simply `sessions × rate`? If yes, what is the
   rate - ₹3400 ÷ 12 = **₹283.33**, or a rounded figure (₹285 / ₹300)? Or is the
   2-day plan its own fixed price (if so, what)?
   - **Answer:** Per-session rate = **₹285** (rounded up from ₹283.33).
   - ⚠️ **Note / to confirm:** `285 × 12 = ₹3,420`, but a full 3-day month is a
     flat **₹3,400**. So ₹285 is the rate used for **2-day plans and mid-month
     pro-rata partials**, while a full 3-day month stays the flat ₹3,400 (not
     `12 × 285`). Confirm this is the intent.
     - 2-day full month = `8 × 285` = **₹2,280**.

2. **6-month plan.** Is ₹9,000 for 3-day only? Is there a 6-month price for
   2-day students? Any other durations (3-month, annual)?
   - **Answer:** 🔴 DUMMY (assumed): **3-day only, no 2-day 6-month, no other
     durations, always starts on the 1st (no pro-rata).** Replace when confirmed.
     See [06-dummy-data.md](06-dummy-data.md).

3. **Rounding** on the final amount - nearest ₹1, ₹10, or ₹50?
   - **Answer:** ✅ **Nearest ₹10, half-down.** Round the final total to the
     nearest ₹10, but a units digit of exactly 5 rounds **down** (≤5 → down,
     ≥6 → up). E.g. 285→280, 286→290. Applied once to the grand total. See
     [02-fee-calculation.md](02-fee-calculation.md#rounding-final-total).

### Pro-rata (mid-month joiner)

4. Joining 26 Jul → charged "26 Jul - 31 Aug." Confirm the rule:
   **remaining sessions of the joining month (charged per-session) + one full
   next month (flat ₹3,400)**, then the cycle resets to the 1st?
   Or simply: count every Mon/Wed/Fri from join date to the end date × rate?
   - **Answer:** ✅ **Option A.** First payment = (remaining sessions in the
     joining month × ₹285) **+** one full next month at the flat plan price.
     Cycle then resets to the 1st of the following month. See
     [02-fee-calculation.md](02-fee-calculation.md#pro-rata-algorithm-option-a).

5. When counting sessions, do we **skip public holidays**, or count every
   Mon/Wed/Fri mechanically?
   - **Answer:** ✅ **No holiday check.** Count every Mon/Wed/Fri mechanically.
     (Confirmed - do not factor holidays into the formula.)

### Centers

6. List **all centers**, and for each: 1-month (3-day) price, 6-month price,
   2-day/per-session rate, plus the **address and timings** (needed for the fee
   message - see Q7). Prices **differ per center** (confirmed).
   Payment UPI is **global**, not per-center (see Q9), so no UPI column here.
   - **Answer:** 🔴 DUMMY table in [06-dummy-data.md](06-dummy-data.md) (3 fake
     centers, prices differ per center). Replace with real centers.

### Fee-structure message

7. What should the WhatsApp "fee structure" message contain?
   - **Answer:** ✅ **Fee structure + center details only** - plans & prices,
     academy **name, address, timings**. **No QR / UPI** in this message.
     (Payment QR is a separate tool.) Still need one **real example** of the
     wording + the address/timings per center (see Q6 table).
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
     Not per-center. Still need the actual **UPI ID + payee name** value.
   - **Global UPI ID / payee:** 🔴 DUMMY `skorost@ybl` / `Skorost United
     Football Academy` - see [06-dummy-data.md](06-dummy-data.md). Replace.
