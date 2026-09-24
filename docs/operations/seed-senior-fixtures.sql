-- Senior season fixtures + results (points table source).
-- Run once in Supabase SQL Editor, after schema.sql.
-- Safe to re-run (table creation is IF NOT EXISTS, policies are dropped first).
--
-- The points table itself is NOT stored: /senior-seasons/26-27/points-table
-- fetches these rows and computes P/W/D/L/GF/GA/GD/points in the browser.

CREATE TABLE IF NOT EXISTS senior_fixtures (
	id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	season      TEXT NOT NULL DEFAULT '26-27',
	home_team   TEXT NOT NULL,
	away_team   TEXT NOT NULL CHECK (home_team <> away_team),
	home_score  INTEGER CHECK (home_score IS NULL OR home_score >= 0),
	away_score  INTEGER CHECK (away_score IS NULL OR away_score >= 0),
	created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
	CONSTRAINT senior_fixtures_unique_match UNIQUE (season, home_team, away_team)
);

CREATE INDEX IF NOT EXISTS idx_senior_fixtures_season
	ON senior_fixtures(season);

-- RLS: same anon-key tradeoff as donations/gameweek_predictions. The
-- fixtures page sits behind the staff PIN gate; the points table reads
-- published rows publicly. Staff edits (score updates) need UPDATE too.
ALTER TABLE senior_fixtures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read" ON senior_fixtures;
CREATE POLICY "public read" ON senior_fixtures
	FOR SELECT USING (true);

DROP POLICY IF EXISTS "staff write" ON senior_fixtures;
CREATE POLICY "staff write" ON senior_fixtures
	FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "staff update" ON senior_fixtures;
CREATE POLICY "staff update" ON senior_fixtures
	FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff delete" ON senior_fixtures;
CREATE POLICY "staff delete" ON senior_fixtures
	FOR DELETE USING (true);
