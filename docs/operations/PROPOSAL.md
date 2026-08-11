# Operations Tooling - `/operations`

A staff-only internal page for the academy's day-to-day operations. The database
design is in a separate document (`DATABASE.md`).

> ⚠️ **This is the original design proposal, not the current build.** The
> "three tools" in §3 below were consolidated into **two pages** (Batches,
> Payments) - see [05-page-ux.md](05-page-ux.md) for what's actually shipped
> and why. The fee-calculation logic and database shape described here are
> still accurate.

---

## 1. Purpose

Three recurring academy operations are done manually today and cause delays and
errors. This introduces a single, staff-only web page (`/operations`) with three
tools to solve them, plus the API that backs it.

---

## 2. Problems being solved

1. **Fee calculation is manual.** Plans vary by duration (1-month vs 3-month) and
   attendance (2 vs 3 days/week), and new students join mid-month and must be
   pro-rated. Staff currently compute this by hand.
2. **Sending a fee structure is slow.** When a parent asks for fees, staff should
   be able to send the correct, center-specific fee structure to the parent's
   WhatsApp quickly.
3. **Collecting payment is clumsy.** We want (a) one global payment QR to share
   with any parent, and (b) a per-student QR with the exact amount pre-filled,
   generated on the spot.

---

## 3. Proposed solution - the `/operations` page

A mobile-first, PIN-protected page with three tools:

| Tool | What it does |
| --- | --- |
| **Fee Calculator** | Staff pick center, plan, days/week, start date and (editable) end date → the page returns the amount with a per-month breakdown. |
| **Send Fee Structure** | Staff pick a center → the page renders the fee structure as an **image** that can be copy-pasted into WhatsApp, plus a `wa.me` option to open a chat with the parent. |
| **Payment QR** | A shared **global** UPI QR to send to anyone, plus a **dynamic** QR that encodes the calculated amount for a specific student. |

---

## 4. Confirmed decisions

| Area | Decision |
| --- | --- |
| WhatsApp | `wa.me/<number>?text=<message>` - pre-filled message, staff taps send. Fee structure also available as a copy-pasteable image. **No paid WhatsApp Business API.** |
| Payment QR | Both a **global static** UPI QR and a **per-student dynamic** UPI QR (amount pre-filled). One **common** UPI ID for all centers. |
| Access | **Shared PIN**, checked on the frontend, remembered in the browser. |
| Data | Backed by an **academy database + API** (see `DATABASE.md`). Read-only for this feature. |
| Storage | **No history stored** for now - calculations/QRs are generated and sent, nothing saved. Can be added later. |

---

## 5. Fee calculation

**Everything comes from the database - no hardcoded rates, days, or rounding.**

**Session days**

- Session weekdays are **not fixed** to Mon/Wed/Fri. Each center/batch has its own
  days, read from the database (`batch_days`). One center may run Mon/Wed/Fri,
  another Tue/Thu/Sat, etc.

**Prices** (from `center_plans`, per center)

- Each plan at each center stores a **flat price** and a **per-session price**.
- Because the per-session price is stored, there is **no fixed rate and no
  rounding** in the app - partial months just multiply by the stored value.

**Amount algorithm** (supports the editable end date)

Walk every calendar month overlapping `[startDate, endDate]`:

```
For each month M in the range:
  if M is a FULL calendar month inside the range:
      amount += center_plan.price              # stored flat price
  else:                                        # partial month
      amount += (session-days of M in range) × center_plan.per_session_price

total = amount                                 # no rounding
```

- "session-days" = the center/batch's session weekdays (from `batch_days`) that
  fall in the range. For a 2-day plan, the student's chosen subset of those days.
- **No holiday adjustment** - every scheduled session day counts.

**Default end date** (editable by staff)

- Start on the **1st** → default end = last day of that month.
- Start **mid-month** → default end = last day of the **next** month (bundles the
  partial joining month with one full month).

**Worked example** (3-day center, per-session price ₹285, flat ₹3,400)

| # | Input | Result |
| --- | --- | --- |
| A | start 11 Jun, end 31 Jul (default) | June partial (11-30) × per-session **+** July flat |
| B | same, end edited to 30 Jun | June partial (11-30) × per-session only |
| C | start 26 Jul, end 31 Aug (default) | 2 × per-session + Aug flat |

---

## 6. Database

The data model - `centers`, `batches` (incl. `age_group`), `batch_timings`,
`plans`, `registration_options` (global, not per-batch), and `configs` - is
specified in a **separate document: `DATABASE.md`** (PostgreSQL, UUID keys). No
history tables in this phase.

---

## 7. API

Read-only endpoints on the existing service
(`https://api.skorostunited.com/api/skorost`).

**`GET /operations/centers`** → active centers with their batches (days +
timings), plans + per-center prices, plus global config and global
registration options.

```jsonc
{
  "data": {
    "config": { "upiId": "…", "payeeName": "…" },
    "registrationOptions": [
      { "id": "<uuid>", "name": "…", "description": "…", "price": 500 }
    ],
    "centers": [
      {
        "id": "<uuid>",
        "name": "Ghatkopar East",
        "address": "…",
        "batches": [
          { "id": "<uuid>", "name": "Evening", "ageGroup": "Under-10", "startTime": "17:00", "endTime": "18:30", "days": [1, 3, 5] }
        ],
        "plans": [
          { "id": "<uuid>", "name": "1 Month 3-Day", "durationMonths": 1, "daysPerWeek": 3, "price": 3400, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "1 Month 2-Day", "durationMonths": 1, "daysPerWeek": 2, "price": 2280, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "3 Month 3-Day", "durationMonths": 3, "daysPerWeek": 3, "price": 9600, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "3 Month 2-Day", "durationMonths": 3, "daysPerWeek": 2, "price": 6500, "perSessionPrice": 285 }
        ]
      }
    ]
  }
}
```

- `days` uses `0=Sun … 6=Sat`.
- The fee amount is **computed in the browser** from this payload (flat price for
  full months, `perSessionPrice` for partial months) - no server-side calc,
  no rounding.
- Pricing is already public (given to parents), so no extra auth header is
  required.
- **Interim option:** ship the page reading a static typed config first, and
  switch to this endpoint once the backend is ready - no UI change.

---

## 8. Architecture

Monorepo with two apps:

```
apps/
├── frontend/   # Astro app - the /operations page (BaseLayout + vanilla scripts)
│   └── src/pages/operations/ , src/components/operations/ , src/data/
└── backend/    # API (Hono) + academy DB - /operations/* endpoints
```

- **Frontend:** Astro route in a chrome-free layout, mounting **one React
  island** for the tools (the state is interdependent enough that vanilla
  `<script>` blocks would not hold up - see 05-page-ux.md). QR and the
  fee-structure image are rendered client-side.
- **Backend:** extends the existing `api.skorostunited.com` service.
- **Payment QR** encodes standard UPI: `upi://pay?pa=<upi>&pn=<payee>&am=<amount>&cu=INR`,
  so any UPI app pre-fills the amount on scan.

---

## 9. Open items / data still needed

The build can proceed on placeholders. The following real data / decisions are
needed before go-live:

1. **Data model sign-off** - confirm the tables in `DATABASE.md`, especially:
   days at **batch** vs **center** level, and how a **2-day** student's specific
   days are chosen.
2. **Fee logic** - confirm §5 (per-center flat + stored per-session price for
   partial months, no rounding, editable end date).
3. **Center + batch + plan data** - for each center: address, batches (age
   group, timings + session days), and each plan's flat price + per-session
   price.
4. **Plan scope** - confirmed: **two centers**, each selling **1, 3, 6 and
   12-month** plans at 3-day and 2-day attendance. Still to confirm: can a
   student **join a multi-month plan mid-month**? Anything longer than a month
   is currently treated as a fixed term starting on the 1st, with no pro-rata.
5. **Global UPI ID + payee name** for the payment QRs.
6. **Fee-structure image content** - layout/branding of the generated image and
   the exact details to show.
7. **Staff PIN** value.

---

## 10. Out of scope (future phases)

- Storing quote/payment history, receipts, per-student records.
- Automated (zero-tap) WhatsApp sending via the Business API.
- Per-staff login/accounts and audit logging.
- Editing prices/centers from an admin UI (currently a data/DB change).

---

## 11. Rollout notes

- **Vercel:** once the frontend lives in `apps/frontend`, set the project's
  **Root Directory** to `apps/frontend` in the Vercel dashboard.
- The page is unlisted (not linked from the public site) and PIN-gated.
- Dummy data is clearly marked in code and replaced with the §9 values before
  launch.

---

*Appendix: detailed working docs - `docs/operations/01-requirements.md` …
`06-dummy-data.md`.*
