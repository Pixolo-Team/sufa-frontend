// DUMMY seed data - replace with real values before production.
// The scaffold route returns this directly until a real DB is wired.

import type { OperationsData } from "./types";

export const OPERATIONS_SEED: OperationsData = {
	config: {
		academyName: "Skorost United Football Academy",
		upiId: "skorost@ybl",
		payeeName: "Skorost United Football Academy",
		staffPin: "1234",
	},
	centers: [
		{
			id: "0f8c2b14-6d3a-4f21-9c7e-1a5b8d0e3f42",
			name: "Ghatkopar East",
			address: "12 MG Road, Ghatkopar East, Mumbai 400077",
			coaches: [
				{
					id: "3a1e7c90-52b4-4d68-8f13-6c9a2e5b7d04",
					name: "Harsh Patil",
					phone: "9876543210",
				},
			],
			batches: [
				{
					id: "7d4b1a62-9c05-4e37-a1f8-2b6e0d3c5849",
					name: "Evening Batch",
					schedule: [
						{ day: 1, startTime: "18:00", endTime: "19:00" },
						{ day: 3, startTime: "19:00", endTime: "20:00" },
						{ day: 5, startTime: "18:30", endTime: "19:30" },
					],
					plans: [
						{
							id: "east-evening-1m-3d",
							name: "1 Month - 3 Days",
							durationMonths: 1,
							daysPerWeek: 3,
							price: 3400,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-3m-3d",
								name: "3 Months - 3 Days",
								durationMonths: 3,
								daysPerWeek: 3,
								price: 9000,
								perSessionPrice: 285,
							},
						{
							id: "east-evening-6m-3d",
								name: "6 Months - 3 Days",
								durationMonths: 6,
								daysPerWeek: 3,
								price: 18000,
								perSessionPrice: 285,
							},
						{
							id: "east-evening-12m-3d",
								name: "12 Months - 3 Days",
								durationMonths: 12,
								daysPerWeek: 3,
								price: 35500,
								perSessionPrice: 285,
							},
					],
					registrationOptions: [
						{
							id: "east-evening-registration-package",
							name: "Registration Package",
							price: 1160,
						},
						{
							id: "east-evening-starter-package",
							name: "Starter Package",
							price: 2150,
						},
						{
							id: "east-evening-player-package",
							name: "Player Package",
							price: 3560,
						},
					],
				},
			],
		},
	],
};
