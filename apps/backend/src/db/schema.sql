-- Academy operations schema
-- See docs/operations/03-db-schema.md
-- Dialect: portable SQL (tune types per actual DB engine).

-- Global config: one row. Holds the shared UPI + per-session rate.
CREATE TABLE IF NOT EXISTS ops_config (
	id               INTEGER PRIMARY KEY,          -- always 1
	upi_id           TEXT    NOT NULL,
	payee_name       TEXT    NOT NULL,
	per_session_rate INTEGER NOT NULL DEFAULT 285, -- rupees
	access_pin       TEXT                          -- optional; PIN checked on frontend for now
);

-- Academy centers. address + timings feed the WhatsApp fee message.
CREATE TABLE IF NOT EXISTS ops_center (
	id       TEXT    PRIMARY KEY,   -- slug, e.g. "ghatkopar-east"
	name     TEXT    NOT NULL,
	address  TEXT    NOT NULL,
	timings  TEXT    NOT NULL,
	active   INTEGER NOT NULL DEFAULT 1
);

-- Plans (attendance/duration templates), shared across centers.
CREATE TABLE IF NOT EXISTS ops_plan (
	id                 TEXT    PRIMARY KEY,   -- e.g. "1m-3d", "6m-3d", "1m-2d"
	name               TEXT    NOT NULL,
	duration_months    INTEGER NOT NULL,
	days_per_week      INTEGER NOT NULL,
	sessions_per_month INTEGER,               -- NULL for multi-month plans
	active             INTEGER NOT NULL DEFAULT 1
);

-- Per-center price for each plan (prices differ by center).
CREATE TABLE IF NOT EXISTS ops_center_plan_price (
	center_id TEXT    NOT NULL REFERENCES ops_center(id),
	plan_id   TEXT    NOT NULL REFERENCES ops_plan(id),
	price     INTEGER NOT NULL,               -- rupees
	PRIMARY KEY (center_id, plan_id)
);

-- NOTE: no fee_quote / history table yet (ephemeral generation, see doc 01 Q8).
