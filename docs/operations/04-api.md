# 04 - API Endpoints

> 🟡 **Not built.** The frontend currently reads the static typed config at
> `apps/frontend/src/data/operations.data.ts`, which mirrors this exact shape -
> switching to the live endpoint needs no UI change.
>
> Target home: `apps/backend/src/routes/operations/`, consumed from
> `apps/frontend/src/services/api/operations.api.service.ts` (mirrors the
> existing `registration-status.api.service.ts`).

Base URL: `https://api.skorostunited.com/api/skorost` (existing service).

## Endpoints

### `GET /operations/centers`

Active centers with their batches (days + timings) and plans, per-center
prices, plus global config and global registration options. Powers every tool
on the page.

```jsonc
{
  "data": {
    "config": { "upiId": "skorost@ybl", "payeeName": "Skorost United Football Academy" },
    "registrationOptions": [
      { "id": "<uuid>", "name": "Registration Package", "description": "One-time registration, kit and ID card", "price": 500 },
      { "id": "<uuid>", "name": "Player Package", "description": "Registration + academy jersey and shorts", "price": 1200 }
    ],
    "centers": [
      {
        "id": "<uuid>",
        "name": "Ghatkopar East",
        "address": "…",
        "batches": [
          { "id": "<uuid>", "name": "Evening", "ageGroup": "Under-10", "startTime": "17:00", "endTime": "18:30", "days": [1, 3, 5] },
          { "id": "<uuid>", "name": "Morning", "ageGroup": "Under-16", "startTime": "07:00", "endTime": "08:30", "days": [2, 4, 6] }
        ],
        "plans": [
          { "id": "<uuid>", "name": "1 Month · 3 Days",  "durationMonths": 1, "daysPerWeek": 3, "price": 3400, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "1 Month · 2 Days",  "durationMonths": 1, "daysPerWeek": 2, "price": 2280, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "3 Months · 3 Days", "durationMonths": 3, "daysPerWeek": 3, "price": 9600, "perSessionPrice": 285 },
          { "id": "<uuid>", "name": "3 Months · 2 Days", "durationMonths": 3, "daysPerWeek": 2, "price": 6500, "perSessionPrice": 285 }
        ]
      }
    ]
  }
}
```

Notes on the shape:

- `days` uses `0=Sun … 6=Sat`, and lives on the **batch** - session days are not
  fixed to Mon/Wed/Fri and differ per center.
- **Timings and `ageGroup` are on the batch**, not the center: one center runs
  several.
- **Both prices are on the plan.** `perSessionPrice` is stored, not derived, so
  the app performs no rate calculation and no rounding.
- **`registrationOptions` is global**, not per-batch or per-center - it is not
  nested under `centers`.
- `config` holds **only** `upiId` and `payeeName`. There is no global
  per-session rate.
- Ids are **UUIDs** - not slugs, not integers.

## Not needed

- **No `fee-quote` endpoint.** The amount is computed in the browser from this
  payload using [02-fee-calculation.md](02-fee-calculation.md). Nothing is
  stored (open question 8 = ephemeral). Add later only if history or receipts
  are wanted - see the reconciliation note below.

## Auth

The PIN gate is a frontend-only concern (see [05-page-ux.md](05-page-ux.md)).
This payload is pricing already shown to parents, so no extra auth header is
required for now.

## Reconciliation note

Because no quote is stored, a payment arrives as an anonymous credit. The
student QR puts the student name and plan in the UPI **`tn` (transaction note)**
so the credit can be matched by hand in the settlement report. If that proves
insufficient, the fix is a `fee_quotes` history table, not a bigger note - some
UPI apps let the payer edit `tn`.
