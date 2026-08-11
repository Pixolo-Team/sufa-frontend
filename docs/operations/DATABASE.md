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

> ⚠️ `staff_pin` is a **soft gate, not authentication.** It is sent to the
> browser and compared client-side, so anyone who reads the JS can recover it.
> That is acceptable for an unlisted internal tool, but do not treat it as
> access control, and do not put anything behind it that a leak would matter for.

---

# CENTERS

Top-level locations, e.g. Ghatkopar East / West. Used for grouping and address
only — no pricing lives here.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | TEXT | Center name |
| address | TEXT | Full address |
| sort_order | SMALLINT | Display order of the center tabs |
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
| sort_order | SMALLINT | Display order within the center |
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
| duration_months | SMALLINT | 1, 3, 6, 12 |
| days_per_week | SMALLINT | 2 or 3 |
| price | INTEGER | Flat plan price (whole rupees) |
| per_session_price | INTEGER | Stored per-session price for pro-rata |
| sort_order | SMALLINT | Display order within the batch |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |

**`UNIQUE (batch_id, duration_months, days_per_week)`** — required, not
optional. Staff pick a plan by choosing a duration and then a days-per-week,
so the pair must resolve to exactly one row. If duplicates exist the app
silently takes the first and the others can never be selected.

> **There is deliberately no `name` column.** The plan label is derived from
> `duration_months` + `days_per_week` (`1 Month`, `3 Months · 2 Days a Week`),
> so there is one source of truth. An earlier draft stored a name as well,
> which drifted: the fee card showed the derived label while the UPI
> transaction note showed the stored one, and a parent could see two different
> names for the same plan. If a marketing name is ever needed, add it as an
> explicit display override and make **every** surface honour it.

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
| sort_order | SMALLINT | Display order in the registration tabs |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |

---

# NOT IN THIS PHASE (deliberate)

There are **no payment, quote, receipt or student tables**, and that is a
decision rather than an omission. Fees are calculated in the browser and the
QR is generated on the spot; nothing about the transaction is persisted.

The consequence to be aware of: a payment arrives as an anonymous bank credit.
The student name and plan are written into the UPI transaction note so staff
can match it by hand in the settlement report — but some UPI apps let the payer
edit that note, so it is a convenience, not a guarantee. If reconciliation
becomes painful, the fix is a `fee_quotes` history table, not a longer note.
