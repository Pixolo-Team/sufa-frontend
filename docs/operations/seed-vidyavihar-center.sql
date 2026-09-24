-- Vidyavihar / Kurla center (JFSC - TURFS). Run once in Supabase SQL Editor,
-- after schema.sql. Safe to re-run (every INSERT is guarded by NOT EXISTS).
--
-- Batches: only U-12 (Youth) and U-16 (Performance) for now.
-- Timings: Tue (2) & Thu (4). U-12 6:30-7:30 PM, U-16 7:30-8:30 PM.
-- Plans: 2-days-a-week only (no 1-day plan here).
-- Registration: global `registration_options` - same as other centers, nothing to add.

-- Center --------------------------------------------------------------------
INSERT INTO centers (name, address, maps_url, sort_order)
SELECT
	'Vidyavihar / Kurla',
	'JFSC - TURFS, near D-Mart, Khalai Village, Vidyavihar West, Ghatkopar West, Mumbai, Maharashtra 400086',
	'https://share.google/RVKrPAYIgaKDaUH6w',
	3
WHERE NOT EXISTS (
	SELECT 1 FROM centers WHERE name = 'Vidyavihar / Kurla'
);

-- Batches -------------------------------------------------------------------
INSERT INTO batches (center_id, name, age_group, sort_order)
SELECT c.id, v.name, v.age_group, v.sort_order
FROM centers c
CROSS JOIN LATERAL (
	VALUES
		('Youth Batch', 'Under-12', 1),
		('Performance Batch', 'Under-16', 2)
) AS v(name, age_group, sort_order)
WHERE c.name = 'Vidyavihar / Kurla'
	AND NOT EXISTS (
		SELECT 1 FROM batches b
		WHERE b.center_id = c.id AND b.name = v.name
	);

-- Timings (Tue = 2, Thu = 4) -------------------------------------------------
INSERT INTO batch_timings (batch_id, day_of_week, start_time, end_time)
SELECT b.id, v.day_of_week, v.start_time, v.end_time
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		('Youth Batch', 2, TIME '18:30', TIME '19:30'),
		('Youth Batch', 4, TIME '18:30', TIME '19:30'),
		('Performance Batch', 2, TIME '19:30', TIME '20:30'),
		('Performance Batch', 4, TIME '19:30', TIME '20:30')
) AS v(batch_name, day_of_week, start_time, end_time)
WHERE c.name = 'Vidyavihar / Kurla'
	AND b.name = v.batch_name
	AND NOT EXISTS (
		SELECT 1 FROM batch_timings t
		WHERE t.batch_id = b.id
			AND t.day_of_week = v.day_of_week
			AND t.start_time = v.start_time
			AND t.end_time = v.end_time
	);

-- Plans (2 days/week only) ----------------------------------------------------
INSERT INTO plans (batch_id, duration_months, days_per_week, price, per_session_price, sort_order)
SELECT b.id, v.duration_months, v.days_per_week, v.price, v.per_session_price, v.sort_order
FROM batches b
JOIN centers c ON c.id = b.center_id
CROSS JOIN LATERAL (
	VALUES
		(1, 2, 2700, 338, 1),
		(3, 2, 7650, 319, 2),
		(6, 2, 14400, 300, 3),
		(12, 2, 27000, 281, 4)
) AS v(duration_months, days_per_week, price, per_session_price, sort_order)
WHERE c.name = 'Vidyavihar / Kurla'
	AND b.name IN ('Youth Batch', 'Performance Batch')
	AND NOT EXISTS (
		SELECT 1 FROM plans p
		WHERE p.batch_id = b.id
			AND p.duration_months = v.duration_months
			AND p.days_per_week = v.days_per_week
	);
