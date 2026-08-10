# Database Design Documentation

## Overview

This document describes the database architecture for the **`/operations`**
staff tooling of the Skorost United academy site.

The tooling is focused primarily on:
- fee calculation (per batch, with pro-rata support),
- sending the correct fee structure to a parent,
- generating payment QR codes,
- and centre / batch reference data.

The database is designed using **PostgreSQL** (`gen_random_uuid()` from
`pgcrypto` for keys). The frontend reads this data through the backend; it does
not write to these tables directly.

Key architectural goals:
- clean relational structure,
- a **batch-first** model (staff select a batch, then see its timings and plans),
- **day-wise timings** (each weekday inside a batch can have its own time),
- **global payment settings** (payment is not per centre or per batch),
- **global registration options** (add-ons are not tied to a specific batch),
- future extensibility.

Relationships:

```text
configs               (single row, standalone)
centers                1---* batches
batches                1---* batch_timings
batches                1---* plans
registration_options   (global, standalone)
```

---

# CONFIGS

Single-row, academy-wide settings. Payment is global — not per centre, not per
batch.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| academy_name | TEXT | Academy display name |
| upi_id | TEXT | Global UPI ID used by the payment QR |
| payee_name | TEXT | UPI payee name |
| staff_pin | TEXT | Shared staff PIN (checked on the frontend) |
| created_at | TIMESTAMP | Creation timestamp |

---

# CENTERS

Top-level locations, e.g. Ghatkopar East / West. Used for grouping and address
only — no pricing lives here.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | TEXT | Center name |
| address | TEXT | Full address |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |

---

# BATCHES

Each batch belongs to one center and is the main operational selection unit
(e.g. `Evening Batch`, `Under-10 Batch`).

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| center_id | UUID FK | References CENTERS.id |
| name | TEXT | Batch name |
| age_group | TEXT | Age group, e.g. "Under-10", "6-8 years" |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |

---

# BATCH_TIMINGS

Day-wise timing rows for a batch, so Monday and Wednesday can have different
slots. Unique on `(batch_id, day_of_week, start_time, end_time)`.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| batch_id | UUID FK | References BATCHES.id |
| day_of_week | SMALLINT | 0 = Sun … 6 = Sat |
| start_time | TIME | Slot start time |
| end_time | TIME | Slot end time |
| created_at | TIMESTAMP | Creation timestamp |

---

# PLANS

Pricing, linked to a **batch** (not a center). Durations include 1, 3, 6 and 12
months, at 2 or 3 days/week.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| batch_id | UUID FK | References BATCHES.id |
| name | TEXT | Plan name, e.g. "1 Month - 3 Days" |
| duration_months | SMALLINT | 1, 3, 6, 12 |
| days_per_week | SMALLINT | 2 or 3 |
| price | INTEGER | Flat plan price (whole rupees) |
| per_session_price | INTEGER | Stored per-session price for pro-rata |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |

---

# REGISTRATION_OPTIONS

Global, academy-wide add-on packages (e.g. `Registration Package`,
`Starter Package`, `Player Package`) — not linked to any specific batch. Added
on top of the selected plan total in the fee calculator.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | TEXT | Option name |
| description | TEXT | What's included in this registration option |
| price | INTEGER | Add-on price (whole rupees) |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |
