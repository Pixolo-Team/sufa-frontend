# Operations Database

Database structure for the `/operations` tooling: fee calculator, fee
structure, and payment QR. PostgreSQL is assumed. The frontend reads this data
through the backend; it does not write to these tables directly.

## Why this model

The latest requirement is batch-first, not center-first:

- staff selects a `batch`, then sees timings
- timings can differ by day within the same batch
- plans belong to the selected batch
- registration packages also belong to the selected batch
- payment settings stay global

Because of that, pricing and schedule logic lives under `batches`, while
`centers` remain the parent grouping for address and coach assignment.

## Conventions

- Primary keys are `UUID` with `gen_random_uuid()`.
- Table names are plural.
- Timestamps use `TIMESTAMPTZ` with `DEFAULT now()`.
- Currency values are stored as whole rupees in `INTEGER`.

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## High-level relationships

```text
configs (single row)

centers 1---* center_coaches *---1 coaches
centers 1---* batches
batches 1---* batch_timings
batches 1---* plans
batches 1---* registration_options
```

## Tables

### `configs`

Global academy-wide payment and access settings.

```sql
CREATE TABLE configs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_name TEXT NOT NULL,
    upi_id       TEXT NOT NULL,
    payee_name   TEXT NOT NULL,
    staff_pin    TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Notes:

- Intended as a single-row table for this feature set.
- Payment is global, not per center and not per batch.

### `centers`

Top-level locations such as `Ghatkopar East` or `Ghatkopar West`.

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

Coach master table. Coaches can be mapped to multiple centers.

```sql
CREATE TABLE coaches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    phone      TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `center_coaches`

Join table between centers and coaches.

```sql
CREATE TABLE center_coaches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    coach_id   UUID NOT NULL REFERENCES coaches(id),
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (center_id, coach_id)
);
```

### `batches`

Each batch belongs to one center. This is the main operational selection unit.

```sql
CREATE TABLE batches (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id  UUID NOT NULL REFERENCES centers(id),
    name       TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Examples:

- `Evening Batch`
- `Morning Batch`
- `Under-10 Batch`

### `batch_timings`

Stores day-wise timing rows for each batch, so Monday and Wednesday can have
different time slots.

```sql
CREATE TABLE batch_timings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id    UUID NOT NULL REFERENCES batches(id),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (batch_id, day_of_week, start_time, end_time)
);
```

Examples:

- Monday 6:00 PM - 7:00 PM
- Wednesday 7:00 PM - 8:00 PM

### `plans`

Plans are batch-linked. This is the key shift from the earlier center-based
approach.

```sql
CREATE TABLE plans (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id          UUID NOT NULL REFERENCES batches(id),
    name              TEXT NOT NULL,
    duration_months   SMALLINT NOT NULL,
    days_per_week     SMALLINT NOT NULL,
    price             INTEGER NOT NULL,
    per_session_price INTEGER NOT NULL,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Recommended examples:

- `1 Month - 3 Days`
- `3 Months - 3 Days`
- `6 Months - 3 Days`
- `12 Months - 3 Days`
- `1 Month - 2 Days`

Notes:

- `price` is the stored flat price for the plan.
- `per_session_price` is also stored, not derived.
- This supports pro-rata calculation for partial joins.

### `registration_options`

Optional add-on package choices tied to a batch.

```sql
CREATE TABLE registration_options (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id   UUID NOT NULL REFERENCES batches(id),
    name       TEXT NOT NULL,
    price      INTEGER NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Current package names from the latest reference:

- `Registration Package`
- `Starter Package`
- `Player Package`

Notes:

- These are added separately on top of the selected plan total.
- Different batches may expose different registration options and prices.

## API shape mapping

The frontend currently consumes a nested shape equivalent to:

```text
config
centers[]
  coaches[]
  batches[]
    schedule[]
    plans[]
    registrationOptions[]
```

That means SQL rows from `batch_timings`, `plans`, and `registration_options`
should be grouped under each batch when building the API response.

## Summary

- `centers` are for grouping, address, and coach assignment.
- `batches` are the real operational unit.
- `batch_timings` handle different times on different days.
- `plans` are linked to batches, not centers.
- `registration_options` are linked to batches, not centers.
- `configs` holds the shared payment configuration.
