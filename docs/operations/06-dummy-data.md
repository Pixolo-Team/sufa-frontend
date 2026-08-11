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

### Ghatkopar East 🔴

- Address: 12 MG Road, Ghatkopar East, Mumbai 400077
- Batches: **Evening** Mon/Wed/Fri 17:00-18:30 · **Morning** Tue/Thu/Sat 07:00-08:30

| Plan | Duration | Days/wk | Price | Per-session |
| --- | --- | --- | --- | --- |
| 1 Month · 3 Days | 1 | 3 | ₹3,400 | ₹285 |
| 1 Month · 2 Days | 1 | 2 | ₹2,280 | ₹285 |
| 3 Months · 3 Days | 3 | 3 | ₹9,600 | ₹285 |
| 3 Months · 2 Days | 3 | 2 | ₹6,500 | ₹285 |

### Ghatkopar West 🔴

- Address: 45 LBS Marg, Ghatkopar West, Mumbai 400086
- Batches: **Evening** Mon/Wed/Fri 18:00-19:30

| Plan | Duration | Days/wk | Price | Per-session |
| --- | --- | --- | --- | --- |
| 1 Month · 3 Days | 1 | 3 | ₹3,600 | ₹300 |
| 1 Month · 2 Days | 1 | 2 | ₹2,400 | ₹300 |
| 3 Months · 3 Days | 3 | 3 | ₹10,200 | ₹300 |
| 3 Months · 2 Days | 3 | 2 | ₹6,900 | ₹300 |

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
