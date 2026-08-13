# 06 - Dummy Data (placeholder)

> ✅ East pricing/batches below are real. 🔴 West pricing is still a placeholder
> (kept structurally different on purpose so per-center paths get exercised).
>
> Source of truth is [seed.sql](seed.sql) - run it in the Supabase SQL editor.
> There is no `apps/frontend/src/data/operations.data.ts` mirror file; the app
> reads Supabase directly (see [schema.sql](schema.sql) header comment).

## Global config

| Key | Value |
| --- | --- |
| Global UPI ID | ✅ `skorostunitedfootballschool@kotak` - **real value, confirmed** |
| Payee name | `Skorost United Football Academy` 🔴 - confirm this is the exact name to show in UPI apps |
| Staff PIN | `1234` 🔴 |
| Holidays | ✅ **No holiday check** - count every session day mechanically |
| Rounding | ✅ Per-session price is derived from the 3-day package price
(`price ÷ (months × 12)`), then rounded to the nearest ₹10 (< 5 rounds down,
≥ 5 rounds up). The 2-day price is that rounded per-session rate × (months × 8). |

> There is **no global per-session rate.** It is stored per plan, derived as above.

## Centers - two centers, five batches each

Prices are **per batch**, not per center. Every duration sells at both 3 and
2 days a week, except Focus Batch which only has one plan.

### Ghatkopar East ✅

Address: 12 MG Road, Ghatkopar East, Mumbai 400077

**Foundation Batch** (Under-8) — Mon/Wed/Fri 18:00-19:00
**Grassroot Batch** (Under-10) — Mon/Wed/Fri 18:00-19:00
**Youth Batch** (Under-12) — Mon/Wed 19:00-20:00 · Fri 18:00-19:00
**Performance Batch** (Under-16) — Mon/Wed/Fri 20:00-21:00

All four share the same fee table:

| Duration | 3 days/wk | 2 days/wk | Per-session |
| --- | --- | --- | --- |
| 1 month | ₹3,400 | ₹2,240 | ₹280 |
| 3 months | ₹9,000 | ₹6,000 | ₹250 |
| 6 months | ₹18,000 | ₹12,000 | ₹250 |
| 12 months | ₹35,500 | ₹24,000 | ₹250 |

**Focus Batch** (Mixed Age) — Mon/Wed 19:00-20:00

| Duration | 2 days/wk | Per-session |
| --- | --- | --- |
| 1 month | ₹1,600 | ₹200 |

### Ghatkopar West 🔴

Address: 45 LBS Marg, Ghatkopar West, Mumbai 400086

Same batches and durations as East, days shifted Mon→Tue, Wed→Thu, Fri→Sat
(same clock times):

**Foundation Batch** (Under-8) — Tue/Thu/Sat 18:00-19:00
**Grassroot Batch** (Under-10) — Tue/Thu/Sat 18:00-19:00
**Youth Batch** (Under-12) — Tue/Thu 19:00-20:00 · Sat 18:00-19:00
**Performance Batch** (Under-16) — Tue/Thu/Sat 20:00-21:00

All four share the same fee table:

| Duration | 3 days/wk | 2 days/wk | Per-session |
| --- | --- | --- | --- |
| 1 month | ₹3,800 | ₹2,560 | ₹320 |
| 3 months | ₹10,200 | ₹6,720 | ₹280 |
| 6 months | ₹20,400 | ₹13,440 | ₹280 |
| 12 months | ₹40,300 | ₹26,880 | ₹280 |

**Focus Batch** (Mixed Age) — Tue/Thu 19:00-20:00

| Duration | 2 days/wk | Per-session |
| --- | --- | --- |
| 1 month | ₹1,800 | ₹230 |

*West prices deliberately differ from East so the per-center path is actually
exercised. West numbers are still placeholders.*

## Fee-structure message template (DUMMY wording)

```
Hi {parentName}, here is the fee structure for Skorost United Football Academy - {centerName}:

• {planName}: ₹{planPrice}          ← one line per plan

📍 Address: {address}
🕒 {batchName}: {days} · {startTime} - {endTime}     ← one line per batch

For a free trial or to enroll, reply here. See you on the pitch! ⚽
- Skorost United Football Academy
```

- `{parentName}` is omitted gracefully if no name is entered.
- Signed off with the academy name only - no coach data is stored.
- No UPI/QR in this message (confirmed) - the payment QR is a separate tool.
- The same content is also rendered as a **shareable PNG** for WhatsApp.

## Real values still owed

West pricing, the payee name sign-off, and the staff PIN. East pricing,
batch names/ages/timings, and the global UPI ID are now real.
