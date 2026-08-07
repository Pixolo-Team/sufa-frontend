// TYPES //
import type { OperationsData } from "@/types/operations";

/**
 * 🔴 DUMMY DATA - REPLACE BEFORE PRODUCTION.
 *
 * Mirrors `GET /operations/centers` exactly as specified in PROPOSAL.md §7, so
 * the page can swap to the live endpoint without any UI change:
 * UUID ids, coaches and batches on the center, and both prices on the plan.
 *
 * Confirmed: **two centers**, each selling a **1-month** and a **3-month** plan,
 * at 3-day and 2-day attendance.
 *
 * Still owed by the stakeholder (PROPOSAL.md §9): real prices, addresses,
 * coaches, batch timings and days, the global UPI ID / payee, and the staff PIN.
 */
export const OPERATIONS_DATA: OperationsData = {
	config: {
		academyName: "Skorost United Football Academy",
		// 🔴 DUMMY
		upiId: "skorost@ybl",
		// 🔴 DUMMY
		payeeName: "Skorost United Football Academy",
		// 🔴 DUMMY - light obfuscation only, this ships in the JS bundle
		staffPin: "1234",
	},
	centers: [
		{
			id: "0f8c2b14-6d3a-4f21-9c7e-1a5b8d0e3f42",
			name: "Ghatkopar East",
			// 🔴 DUMMY
			address: "12 MG Road, Ghatkopar East, Mumbai 400077",
			coaches: [
				// 🔴 DUMMY
				{
					id: "3a1e7c90-52b4-4d68-8f13-6c9a2e5b7d04",
					name: "Harsh Patil",
					phone: "9876543210",
				},
				{
					id: "5c2f9d31-7e46-4a83-b025-8d1c4f6a9e37",
					name: "Rohan Shetty",
					phone: "9876500011",
				},
			],
			batches: [
				// 🔴 DUMMY - days are per batch, not fixed to Mon/Wed/Fri
				{
					id: "7d4b1a62-9c05-4e37-a1f8-2b6e0d3c5849",
					name: "Evening",
					startTime: "17:00",
					endTime: "18:30",
					days: [1, 3, 5],
				},
			],
			plans: [
				{
					id: "1b3d5f70-8a92-4c14-9e26-0d7b3f5a8c61",
					name: "1 Month · 3 Days",
					durationMonths: 1,
					daysPerWeek: 3,
					price: 3400,
					perSessionPrice: 285,
				},
				{
					id: "2c4e6a81-9b03-4d25-8f37-1e8c4a6b9d72",
					name: "1 Month · 2 Days",
					durationMonths: 1,
					daysPerWeek: 2,
					price: 2280,
					perSessionPrice: 285,
				},
				{
					id: "3d5f7b92-0c14-4e36-9a48-2f9d5b7c0e83",
					name: "3 Months · 3 Days",
					durationMonths: 3,
					daysPerWeek: 3,
					price: 9600,
					perSessionPrice: 285,
				},
				{
					id: "4e6a8c03-1d25-4f47-8b59-3a0e6c8d1f94",
					name: "3 Months · 2 Days",
					durationMonths: 3,
					daysPerWeek: 2,
					price: 6500,
					perSessionPrice: 285,
				},
			],
		},
		{
			id: "6b9d4e27-3f81-4a05-9c62-7e1d8b0a4f36",
			name: "Ghatkopar West",
			// 🔴 DUMMY
			address: "45 LBS Marg, Ghatkopar West, Mumbai 400086",
			coaches: [
				// 🔴 DUMMY
				{
					id: "8f0b6d43-5a29-4c17-b83e-9d2f4a6c1e58",
					name: "Amit Nair",
					phone: "9876522233",
				},
			],
			batches: [
				// 🔴 DUMMY
				{
					id: "0a2c8e65-7b41-4d39-9f05-1b3d7e9a2c46",
					name: "Evening",
					startTime: "18:00",
					endTime: "19:30",
					days: [1, 3, 5],
				},
			],
			plans: [
				{
					id: "5f7b9d14-2e36-4a58-9c60-4b1f7d9e2a05",
					name: "1 Month · 3 Days",
					durationMonths: 1,
					daysPerWeek: 3,
					price: 3600,
					perSessionPrice: 300,
				},
				{
					id: "6a8c0e25-3f47-4b69-8d71-5c2a8e0f3b16",
					name: "1 Month · 2 Days",
					durationMonths: 1,
					daysPerWeek: 2,
					price: 2400,
					perSessionPrice: 300,
				},
				{
					id: "7b9d1f36-4a58-4c70-9e82-6d3b9f1a4c27",
					name: "3 Months · 3 Days",
					durationMonths: 3,
					daysPerWeek: 3,
					price: 10200,
					perSessionPrice: 300,
				},
				{
					id: "8c0e2a47-5b69-4d81-8f93-7e4c0a2b5d38",
					name: "3 Months · 2 Days",
					durationMonths: 3,
					daysPerWeek: 2,
					price: 6900,
					perSessionPrice: 300,
				},
			],
		},
	],
};
