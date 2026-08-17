-- Academy operations schema
-- Batch-linked pricing, schedule and registration options.

CREATE TABLE IF NOT EXISTS configs (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	academy_name TEXT NOT NULL,
	upi_id TEXT NOT NULL,
	payee_name TEXT NOT NULL,
	staff_pin TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS centers (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	address TEXT NOT NULL,
	maps_url TEXT,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coaches (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	phone TEXT,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS center_coaches (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	center_id UUID NOT NULL REFERENCES centers(id),
	coach_id UUID NOT NULL REFERENCES coaches(id),
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (center_id, coach_id)
);

CREATE TABLE IF NOT EXISTS batches (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	center_id UUID NOT NULL REFERENCES centers(id),
	name TEXT NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS batch_timings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	batch_id UUID NOT NULL REFERENCES batches(id),
	day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (batch_id, day_of_week, start_time, end_time)
);

CREATE TABLE IF NOT EXISTS plans (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	batch_id UUID NOT NULL REFERENCES batches(id),
	name TEXT NOT NULL,
	duration_months SMALLINT NOT NULL,
	days_per_week SMALLINT NOT NULL,
	price INTEGER NOT NULL,
	per_session_price INTEGER NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registration_options (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	batch_id UUID NOT NULL REFERENCES batches(id),
	name TEXT NOT NULL,
	price INTEGER NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
