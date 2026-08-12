// TYPES //
import type { OperationsData } from "@/types/operations";

/**
 * DUMMY DATA - REPLACE BEFORE PRODUCTION.
 *
 * Mirrors the shape used by the operations UI: each center owns batches,
 * each batch owns its schedule and plans. Registration options are global -
 * not linked to a batch or center.
 */
export const OPERATIONS_DATA: OperationsData = {
	config: {
		academyName: "Skorost United Football Academy",
		upiId: "skorostunitedfootballschool@kotak",
		payeeName: "Skorost United Football Academy",
		staffPin: "1234",
	},
	registrationOptions: [
		{
			id: "registration-package",
			name: "Registration Package",
			description: "One-time registration fee, includes ID card and academy kit bag.",
			price: 1160,
		},
		{
			id: "starter-package",
			name: "Starter Package",
			description: "Registration plus starter training gear - jersey and socks.",
			price: 2150,
		},
		{
			id: "player-package",
			name: "Player Package",
			description: "Full player kit - jersey, shorts, socks and academy backpack.",
			price: 3560,
		},
	],
	centers: [
		{
			id: "0f8c2b14-6d3a-4f21-9c7e-1a5b8d0e3f42",
			name: "Ghatkopar East",
			address: "12 MG Road, Ghatkopar East, Mumbai 400077",
			batches: [
				{
					id: "7d4b1a62-9c05-4e37-a1f8-2b6e0d3c5849",
					name: "Evening Batch",
					ageGroup: "Under-14",
					schedule: [
						{ day: 1, startTime: "18:00", endTime: "19:00" },
						{ day: 3, startTime: "19:00", endTime: "20:00" },
						{ day: 5, startTime: "18:30", endTime: "19:30" },
					],
					plans: [
						{
							id: "east-evening-1m-3d",
							durationMonths: 1,
							daysPerWeek: 3,
							price: 3400,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-1m-2d",
							durationMonths: 1,
							daysPerWeek: 2,
							price: 2280,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-3m-3d",
							durationMonths: 3,
							daysPerWeek: 3,
							price: 9600,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-3m-2d",
							durationMonths: 3,
							daysPerWeek: 2,
							price: 6400,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-6m-3d",
							durationMonths: 6,
							daysPerWeek: 3,
							price: 18600,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-6m-2d",
							durationMonths: 6,
							daysPerWeek: 2,
							price: 12400,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-12m-3d",
							durationMonths: 12,
							daysPerWeek: 3,
							price: 34800,
							perSessionPrice: 285,
						},
						{
							id: "east-evening-12m-2d",
							durationMonths: 12,
							daysPerWeek: 2,
							price: 23200,
							perSessionPrice: 285,
						},
					],
				},
				{
					id: "1d8e2f73-a4c6-46d9-bf12-8a3e4d5c6b71",
					name: "Morning Batch",
					ageGroup: "Under-10",
					schedule: [
						{ day: 2, startTime: "07:00", endTime: "08:00" },
						{ day: 4, startTime: "07:30", endTime: "08:30" },
						{ day: 6, startTime: "08:00", endTime: "09:00" },
					],
					plans: [
						{
							id: "east-morning-1m-3d",
							durationMonths: 1,
							daysPerWeek: 3,
							price: 3550,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-1m-2d",
							durationMonths: 1,
							daysPerWeek: 2,
							price: 2370,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-3m-3d",
							durationMonths: 3,
							daysPerWeek: 3,
							price: 9950,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-3m-2d",
							durationMonths: 3,
							daysPerWeek: 2,
							price: 6650,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-6m-3d",
							durationMonths: 6,
							daysPerWeek: 3,
							price: 19200,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-6m-2d",
							durationMonths: 6,
							daysPerWeek: 2,
							price: 12800,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-12m-3d",
							durationMonths: 12,
							daysPerWeek: 3,
							price: 36000,
							perSessionPrice: 300,
						},
						{
							id: "east-morning-12m-2d",
							durationMonths: 12,
							daysPerWeek: 2,
							price: 24000,
							perSessionPrice: 300,
						},
					],
				},
			],
		},
		{
			id: "6b9d4e27-3f81-4a05-9c62-7e1d8b0a4f36",
			name: "Ghatkopar West",
			address: "45 LBS Marg, Ghatkopar West, Mumbai 400086",
			batches: [
				{
					id: "0a2c8e65-7b41-4d39-9f05-1b3d7e9a2c46",
					name: "Evening Batch",
					ageGroup: "Under-12",
					schedule: [
						{ day: 1, startTime: "17:30", endTime: "18:30" },
						{ day: 3, startTime: "18:30", endTime: "19:30" },
						{ day: 5, startTime: "17:30", endTime: "18:30" },
					],
					plans: [
						{
							id: "west-evening-1m-3d",
							durationMonths: 1,
							daysPerWeek: 3,
							price: 3600,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-1m-2d",
							durationMonths: 1,
							daysPerWeek: 2,
							price: 2400,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-3m-3d",
							durationMonths: 3,
							daysPerWeek: 3,
							price: 10200,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-3m-2d",
							durationMonths: 3,
							daysPerWeek: 2,
							price: 6800,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-6m-3d",
							durationMonths: 6,
							daysPerWeek: 3,
							price: 19800,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-6m-2d",
							durationMonths: 6,
							daysPerWeek: 2,
							price: 13200,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-12m-3d",
							durationMonths: 12,
							daysPerWeek: 3,
							price: 37200,
							perSessionPrice: 300,
						},
						{
							id: "west-evening-12m-2d",
							durationMonths: 12,
							daysPerWeek: 2,
							price: 24800,
							perSessionPrice: 300,
						},
					],
				},
			],
		},
	],
};
