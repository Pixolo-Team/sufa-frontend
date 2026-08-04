# apps/ — monorepo workspace

Two apps for the academy operations tooling. See the design docs in
[`docs/operations/`](../docs/operations/README.md).

```
apps/
├── frontend/   # Astro app. For now holds the /operations feature scaffold.
│               # The existing site (repo root) relocates here later.
└── backend/    # API service (Hono) + academy DB. Serves /operations/* endpoints.
```

> **Scaffold only.** These folders are the skeleton for the operations feature.
> The existing Astro site at the repo root is untouched and still the live app.
> Physically moving it into `apps/frontend/` is a separate later task.
