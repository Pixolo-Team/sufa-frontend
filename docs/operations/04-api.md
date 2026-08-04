# 04 - API Endpoints

> 🟡 **Partial.** Shapes reflect confirmed decisions. Live in **apps/backend**
> (`apps/backend/src/routes/operations/`). Consumed from **apps/frontend** via
> `apps/frontend/src/services/api/operations.api.service.ts` (mirrors the
> existing `registration-status.api.service.ts`).

Base URL: `https://api.skorostunited.com/api/skorost` (existing service).

## Endpoints

- `GET /operations/centers`
  → all active centers with their plans + per-center prices + address + timings,
  and the global UPI/payee + per-session rate.
  Powers: center dropdown, fee-structure message, calculator pricing, QR payee.

  Response shape (draft):

  ```jsonc
  {
    "data": {
      "config": { "upiId": "skorost@ybl", "payeeName": "Skorost United", "perSessionRate": 285 },
      "centers": [
        {
          "id": "ghatkopar-east",
          "name": "Ghatkopar East",
          "address": "…",
          "timings": "…",
          "plans": [
            { "id": "1m-3d", "name": "1-Month 3-Day", "durationMonths": 1, "daysPerWeek": 3, "sessionsPerMonth": 12, "price": 3400 },
            { "id": "6m-3d", "name": "6-Month",        "durationMonths": 6, "daysPerWeek": 3, "price": 9000 },
            { "id": "1m-2d", "name": "1-Month 2-Day",  "durationMonths": 1, "daysPerWeek": 2, "sessionsPerMonth": 8, "price": 2280 }
          ]
        }
      ]
    }
  }
  ```

## Not needed

- **No `fee-quote` endpoint.** The fee amount is computed **fully in the browser**
  from the `/operations/centers` payload using
  [02-fee-calculation.md](02-fee-calculation.md). Nothing is stored (open
  question 8 = ephemeral). Add later only if history/receipts are wanted.

## Auth

The PIN gate is a frontend-only concern (see [05-page-ux.md](05-page-ux.md)).
`/operations/centers` returns non-sensitive pricing already shown to parents, so
no extra auth header is required for now.

## Simplest alternative (no backend yet)

Since data is read-only and small, `/operations/centers` can start as a **static
typed config** in `apps/frontend` (e.g. `apps/frontend/src/data/operations.centers.ts`)
and swap to the live endpoint later without changing the UI. Recommended for the
first cut while the backend/monorepo move is pending.
