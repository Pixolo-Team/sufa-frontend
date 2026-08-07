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

Global payment settings shared across the operations tooling. Payment can be via
UPI or direct bank transfer, so this table must support both.

```sql
CREATE TABLE configs (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_mode         TEXT NOT NULL CHECK (payment_mode IN ('upi', 'bank')),
    upi_id               TEXT,
    payee_name           TEXT,
    bank_account_name    TEXT,
    bank_account_number  TEXT,
    bank_ifsc_code       TEXT,
    bank_name            TEXT,
    bank_branch          TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> Depending on `payment_mode`, either the UPI fields or the bank fields are used.

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

### `coaches`

Coaches are shared academy resources and may go to multiple centers, so they do
**not** belong directly to one center.

```sql
CREATE TABLE coaches (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    phone        TEXT,
    image_url    TEXT,
    instagram_id TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `center_coaches` - coach assignment per center

Join table because a coach can be assigned to multiple centers.

```sql
CREATE TABLE center_coaches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    coach_id   UUID NOT NULL REFERENCES coaches(id),
    is_active  BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (center_id, coach_id)
);
```

### `batches` - a scheduled group within a center

Each batch belongs to a center and represents a specific program/group (for
example `Under-8`, `Under-10`, `Evening Grassroots`, etc.). Timings do **not**
live directly on the batch because each weekday may have a different time.

```sql
CREATE TABLE batches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    name       TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `batch_timings` - weekday + time slots per batch

Each row represents one meeting slot for one weekday. Monday can be `6-7`,
Wednesday can be `7-8`, etc.

```sql
CREATE TABLE batch_timings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id    UUID NOT NULL REFERENCES batches(id),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun ... 6=Sat
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    UNIQUE (batch_id, day_of_week, start_time, end_time)
);
```

### `plans` - pricing per batch

Plans now belong directly to a batch. A batch carries its own pricing, so there
is no separate `center_plans` table. This allows `Under-8` and `Under-10` to
have different plans even inside the same center.

```sql
CREATE TABLE plans (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id          UUID NOT NULL REFERENCES batches(id),
    name              TEXT NOT NULL,      -- e.g. "1 Month 3-Day", "3 Month 2-Day"
    duration_months   SMALLINT NOT NULL,
    days_per_week     SMALLINT NOT NULL,  -- e.g. 3 or 2
    price             INTEGER NOT NULL,   -- flat plan price (rupees)
    per_session_price INTEGER NOT NULL,   -- used for partial/pro-rata calculation
    is_active         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Relationships

```
centers 1───∞ center_coaches ∞───1 coaches
centers 1───∞ batches 1───∞ batch_timings
batches 1───∞ plans
configs (single row, standalone)
```

## Notes & open design points

- **Payment config** now supports both `upi` and `bank` mode.
- **Coach assignment** is many-to-many across centers, so `coaches.center_id`
  has been removed.
- **Instagram ID** lives on `coaches`.
- **Timings** are stored per weekday inside `batch_timings`, because every day
  may have a different time.
- **Per-session price** lives directly on `plans`, along with all pricing.
- **No `center_plans` table**: plans now attach to `batches`, not centers.
- **2-day plans:** a 2-day student attends 2 of a batch's available weekdays.
  How the exact days are chosen (fixed vs. student's choice) still affects
  partial-month counting.
- **No history tables** (quotes/receipts/students) in this phase.
- Add indexes on foreign keys (`center_coaches.center_id`,
  `center_coaches.coach_id`, `batches.center_id`, `batch_timings.batch_id`,
  `plans.batch_id`).
