// SUPABASE //
import { createClient } from "@supabase/supabase-js";

// TYPES //
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY. Set them in apps/frontend/.env."
	);
}

/**
 * Anon-key client. Runs entirely in the browser (the operations page is
 * `client:only="react"`), so this must never receive the service_role key -
 * access is enforced by the RLS policies in db/schema.sql, not by this file.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
