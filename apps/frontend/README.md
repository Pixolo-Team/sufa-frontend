# apps/frontend

Astro app. **Scaffold** for the `/operations` feature.

> The existing Skorost site currently lives at the **repo root** (unchanged and
> live). It relocates here in a later migration task. For now this folder only
> holds the operations feature skeleton so work can start without disturbing the
> live app.

## Layout (operations feature)

```
src/
├── data/
│   └── operations.data.ts      # DUMMY typed config the page reads (matches the API shape)
├── pages/operations/           # the page (index.astro) — to be built
└── services/api/               # operations.api.service.ts — to be built
```

## Data source strategy

The page reads its center/pricing/config data from `src/data/operations.data.ts`
today (dummy, no backend needed). When `apps/backend`'s
`GET /operations/centers` is live, `operations.api.service.ts` fetches the same
shape and the page swaps source without UI changes.

See [../../docs/operations/](../../docs/operations/README.md).
