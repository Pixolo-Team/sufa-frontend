# 06 - Dummy Data (placeholder)

> 🔴 **DUMMY - REPLACE BEFORE PRODUCTION.** Every value here is a placeholder so
> the page can be built and demoed.
>
> These values are mirrored in `apps/frontend/src/data/operations.data.ts`, where
> each one is marked 🔴 in a comment. Replacing them there is the whole job -
> the shape already matches [04-api.md](04-api.md).

## Global config

| Key | Value |
| --- | --- |
| Global UPI ID | ✅ `skorostunitedfootballschool@kotak` - **real value, confirmed** |
| Payee name | `Skorost United Football Academy` 🔴 - confirm this is the exact name to show in UPI apps |
| Staff PIN | `1234` 🔴 |
| Holidays | ✅ **No holiday check** - count every session day mechanically |
| Rounding | ✅ **None.** Both prices are stored per plan |

> There is **no global per-session rate.** It is stored per center plan, below.

## Centers (DUMMY) - two centers

Prices are **per batch**, not per center. Every duration sells at both 3 and
2 days a week.

### Ghatkopar East 🔴

Address: 12 MG Road, Ghatkopar East, Mumbai 400077

**Evening Batch** (Under-14) — Mon 18:00-19:00 · Wed 19:00-20:00 · Fri 18:30-19:30

| Duration | 3 days/wk | 2 days/wk | Per-session |
| --- | --- | --- | --- |
| 1 month | ₹3,400 | ₹2,280 | ₹285 |
| 3 months | ₹9,600 | ₹6,400 | ₹285 |
| 6 months | ₹18,600 | ₹12,400 | ₹285 |
| 12 months | ₹34,800 | ₹23,200 | ₹285 |

**Morning Batch** (Under-10) — Tue 07:00-08:00 · Thu 07:30-08:30 · Sat 08:00-09:00

| Duration | 3 days/wk | 2 days/wk | Per-session |
| --- | --- | --- | --- |
| 1 month | ₹3,550 | ₹2,370 | ₹300 |
| 3 months | ₹9,950 | ₹6,650 | ₹300 |
| 6 months | ₹19,200 | ₹12,800 | ₹300 |
| 12 months | ₹36,000 | ₹24,000 | ₹300 |

### Ghatkopar West 🔴

Address: 45 LBS Marg, Ghatkopar West, Mumbai 400086

**Evening Batch** (Under-12) — Mon 17:30-18:30 · Wed 18:30-19:30 · Fri 17:30-18:30

| Duration | 3 days/wk | 2 days/wk | Per-session |
| --- | --- | --- | --- |
| 1 month | ₹3,600 | ₹2,400 | ₹300 |
| 3 months | ₹10,200 | ₹6,800 | ₹300 |
| 6 months | ₹19,800 | ₹13,200 | ₹300 |
| 12 months | ₹37,200 | ₹24,800 | ₹300 |

*Prices, per-session prices and batch days deliberately differ between the two
centers so the per-center and per-batch paths are actually exercised. All fake.*

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

Prices (including every per-session price), addresses, batch timings and days,
the staff PIN, and the exact message wording and image branding. The global
UPI ID is now real (`skorostunitedfootballschool@kotak`); the payee name
still needs sign-off.
