// DUMMY operations config the /operations page reads today (no backend needed).
// Same shape as GET /operations/centers (docs/operations/04-api.md).
// 🔴 Values are placeholders — see docs/operations/06-dummy-data.md. Replace,
// or switch to the live API via operations.api.service.ts, before production.

export interface OpsConfig {
	upiId: string;
	payeeName: string;
	perSessionRate: number; // rupees
}

export interface OpsPlan {
	id: string;
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	sessionsPerMonth?: number;
	price: number; // rupees, per center
}

export interface OpsCenter {
	id: string;
	name: string;
	address: string;
	timings: string;
	plans: OpsPlan[];
}

export interface OperationsData {
	config: OpsConfig;
	centers: OpsCenter[];
}

/** 🔴 Frontend PIN — checked client-side only (see docs/operations/05). Dummy. */
export const OPERATIONS_PIN = "1234";

export const OPERATIONS_DATA: OperationsData = {
	config: {
		upiId: "skorost@ybl",
		payeeName: "Skorost United Football Academy",
		perSessionRate: 285,
	},
	centers: [
		{
			id: "ghatkopar-east",
			name: "Ghatkopar East",
			address: "12 MG Road, Ghatkopar East, Mumbai 400077",
			timings: "Mon/Wed/Fri, 5:00–6:30 PM",
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3400 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 9000 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2280 },
			],
		},
		{
			id: "ghatkopar-west",
			name: "Ghatkopar West",
			address: "45 LBS Marg, Ghatkopar West, Mumbai 400086",
			timings: "Mon/Wed/Fri, 6:00–7:30 PM",
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3600 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 9500 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2400 },
			],
		},
		{
			id: "powai",
			name: "Powai",
			address: "8 Hiranandani Gardens, Powai, Mumbai 400076",
			timings: "Mon/Wed/Fri, 4:00–5:30 PM",
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3800 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 10000 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2540 },
			],
		},
	],
};
