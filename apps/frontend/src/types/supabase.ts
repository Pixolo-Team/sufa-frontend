/**
 * Hand-written to match docs/operations/schema.sql - there is no live
 * project to run `supabase gen types` against yet. Regenerate properly once
 * the project exists: `npx supabase gen types typescript --project-id <id>`.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
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
				Insert: never;
				Update: never;
				Relationships: [];
			};
			centers: {
				Row: {
					id: string;
					name: string;
					address: string;
					maps_url: string | null;
					sort_order: number;
					is_active: boolean;
					created_at: string;
				};
				Insert: never;
				Update: never;
				Relationships: [];
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
				Insert: never;
				Update: never;
				Relationships: [];
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
				Insert: never;
				Update: never;
				Relationships: [];
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
				Insert: never;
				Update: never;
				Relationships: [];
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
				Insert: never;
				Update: never;
				Relationships: [];
			};
			gameweek_predictions: {
				Row: {
					id: string;
					season: number;
					gameweek: number;
					abhay_snapshot: Json | null;
					harsh_snapshot: Json | null;
					abhay_points: number | null;
					harsh_points: number | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					season: number;
					gameweek: number;
					abhay_snapshot?: Json | null;
					harsh_snapshot?: Json | null;
					abhay_points?: number | null;
					harsh_points?: number | null;
				};
				Update: {
					abhay_snapshot?: Json | null;
					harsh_snapshot?: Json | null;
					abhay_points?: number | null;
					harsh_points?: number | null;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};
