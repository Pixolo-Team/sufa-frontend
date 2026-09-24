-- Donations (donor wall). Run once in Supabase SQL Editor.
-- Self-contained: creates the table + policies if missing, then seeds the
-- first entry. Safe to re-run (seed row inserts only if not present).
--
-- Same soft-gate tradeoff as gameweek_predictions (see rls-policies.sql):
-- the staff tool reads/writes with the anon key, so the PIN on
-- /add-donation is obfuscation, not real auth. No PII beyond donor names
-- staff choose to publish lives here.

CREATE TABLE IF NOT EXISTS donations (
	id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name        TEXT NOT NULL,
	amount      INTEGER NOT NULL CHECK (amount > 0),
	details     TEXT NOT NULL DEFAULT '',
	donated_on  DATE NOT NULL DEFAULT CURRENT_DATE,
	is_visible  BOOLEAN NOT NULL DEFAULT true,
	created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_donated_on ON donations(donated_on DESC);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read" ON donations;
CREATE POLICY "public read" ON donations
	FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "public insert" ON donations;
CREATE POLICY "public insert" ON donations
	FOR INSERT WITH CHECK (true);

-- First entry (matches the requested Name - date - amount - details format).
INSERT INTO donations (name, amount, details, donated_on)
SELECT 'Gaurav Idani', 1400, '1 Player Match kits', DATE '2026-09-21'
WHERE NOT EXISTS (
	SELECT 1 FROM donations
	WHERE name = 'Gaurav Idani' AND amount = 1400 AND donated_on = DATE '2026-09-21'
);
