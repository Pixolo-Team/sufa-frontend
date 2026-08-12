-- RLS. Run after schema.sql, in the same SQL Editor session.
--
-- Every table here is read-only, public-safe reference/pricing data (no PII,
-- no secrets - staff_pin is deliberately not in this DB, see schema.sql).
-- Anon key gets SELECT only. No INSERT/UPDATE/DELETE policy exists for any
-- role, so writes are only possible from the Supabase dashboard / service_role,
-- never from the deployed app.

ALTER TABLE configs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches               ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_timings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_options  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON configs               FOR SELECT USING (true);
CREATE POLICY "public read" ON centers               FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON batches               FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON batch_timings         FOR SELECT USING (true);
CREATE POLICY "public read" ON plans                 FOR SELECT USING (is_active = true);
CREATE POLICY "public read" ON registration_options  FOR SELECT USING (is_active = true);
