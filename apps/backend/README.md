# apps/backend

API service + academy database for the operations tooling. Framework: **Hono**
(lightweight, edge-friendly), mirroring the existing
`api.skorostunited.com/api/skorost` service.

## Layout

```
src/
├── index.ts                    # Hono app entry, mounts routes
├── db/
│   ├── schema.sql              # DDL for centers, plans, prices, config
│   ├── types.ts                # shared TS types (also used by the frontend)
│   └── seed.ts                 # DUMMY seed data (from docs/operations/06)
└── routes/
    └── operations.route.ts     # GET /operations/centers
```

## Status

🟡 **Scaffold.** Route returns the seed data directly (no real DB wired yet).
Swap `seed.ts` for real DB queries once the DB is provisioned and real values
land. See [../../docs/operations/04-api.md](../../docs/operations/04-api.md) and
[03-db-schema.md](../../docs/operations/03-db-schema.md).

## Run (once deps installed)

```bash
npm install
npm run dev
```
