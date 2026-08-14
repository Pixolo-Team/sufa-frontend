// SUPABASE //
import { supabase } from "./supabase.client";

// TYPES //
import type { OperationsData } from "@/types/operations";
import type { Database } from "@/types/supabase";

// UTILS //
import { getStaticBatchImageSrc } from "@/utils/operations.util";

type ConfigRow = Database["public"]["Tables"]["configs"]["Row"];
type CenterRow = Database["public"]["Tables"]["centers"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];
type BatchTimingRow = Database["public"]["Tables"]["batch_timings"]["Row"];
type PlanRow = Database["public"]["Tables"]["plans"]["Row"];

/**
 * Flat queries, assembled in JS - rather than one nested `.select()` - because
 * Supabase's nested-join type inference needs FK metadata (`Relationships`)
 * that only the CLI codegen produces; the hand-written Database type in
 * types/supabase.ts does not have it, so a nested select resolves to `never`.
 * Swap for a real nested query (and delete this file's assembly step) once
 * `npx supabase gen types` has run against the real project.
 */
export const fetchOperationsData = async (): Promise<OperationsData> => {
	const [
		centersResult,
		batchesResult,
		timingsResult,
		plansResult,
		configResult,
		registrationResult,
	] = await Promise.all([
		supabase
			.from("centers")
			.select("id, name, address")
			.eq("is_active", true)
			.order("sort_order"),
		supabase
			.from("batches")
			.select("id, center_id, name, age_group")
			.eq("is_active", true)
			.order("sort_order"),
		supabase
			.from("batch_timings")
			.select("batch_id, day_of_week, start_time, end_time")
			.order("day_of_week"),
		supabase
			.from("plans")
			.select("id, batch_id, duration_months, days_per_week, price, per_session_price")
			.eq("is_active", true)
			.order("sort_order"),
		supabase.from("configs").select("academy_name, upi_id, payee_name").limit(1).single(),
		supabase
			.from("registration_options")
			.select("id, name, description, price")
			.eq("is_active", true)
			.order("sort_order"),
	]);

	if (centersResult.error) throw centersResult.error;
	if (batchesResult.error) throw batchesResult.error;
	if (timingsResult.error) throw timingsResult.error;
	if (plansResult.error) throw plansResult.error;
	if (configResult.error) throw configResult.error;
	if (registrationResult.error) throw registrationResult.error;

	const staffPin = import.meta.env.PUBLIC_STAFF_PIN;

	if (!staffPin) {
		throw new Error("Missing PUBLIC_STAFF_PIN. Set it in apps/frontend/.env.");
	}

	const config: Pick<ConfigRow, "academy_name" | "upi_id" | "payee_name"> =
		configResult.data;
	const centers: CenterRow[] = centersResult.data;
	const batches: BatchRow[] = batchesResult.data;
	const timings: BatchTimingRow[] = timingsResult.data;
	const plans: PlanRow[] = plansResult.data;

	return {
		config: {
			academyName: config.academy_name,
			upiId: config.upi_id,
			payeeName: config.payee_name,
			staffPin,
		},
		registrationOptions: registrationResult.data,
		centers: centers.map((center) => ({
			id: center.id,
			name: center.name,
			address: center.address,
			batches: batches
				.filter((batch) => batch.center_id === center.id)
				.map((batch) => {
					return {
						id: batch.id,
						name: batch.name,
						ageGroup: batch.age_group,
						imageSrc: getStaticBatchImageSrc(batch.name),
						schedule: timings
							.filter((timing) => timing.batch_id === batch.id)
							.map((timing) => ({
								day: timing.day_of_week,
								startTime: timing.start_time,
								endTime: timing.end_time,
							})),
						plans: plans
							.filter((plan) => plan.batch_id === batch.id)
							.map((plan) => ({
								id: plan.id,
								durationMonths: plan.duration_months,
								daysPerWeek: plan.days_per_week,
								price: plan.price,
								perSessionPrice: plan.per_session_price,
							})),
					};
				}),
		})),
	};
};
