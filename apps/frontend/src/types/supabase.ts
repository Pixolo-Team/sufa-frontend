/**
 * Hand-written to match docs/operations/schema.sql - there is no live
 * project to run `supabase gen types` against yet. Regenerate properly once
 * the project exists: `npx supabase gen types typescript --project-id <id>`.
 */
export type Database = {
	public: {
		Tables: {
			configs: {
				Row: {
					id: string;
					academy_name: string;
					upi_id: string;
					payee_name: string;
					created_at: string;
				};
			};
			centers: {
				Row: {
					id: string;
					name: string;
					address: string;
					sort_order: number;
					is_active: boolean;
					created_at: string;
				};
			};
			batches: {
				Row: {
					id: string;
					center_id: string;
					name: string;
					age_group: string;
					sort_order: number;
					is_active: boolean;
					created_at: string;
				};
			};
			batch_timings: {
				Row: {
					id: string;
					batch_id: string;
					day_of_week: number;
					start_time: string;
					end_time: string;
					created_at: string;
				};
			};
			plans: {
				Row: {
					id: string;
					batch_id: string;
					duration_months: number;
					days_per_week: number;
					price: number;
					per_session_price: number;
					sort_order: number;
					is_active: boolean;
					created_at: string;
				};
			};
			registration_options: {
				Row: {
					id: string;
					name: string;
					description: string;
					price: number;
					sort_order: number;
					is_active: boolean;
					created_at: string;
				};
			};
		};
	};
};
