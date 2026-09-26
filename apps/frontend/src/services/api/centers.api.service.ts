// CONFIG //
import { LEADS_API_URL, LEADS_TENANT_ID } from "./zizo.config";

/** A training center as returned by the Zizo Leads backend. */
export type Center = {
	id: string;
	name: string;
	shortCode?: string | null;
	location: string;
};

// The backend wraps the list in a standard envelope: { data, status, ... }.
type CentersResponse = {
	data: Center[];
};

/** Fetches the tenant's training centers from the Zizo Leads backend. */
export const getCentersRequest = async (): Promise<Center[]> => {
	const response = await fetch(`${LEADS_API_URL}/public/centers`, {
		headers: {
			"x-tenant-id": LEADS_TENANT_ID,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to load centers");
	}

	const body = (await response.json()) as CentersResponse;
	return Array.isArray(body?.data) ? body.data : [];
};
