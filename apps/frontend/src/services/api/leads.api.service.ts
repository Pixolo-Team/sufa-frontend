// CONFIG //
import { LEADS_API_URL, LEADS_TENANT_ID } from "./zizo.config";

export type CreateLeadInput = {
	source: "registration_page" | "website" | "operation_portal";
	name?: string | null;
	parentName?: string | null;
	phone: string;
	studentName: string;
	studentDob?: string | null;
	centerId?: string | null;
	gender?: "male" | "female" | "other" | null;
	otherInfo?: string | null;
	consent?: boolean;
};

/** Creates one lead through the Zizo Leads backend. */
export const createLeadRequest = async (input: CreateLeadInput): Promise<void> => {
	const response = await fetch(`${LEADS_API_URL}/public/leads`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-tenant-id": LEADS_TENANT_ID,
		},
		body: JSON.stringify({
			source: input.source,
			studentName: input.studentName,
			studentDob: input.studentDob || null,
			parentName: input.parentName ?? input.name ?? null,
			phone: input.phone,
			centerId: input.centerId || null,
			gender: input.gender ?? null,
			otherInfo: input.otherInfo || null,
			consent: input.consent ?? false,
		}),
	});

	if (response.ok) return;

	const errorBody = await response.json().catch(() => null);
	const message =
		typeof errorBody?.message === "string"
			? errorBody.message
			: "Failed to create lead";

	throw new Error(message);
};
