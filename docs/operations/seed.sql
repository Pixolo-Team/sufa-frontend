-- DUMMY seed - mirrors apps/frontend/src/data/operations.data.ts.
-- REPLACE with real prices/addresses/timings before going live.
-- Run after schema.sql + rls-policies.sql.

INSERT INTO configs (academy_name, upi_id, payee_name) VALUES
	('Skorost United Football Academy', 'skorostunitedfootballschool@kotak', 'Skorost United Football Academy');

WITH east AS (
	INSERT INTO centers (name, address, sort_order) VALUES
		('Ghatkopar East', '12 MG Road, Ghatkopar East, Mumbai 400077', 1)
	RETURNING id
),
west AS (
	INSERT INTO centers (name, address, sort_order) VALUES
		('Ghatkopar West', '45 LBS Marg, Ghatkopar West, Mumbai 400086', 2)
	RETURNING id
),
east_evening AS (
	INSERT INTO batches (center_id, name, age_group, sort_order)
	SELECT id, 'Evening Batch', 'Under-14', 1 FROM east
	RETURNING id
),
east_morning AS (
	INSERT INTO batches (center_id, name, age_group, sort_order)
	SELECT id, 'Morning Batch', 'Under-10', 2 FROM east
	RETURNING id
),
west_evening AS (
	INSERT INTO batches (center_id, name, age_group, sort_order)
	SELECT id, 'Evening Batch', 'Under-12', 1 FROM west
	RETURNING id
)
INSERT INTO batch_timings (batch_id, day_of_week, start_time, end_time)
SELECT id, 1, TIME '18:00', TIME '19:00' FROM east_evening
UNION ALL SELECT id, 3, TIME '19:00', TIME '20:00' FROM east_evening
UNION ALL SELECT id, 5, TIME '18:30', TIME '19:30' FROM east_evening
UNION ALL SELECT id, 2, TIME '07:00', TIME '08:00' FROM east_morning
UNION ALL SELECT id, 4, TIME '07:30', TIME '08:30' FROM east_morning
UNION ALL SELECT id, 6, TIME '08:00', TIME '09:00' FROM east_morning
UNION ALL SELECT id, 1, TIME '17:30', TIME '18:30' FROM west_evening
UNION ALL SELECT id, 3, TIME '18:30', TIME '19:30' FROM west_evening
UNION ALL SELECT id, 5, TIME '17:30', TIME '18:30' FROM west_evening;

-- Plans - one row per (batch, duration, days). Prices from the dummy data.
INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar East · Evening Batch (per-session 285)
		(1, 3, 3400, 285, 1), (1, 2, 2280, 285, 2),
		(3, 3, 9600, 285, 3), (3, 2, 6400, 285, 4),
		(6, 3, 18600, 285, 5), (6, 2, 12400, 285, 6),
		(12, 3, 34800, 285, 7), (12, 2, 23200, 285, 8)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Ghatkopar East' AND b.name = 'Evening Batch';

INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar East · Morning Batch (per-session 300)
		(1, 3, 3550, 300, 1), (1, 2, 2370, 300, 2),
		(3, 3, 9950, 300, 3), (3, 2, 6650, 300, 4),
		(6, 3, 19200, 300, 5), (6, 2, 12800, 300, 6),
		(12, 3, 36000, 300, 7), (12, 2, 24000, 300, 8)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Ghatkopar East' AND b.name = 'Morning Batch';

INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar West · Evening Batch (per-session 300)
		(1, 3, 3600, 300, 1), (1, 2, 2400, 300, 2),
		(3, 3, 10200, 300, 3), (3, 2, 6800, 300, 4),
		(6, 3, 19800, 300, 5), (6, 2, 13200, 300, 6),
		(12, 3, 37200, 300, 7), (12, 2, 24800, 300, 8)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Ghatkopar West' AND b.name = 'Evening Batch';

INSERT INTO registration_options (name, description, price, sort_order) VALUES
	('Registration Package', 'One-time registration fee, includes ID card and academy kit bag.', 1160, 1),
	('Starter Package', 'Registration plus starter training gear - jersey and socks.', 2150, 2),
	('Player Package', 'Full player kit - jersey, shorts, socks and academy backpack.', 3560, 3);
