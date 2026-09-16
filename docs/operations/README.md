# Operations Page (`/operations`)

Internal, staff-only tooling to solve day-to-day academy operations problems -
fee calculation, sending fee structures over WhatsApp, and generating payment
QR codes.

This folder holds the **planning and design docs** for that work. The page is
**built** against dummy data (`apps/frontend/src/pages/operations/`); the
backend endpoints are **not**.

> ⚠️ The built page is being treated as a **wireframe** while the whole
> `/operations` UI gets redesigned - it has already been reshaped once (see
> "What changed" in [05-page-ux.md](05-page-ux.md#what-changed-revision-history))
> and may change again.

## Documents

| Doc | Purpose | Status |
| --- | --- | --- |
| [01-requirements.md](01-requirements.md) | Problem statements, locked decisions, answers | 🟢 Filled (some 🔴 dummy) |
| [02-fee-calculation.md](02-fee-calculation.md) | Fee/pro-rata calculation spec (source of truth) | 🟢 Buildable |
| [DATABASE.md](DATABASE.md) | **The** database structure (PostgreSQL, UUID keys) | 🟢 Shape locked |
| [03-db-schema.md](03-db-schema.md) | ⛔ Superseded - points at DATABASE.md | ⛔ Retired |
| [04-api.md](04-api.md) | Backend API the frontend will consume (static config for now) | 🟡 Not built |
| [05-page-ux.md](05-page-ux.md) | The `/operations` page, two pages (Batches, Payments), PIN gate | 🟢 Built |
| [06-dummy-data.md](06-dummy-data.md) | 🔴 Placeholder centers/prices/PIN/message - REPLACE before prod (UPI ID is now real) | 🔴 Mostly dummy |

> **Real values still owed** (currently faked in doc 06): Ghatkopar West prices
> and per-session prices, and the exact fee-structure message wording. The
> global UPI ID, payee name, and staff PIN are now real.

## The two pages on the site

1. **Batches** - centers as tabs, each batch's schedule and its plans in a
   table. Per batch, share **Timings**, **Fees**, or **Fees + timings** to a
   parent, as either **text** or a branded **image**.
2. **Payments** - three tabs:
   - **Global QR** - one static UPI QR to share with anyone, no amount.
   - **Fee Payment** - pick center/batch/months/days-per-week (+ optional
     registration and dates) and get the **month-by-month fees breakdown**
     plus a payment QR with the computed amount baked in.
   - **Custom** - a QR for an arbitrary amount not tied to any batch/plan,
     with an optional description used in the share message only.

## Locked decisions

- **WhatsApp:** `wa.me/<number>?text=<message>` tap-to-send. No paid WhatsApp
  Business API.
- **Payment QR:** both a global static QR and a per-student dynamic UPI QR
  (`upi://pay?...&am=<amount>`).
- **Access:** shared PIN gate (staff enter a passcode once, remembered in the
  browser).
- **Data:** backed by the academy database + API (not hardcoded). Prices,
  batch days and timings all come from the DB - nothing is derived or rounded in
  the app. Schema in [DATABASE.md](DATABASE.md), endpoints in
  [04-api.md](04-api.md).

## Architecture context (monorepo)

Target layout - two apps in one repo:

```
apps/
├── frontend/                 # Astro app (current sufa-frontend)
│   └── src/
│       ├── pages/operations/index.astro        # the page (chrome-free layout + one React island)
│       ├── components/operations/              # the island and its tools
│       └── services/api/operations.api.service.ts  # will call the backend
└── backend/                  # API service (Hono) + academy DB
    └── src/
        ├── db/               # schema + migrations + seed (see DATABASE.md)
        └── routes/operations # endpoints (see 04-api.md) - NOT BUILT YET
```

- **apps/frontend** - Astro. Route `apps/frontend/src/pages/operations/index.astro`
  in a chrome-free `OperationsLayout`, mounting **one React island** for the
  tools (see [05-page-ux.md](05-page-ux.md) for why not vanilla `<script>`).
  Data currently comes from the static typed config in
  `apps/frontend/src/data/operations.data.ts`.
- **apps/backend** - the API behind `https://api.skorostunited.com/api/skorost`
  (already serves the registration tracker). Holds the academy DB schema/seed and
  the new `/operations/*` endpoints.

> The `apps/frontend` + `apps/backend` split now exists in the repo.
> `apps/backend` is scaffolded (Hono) but has **no `/operations` routes yet** -
> the page reads the static config until they land.
