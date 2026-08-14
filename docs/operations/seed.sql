-- DUMMY seed - mirrors apps/frontend/src/data/operations.data.ts.
-- REPLACE with real prices/addresses/timings before going live.
-- Run after schema.sql + rls-policies.sql.

INSERT INTO configs (academy_name, upi_id, payee_name) VALUES
	('Skorost United Football Academy', 'skorostunitedfootballschool@kotak', 'Skorost United Football School');

INSERT INTO centers (name, address, sort_order) VALUES
	('Ghatkopar East', '12 MG Road, Ghatkopar East, Mumbai 400077', 1),
	('Ghatkopar West', '45 LBS Marg, Ghatkopar West, Mumbai 400086', 2);

-- Batches - same 5 batches at both centers, days differ by center (see timings below).
INSERT INTO batches (center_id, name, age_group, sort_order)
SELECT c.id, v.name, v.age_group, v.sort_order
FROM centers c
CROSS JOIN LATERAL (
	VALUES
		('Foundation Batch', 'Under-8', 1),
		('Grassroot Batch', 'Under-10', 2),
		('Youth Batch', 'Under-12', 3),
		('Performance Batch', 'Under-16', 4),
		('Focus Batch', 'Mixed Age', 5)
) AS v(name, age_group, sort_order);

-- Timings - East runs Mon/Wed/Fri, West runs the same slots shifted to Tue/Thu/Sat.
INSERT INTO batch_timings (batch_id, day_of_week, start_time, end_time)
SELECT b.id, v.day_of_week, v.start_time, v.end_time
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar East (Mon=1, Wed=3, Fri=5)
		('Ghatkopar East', 'Foundation Batch', 1, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Foundation Batch', 3, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Foundation Batch', 5, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Grassroot Batch', 1, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Grassroot Batch', 3, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Grassroot Batch', 5, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Youth Batch', 1, TIME '19:00', TIME '20:00'),
		('Ghatkopar East', 'Youth Batch', 3, TIME '19:00', TIME '20:00'),
		('Ghatkopar East', 'Youth Batch', 5, TIME '18:00', TIME '19:00'),
		('Ghatkopar East', 'Performance Batch', 1, TIME '20:00', TIME '21:00'),
		('Ghatkopar East', 'Performance Batch', 3, TIME '20:00', TIME '21:00'),
		('Ghatkopar East', 'Performance Batch', 5, TIME '20:00', TIME '21:00'),
		('Ghatkopar East', 'Focus Batch', 1, TIME '19:00', TIME '20:00'),
		('Ghatkopar East', 'Focus Batch', 3, TIME '19:00', TIME '20:00'),
		-- Ghatkopar West (Tue=2, Thu=4, Sat=6)
		('Ghatkopar West', 'Foundation Batch', 2, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Foundation Batch', 4, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Foundation Batch', 6, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Grassroot Batch', 2, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Grassroot Batch', 4, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Grassroot Batch', 6, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Youth Batch', 2, TIME '19:00', TIME '20:00'),
		('Ghatkopar West', 'Youth Batch', 4, TIME '19:00', TIME '20:00'),
		('Ghatkopar West', 'Youth Batch', 6, TIME '18:00', TIME '19:00'),
		('Ghatkopar West', 'Performance Batch', 2, TIME '20:00', TIME '21:00'),
		('Ghatkopar West', 'Performance Batch', 4, TIME '20:00', TIME '21:00'),
		('Ghatkopar West', 'Performance Batch', 6, TIME '20:00', TIME '21:00'),
		('Ghatkopar West', 'Focus Batch', 2, TIME '19:00', TIME '20:00'),
		('Ghatkopar West', 'Focus Batch', 4, TIME '19:00', TIME '20:00')
) AS v(center_name, batch_name, day_of_week, start_time, end_time)
WHERE c.name = v.center_name AND b.name = v.batch_name;

-- Plans - Foundation/Grassroot/Youth/Performance share one price table per center.
INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar East - 3-day price is the base; 2-day and per-session are derived from it.
		(1, 3, 3400, 280, 1), (1, 2, 2240, 280, 2),
		(3, 3, 9000, 250, 3), (3, 2, 6000, 250, 4),
		(6, 3, 18000, 250, 5), (6, 2, 12000, 250, 6),
		(12, 3, 35500, 250, 7), (12, 2, 24000, 250, 8)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Ghatkopar East'
	AND b.name IN ('Foundation Batch', 'Grassroot Batch', 'Youth Batch', 'Performance Batch');

INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		-- Ghatkopar West (dummy pricing)
		(1, 3, 3800, 320, 1), (1, 2, 2560, 320, 2),
		(3, 3, 10200, 280, 3), (3, 2, 6720, 280, 4),
		(6, 3, 20400, 280, 5), (6, 2, 13440, 280, 6),
		(12, 3, 40300, 280, 7), (12, 2, 26880, 280, 8)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Ghatkopar West'
	AND b.name IN ('Foundation Batch', 'Grassroot Batch', 'Youth Batch', 'Performance Batch');

-- Focus Batch - single 2-day / 1-month plan, priced separately per center.
INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, 1, 2, 1600, 200, 1
FROM batches b
JOIN centers c ON c.id = b.center_id
WHERE c.name = 'Ghatkopar East' AND b.name = 'Focus Batch';

INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, 1, 2, 1800, 230, 1
FROM batches b
JOIN centers c ON c.id = b.center_id
WHERE c.name = 'Ghatkopar West' AND b.name = 'Focus Batch';

INSERT INTO registration_options (name, description, price, sort_order) VALUES
	('Registration Package', 'One-time registration fee, includes ID card and academy kit bag.', 1160, 1),
	('Starter Package', 'Registration plus starter training gear - jersey and socks.', 2150, 2),
	('Player Package', 'Full player kit - jersey, shorts, socks and academy backpack.', 3560, 3);
