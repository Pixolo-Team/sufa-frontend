// Shared operations types. Mirrors schema.sql and the GET /operations/centers
// response in docs/operations/04-api.md. Frontend imports the same shapes.

export interface OpsConfig {
	upiId: string;
	payeeName: string;
	perSessionRate: number; // rupees, e.g. 285
}

export interface OpsPlan {
	id: string; // "1m-3d" | "6m-3d" | "1m-2d" | ...
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	sessionsPerMonth?: number; // omitted for multi-month plans
	price: number; // rupees, resolved per center
}

export interface OpsCenter {
	id: string; // slug
	name: string;
	address: string;
	timings: string;
	plans: OpsPlan[];
}

// Full payload returned by GET /operations/centers
export interface OperationsData {
	config: OpsConfig;
	centers: OpsCenter[];
}
