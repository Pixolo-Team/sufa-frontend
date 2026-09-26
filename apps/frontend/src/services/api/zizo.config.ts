// Shared configuration for the Zizo Leads backend (leads + centers endpoints).

/** Base URL of the Zizo Leads backend, with any trailing slash stripped. */
export const LEADS_API_URL =
	import.meta.env.PUBLIC_LEADS_API_URL?.replace(/\/$/, "") ??
	"http://localhost:3000";

/** Identifies which tenant every request belongs to, sent as the x-tenant-id header. */
export const LEADS_TENANT_ID = import.meta.env.PUBLIC_LEADS_TENANT_ID ?? "";
