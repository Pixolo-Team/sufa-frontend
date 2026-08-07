# 03 - Database Schema

> ⛔ **Superseded.** This file held an early sketch that no longer matches the
> real model. It described `timings` on the center, a global `per_session_rate`
> in config, and slug ids - all three are wrong.
>
> **The database structure lives in [DATABASE.md](DATABASE.md).**

What changed, and why:

| Early sketch (wrong) | Actual model ([DATABASE.md](DATABASE.md)) |
| --- | --- |
| `timings` on the center | Timings live on `batches` - one center runs several |
| Session days assumed Mon/Wed/Fri | `batch_days` per batch - days vary by center |
| `per_session_rate` in global config | `per_session_price` on `center_plans`, per center plan |
| Slug / integer ids | `UUID` primary keys (`gen_random_uuid()`) |
| No coaches | `coaches` table, used as the fee-structure sender |
