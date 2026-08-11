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
    "config": { "upiId": "skorostunitedfootballschool@kotak", "payeeName": "Skorost United Football Academy" },
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
          {
            "id": "<uuid>",
            "name": "Evening Batch",
            "ageGroup": "Under-14",
            "schedule": [
              { "day": 1, "startTime": "18:00", "endTime": "19:00" },
              { "day": 3, "startTime": "19:00", "endTime": "20:00" },
              { "day": 5, "startTime": "18:30", "endTime": "19:30" }
            ],
            "plans": [
              { "id": "<uuid>", "durationMonths": 1,  "daysPerWeek": 3, "price": 3400,  "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 1,  "daysPerWeek": 2, "price": 2280,  "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 3,  "daysPerWeek": 3, "price": 9600,  "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 3,  "daysPerWeek": 2, "price": 6400,  "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 6,  "daysPerWeek": 3, "price": 18600, "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 6,  "daysPerWeek": 2, "price": 12400, "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 12, "daysPerWeek": 3, "price": 34800, "perSessionPrice": 285 },
              { "id": "<uuid>", "durationMonths": 12, "daysPerWeek": 2, "price": 23200, "perSessionPrice": 285 }
            ]
          }
        ]
      }
    ]
  }
}
```

Notes on the shape:

- **`plans` are nested inside each batch, not the center.** Pricing is per
  batch - the Morning and Evening batches at one center sell different prices.
  (An earlier draft of this doc put `plans` at center level; that was wrong.)
- **`schedule` is an array of day-wise slots** on the batch, each with its own
  `startTime` / `endTime`, because Monday and Wednesday can run at different
  times. `day` uses `0=Sun … 6=Sat`.
- **Plans have no `name`.** The label is derived from `durationMonths` +
  `daysPerWeek` so there is a single source of truth - see
  [DATABASE.md](DATABASE.md).
- The `(durationMonths, daysPerWeek)` pair must be **unique within a batch**.
  The UI resolves a plan from that pair, so a duplicate is unselectable.
- **Both prices are on the plan.** `perSessionPrice` is stored, not derived, so
  the app performs no rate calculation and no rounding.
- **`registrationOptions` is global**, not per-batch or per-center - it is not
  nested under `centers`.
- `config` holds `academyName`, `upiId` and `payeeName`. There is no global
  per-session rate. `staffPin` is also served, but see the warning in
  [DATABASE.md](DATABASE.md) - it is a soft gate, not auth.
- Return only active rows, already sorted by `sort_order`; the frontend does
  not filter or sort centers, batches or registration options.
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
