# Operations - Database Structure

Database structure for the `/operations` tooling (fee calculator, fee-structure
message, payment QR). PostgreSQL. Read-only for the frontend; managed via the
backend.

## Conventions

- **PostgreSQL.** Primary keys are `UUID` (`gen_random_uuid()` from `pgcrypto`),
  not integers and not slugs.
- Table names are **plural**, no prefix.
- Timestamps are `TIMESTAMPTZ`, default `now()`.
- Money is stored as whole rupees (`INTEGER`).

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()
```

## Tables

### `configs` - global settings (single row)

Payment details shared across all centers. (No per-session rate here - pricing
lives with the plans.)

```sql
CREATE TABLE configs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upi_id     TEXT NOT NULL,
    payee_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `centers`

```sql
CREATE TABLE centers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    address    TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> Timings are **not** on the center - a center can have several timings. They
> live on `batches` below.

### `coaches`

Coaches belong to a center. Used to fetch coach data (e.g. the "sender" of a fee
structure, contact info).

```sql
CREATE TABLE coaches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    name       TEXT NOT NULL,
    phone      TEXT,
    image_url  TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `batches` - a scheduled group within a center

A center has multiple batches, each with its own timing. This is where timings
live.

```sql
CREATE TABLE batches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    name       TEXT NOT NULL,        -- e.g. "Evening"
    start_time TIME,
    end_time   TIME,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `batch_days` - session weekdays per batch

The session days are **not** fixed to Mon/Wed/Fri - they vary by center/batch, so
they come from the database.

```sql
CREATE TABLE batch_days (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id    UUID NOT NULL REFERENCES batches(id),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun … 6=Sat
    UNIQUE (batch_id, day_of_week)
);
```

### `plans` - plan templates

Attendance/duration templates. Metadata only; prices are per center (below).

```sql
CREATE TABLE plans (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name               TEXT NOT NULL,      -- "1 Month 3-Day", "6 Month", "1 Month 2-Day"
    duration_months    SMALLINT NOT NULL,
    days_per_week      SMALLINT NOT NULL,  -- e.g. 3 or 2
    sessions_per_month SMALLINT,           -- NULL for multi-month plans
    is_active          BOOLEAN NOT NULL DEFAULT true,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `center_plans` - per-center pricing

Prices differ per center. **Per-session price is stored here**, so partial months
use a stored value - no rate calculation or rounding at runtime.

```sql
CREATE TABLE center_plans (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id         UUID NOT NULL REFERENCES centers(id),
    plan_id           UUID NOT NULL REFERENCES plans(id),
    price             INTEGER NOT NULL,   -- flat plan price (rupees)
    per_session_price INTEGER NOT NULL,   -- used for partial/pro-rata months (rupees)
    is_active         BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (center_id, plan_id)
);
```

## Relationships

```
centers 1───∞ coaches
centers 1───∞ batches 1───∞ batch_days
centers 1───∞ center_plans ∞───1 plans
configs (single row, standalone)
```

## Notes & open design points

- **Per-session price** lives on `center_plans` (per center). This removes the
  fixed ₹285 rate and all rounding from the app.
- **Days** are modelled at the **batch** level (`batch_days`). Confirm whether
  days belong to a batch or directly to a center - if the latter, move
  `batch_days` → `center_days`.
- **2-day plans:** a 2-day student attends 2 of a batch's days. How the specific
  2 days are chosen (fixed vs. student's choice) affects partial-month counting -
  to be confirmed.
- **No history tables** (quotes/receipts/students) in this phase.
- Add indexes on foreign keys (`coaches.center_id`, `batches.center_id`,
  `batch_days.batch_id`, `center_plans.center_id`, `center_plans.plan_id`).
