-- Operations DB schema. Run once in Supabase SQL Editor.
-- Mirrors docs/operations/DATABASE.md - keep both in sync.
--
-- staff_pin is deliberately NOT here: the frontend reads this DB directly
-- with the anon key (no backend), so anything in these tables is a public
-- GET request away. The pin stays a client-side constant, same soft-gate
-- risk as before - just not additionally exposed via a public API.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE configs (
	id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	academy_name  TEXT NOT NULL,
	upi_id        TEXT NOT NULL,
	payee_name    TEXT NOT NULL,
	created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE centers (
	id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name        TEXT NOT NULL,
	address     TEXT NOT NULL,
	maps_url    TEXT,
	sort_order  SMALLINT NOT NULL DEFAULT 0,
	is_active   BOOLEAN NOT NULL DEFAULT true,
	created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE batches (
	id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	center_id   UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
	name        TEXT NOT NULL,
	age_group   TEXT NOT NULL,
	sort_order  SMALLINT NOT NULL DEFAULT 0,
	is_active   BOOLEAN NOT NULL DEFAULT true,
	created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_batches_center_id ON batches(center_id);

CREATE TABLE batch_timings (
	id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	batch_id     UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
	day_of_week  SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
	start_time   TIME NOT NULL,
	end_time     TIME NOT NULL,
	created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (batch_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_batch_timings_batch_id ON batch_timings(batch_id);

CREATE TABLE plans (
	id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	batch_id            UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
	duration_months     SMALLINT NOT NULL CHECK (duration_months IN (1, 3, 6, 12)),
	days_per_week       SMALLINT NOT NULL CHECK (days_per_week IN (2, 3)),
	price               INTEGER NOT NULL,
	per_session_price   INTEGER NOT NULL,
	sort_order          SMALLINT NOT NULL DEFAULT 0,
	is_active           BOOLEAN NOT NULL DEFAULT true,
	created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
	-- Staff pick a plan by (duration, days) - the pair must resolve to one row,
	-- or a duplicate becomes permanently unselectable in the UI.
	UNIQUE (batch_id, duration_months, days_per_week)
);

CREATE INDEX idx_plans_batch_id ON plans(batch_id);

CREATE TABLE registration_options (
	id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name         TEXT NOT NULL,
	description  TEXT NOT NULL,
	price        INTEGER NOT NULL,
	sort_order   SMALLINT NOT NULL DEFAULT 0,
	is_active    BOOLEAN NOT NULL DEFAULT true,
	created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enquiries captured by staff in the operations "Add Lead" tool. Anon key
-- writes here (no backend), so RLS must allow inserts - see policy below.
-- Length checks are a cheap guard against garbage/oversized payloads on the
-- open anon-insert policy below - they do not stop spam volume, which would
-- need a rate limiter or captcha in front of this (no backend to host one yet).
CREATE TABLE leads (
	id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
	phone         TEXT NOT NULL CHECK (char_length(phone) BETWEEN 1 AND 20),
	student_name  TEXT NOT NULL CHECK (char_length(student_name) BETWEEN 1 AND 100),
	student_dob   DATE,
	other_info    TEXT CHECK (other_info IS NULL OR char_length(other_info) <= 2000),
	created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert on leads" ON leads
	FOR INSERT TO anon WITH CHECK (true);
