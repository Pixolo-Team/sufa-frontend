// DUMMY seed data — see docs/operations/06-dummy-data.md.
// 🔴 REPLACE with real values before production.
// The scaffold route returns this directly until a real DB is wired.

import type { OperationsData } from "./types";

export const OPERATIONS_SEED: OperationsData = {
	config: {
		upiId: "skorost@ybl", // 🔴 dummy
		payeeName: "Skorost United Football Academy", // 🔴 dummy
		perSessionRate: 285, // confirmed
	},
	centers: [
		{
			id: "ghatkopar-east",
			name: "Ghatkopar East",
			address: "12 MG Road, Ghatkopar East, Mumbai 400077", // 🔴 dummy
			timings: "Mon/Wed/Fri, 5:00–6:30 PM", // 🔴 dummy
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3400 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 9000 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2280 },
			],
		},
		{
			id: "ghatkopar-west",
			name: "Ghatkopar West",
			address: "45 LBS Marg, Ghatkopar West, Mumbai 400086", // 🔴 dummy
			timings: "Mon/Wed/Fri, 6:00–7:30 PM", // 🔴 dummy
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3600 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 9500 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2400 },
			],
		},
		{
			id: "powai",
			name: "Powai",
			address: "8 Hiranandani Gardens, Powai, Mumbai 400076", // 🔴 dummy
			timings: "Mon/Wed/Fri, 4:00–5:30 PM", // 🔴 dummy
			plans: [
				{ id: "1m-3d", name: "1-Month 3-Day", durationMonths: 1, daysPerWeek: 3, sessionsPerMonth: 12, price: 3800 },
				{ id: "6m-3d", name: "6-Month", durationMonths: 6, daysPerWeek: 3, price: 10000 },
				{ id: "1m-2d", name: "1-Month 2-Day", durationMonths: 1, daysPerWeek: 2, sessionsPerMonth: 8, price: 2540 },
			],
		},
	],
};
