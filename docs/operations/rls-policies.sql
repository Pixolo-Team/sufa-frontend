-- RLS. Run after schema.sql, in the same SQL Editor session.
--
-- Reference/pricing tables are read-only, public-safe data (no PII, no
-- secrets - staff_pin is deliberately not in this DB, see schema.sql).
-- Anon key gets SELECT only there, so writes are only possible from the
-- Supabase dashboard / service_role, never from the deployed app.
--
-- Exception: gameweek_predictions (Score Predictor). Snapshots hold team
-- names + predicted scores only — no PII — so the staff tool reads and
-- upserts them with the anon key. There is one row per (season, gameweek).

ALTER TABLE configs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches               ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_timings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_options  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gameweek_predictions  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON configs               FOR SELECT USING (true);
CREATE POLICY "public read" ON centers               FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON batches               FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON batch_timings         FOR SELECT USING (true);
CREATE POLICY "public read" ON plans                 FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON registration_options  FOR SELECT USING (is_active = true);

CREATE POLICY "public read" ON gameweek_predictions
	FOR SELECT USING (true);
CREATE POLICY "public insert" ON gameweek_predictions
	FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON gameweek_predictions
	FOR UPDATE USING (true) WITH CHECK (true);
