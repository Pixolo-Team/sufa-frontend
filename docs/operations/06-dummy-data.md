# 06 - Dummy Data (placeholder)

> 🔴 **DUMMY - REPLACE BEFORE PRODUCTION.** Every value here is a placeholder so
> the page can be built and demoed. Swap for real values when provided.
> Real answers still owed: holidays rule, 6-month scope, per-center prices,
> address/timings, global UPI, PIN, exact message wording.

## Global config (DUMMY)

| Key | Value |
| --- | --- |
| Per-session rate | ₹285 *(confirmed real)* |
| Global UPI ID | `skorost@ybl` 🔴 |
| Payee name | `Skorost United Football Academy` 🔴 |
| Staff PIN | `1234` 🔴 |
| Holidays | ✅ **No holiday check** - count every Mon/Wed/Fri mechanically |
| Rounding | nearest ₹10, half-down (285→280, 286→290) *(confirmed)* |

## Plans (DUMMY scope - 6-month assumed 3-day only, starts on the 1st)

| Plan | Duration | Days/wk | Sessions/mo |
| --- | --- | --- | --- |
| 1-Month 3-Day | 1 | 3 | 12 |
| 1-Month 2-Day | 1 | 2 | 8 |
| 6-Month | 6 | 3 | - |

> 🔴 6-month: assumed **3-day only**, **no 2-day 6-month**, **no other
> durations**, and **always starts on the 1st (no pro-rata)** until confirmed.

## Centers (DUMMY)

| Center | 1-mo 3-day | 6-month | 1-mo 2-day | Address | Timings |
| --- | --- | --- | --- | --- | --- |
| Ghatkopar East | ₹3,400 | ₹9,000 | ₹2,280 | 12 MG Road, Ghatkopar East, Mumbai 400077 🔴 | Mon/Wed/Fri, 5:00-6:30 PM 🔴 |
| Ghatkopar West | ₹3,600 | ₹9,500 | ₹2,400 | 45 LBS Marg, Ghatkopar West, Mumbai 400086 🔴 | Mon/Wed/Fri, 6:00-7:30 PM 🔴 |
| Powai | ₹3,800 | ₹10,000 | ₹2,540 | 8 Hiranandani, Powai, Mumbai 400076 🔴 | Mon/Wed/Fri, 4:00-5:30 PM 🔴 |

*(Different prices per center are shown deliberately to exercise the per-center
pricing path. All fake.)*

## Fee-structure message template (DUMMY wording)

```
Hi {parentName}, here is the fee structure for Skorost United Football Academy - {centerName}:

• 1 Month (3 days/week): ₹{price_1m_3d}
• 6 Months: ₹{price_6m}
• 2 Days/week (1 month): ₹{price_1m_2d}

📍 Address: {address}
🕒 Timings: {timings}

For a free trial or to enroll, reply here. See you on the pitch! ⚽
```

- `{parentName}` omitted gracefully if name not entered.
- No UPI/QR in this message (confirmed).
