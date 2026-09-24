// SUPABASE //
import { supabase } from "./supabase.client";

// TYPES //
import type { CreateDonationInput, DonationData } from "@/types/donations";
import type { Database } from "@/types/supabase";

type DonationRow = Database["public"]["Tables"]["donations"]["Row"];

const toDonationData = (row: DonationRow): DonationData => ({
	id: row.id,
	name: row.name,
	amount: row.amount,
	details: row.details,
	donatedOn: row.donated_on,
});

/** Newest first - powers the public donor wall (/donations). */
export const fetchDonations = async (): Promise<DonationData[]> => {
	const { data, error } = await supabase
		.from("donations")
		.select("id, name, amount, details, donated_on, is_visible, created_at")
		.eq("is_visible", true)
		.order("donated_on", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) throw error;

	return (data ?? []).map(toDonationData);
};

/** Staff form (/add-donation) - inserts one donor row. */
export const createDonation = async (input: CreateDonationInput): Promise<void> => {
	const { error } = await supabase.from("donations").insert({
		name: input.name.trim(),
		amount: input.amount,
		details: input.details.trim(),
		donated_on: input.donatedOn,
	});

	if (error) throw error;
};
