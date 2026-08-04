# Operations Page (`/operations`)

Internal, staff-only tooling to solve day-to-day academy operations problems -
fee calculation, sending fee structures over WhatsApp, and generating payment
QR codes.

This folder holds the **planning and design docs** for that work. No code is
written until the requirements below (especially the fee logic) are confirmed.

## Documents

| Doc | Purpose | Status |
| --- | --- | --- |
| [01-requirements.md](01-requirements.md) | Problem statements, locked decisions, answers | 🟢 Filled (some 🔴 dummy) |
| [02-fee-calculation.md](02-fee-calculation.md) | Fee/pro-rata calculation spec (source of truth) | 🟢 Buildable |
| [03-db-schema.md](03-db-schema.md) | Academy DB tables for centers, plans, pricing | 🟢 Shape locked |
| [04-api.md](04-api.md) | Backend API the frontend consumes (or static config first) | 🟢 Shape locked |
| [05-page-ux.md](05-page-ux.md) | The `/operations` page, three tools, PIN gate | 🟢 Outlined |
| [06-dummy-data.md](06-dummy-data.md) | 🔴 Placeholder centers/prices/UPI/PIN/message - REPLACE before prod | 🔴 Dummy |

> **Real values still owed** (currently faked in doc 06): holidays rule, 6-month
> scope, per-center prices, address/timings, global UPI ID, staff PIN, exact
> message wording.

## The three tools on the page

1. **Fee Calculator** - given center, plan (1-month / 6-month), days-per-week
   (2 or 3), and join date, compute the amount owed including mid-month
   pro-rata.
2. **Send Fee Structure** - select a center, enter parent name + number, and
   open a pre-filled WhatsApp message (`wa.me` tap-to-send) with that center's
   fee structure.
3. **Payment QR** - a single global static UPI QR to share, plus a per-student
   dynamic UPI QR with the calculated amount pre-filled.

## Locked decisions

- **WhatsApp:** `wa.me/<number>?text=<message>` tap-to-send. No paid WhatsApp
  Business API.
- **Payment QR:** both a global static QR and a per-student dynamic UPI QR
  (`upi://pay?...&am=<amount>`).
- **Access:** shared PIN gate (staff enter a passcode once, remembered in the
  browser).
- **Data:** backed by the academy database + API (not hardcoded). Schema and
  endpoints designed in this folder.

## Architecture context (monorepo)

Target layout - two apps in one repo:

```
apps/
├── frontend/                 # Astro app (current sufa-frontend)
│   └── src/
│       ├── pages/operations/index.astro        # the page (BaseLayout + vanilla <script>)
│       └── services/api/operations.api.service.ts  # calls the backend
└── backend/                  # API service (Hono) + academy DB
    └── src/
        ├── db/               # schema + migrations + seed (see 03-db-schema.md)
        └── routes/operations # endpoints (see 04-api.md)
```

- **apps/frontend** - Astro. New route `apps/frontend/src/pages/operations/index.astro`
  wrapped in `BaseLayout`, interactivity via vanilla `<script>` blocks (React is
  reserved for the enquiry form only). Data access via
  `apps/frontend/src/services/api/operations.api.service.ts`, mirroring the
  existing `registration-status.api.service.ts`.
- **apps/backend** - the API behind `https://api.skorostunited.com/api/skorost`
  (already serves the registration tracker). Holds the academy DB schema/seed and
  the new `/operations/*` endpoints.

> Note: the repo is currently a single Astro app (`sufa-frontend`). These docs
> assume the `apps/frontend` + `apps/backend` monorepo target. Physically moving
> the existing app into `apps/frontend/` is a separate migration task - not yet
> done.
