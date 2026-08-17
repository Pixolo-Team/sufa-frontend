// SUPABASE //
import { supabase } from "@/services/supabase.client";

export type CreateLeadInput = {
	name: string;
	phone: string;
	studentName: string;
	studentDob: string;
	otherInfo: string;
};

/** Inserts one row into the `leads` table. */
export const createLeadRequest = async (input: CreateLeadInput): Promise<void> => {
	const { error } = await supabase.from("leads").insert({
		name: input.name,
		phone: input.phone,
		student_name: input.studentName,
		student_dob: input.studentDob || null,
		other_info: input.otherInfo || null,
	});

	if (error) throw error;
};
