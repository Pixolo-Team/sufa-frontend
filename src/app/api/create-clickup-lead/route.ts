// COMPONENTS //
import { NextResponse } from "next/server";

/** Create ClickUp Lead API Route */
export async function POST(req: Request) {
	try {
		// Get the body from the request
		const body = await req.json();

		// Destructure the body
		const { name, age, phone, current_school, locality } = body;

		// Get the current date
		const today = new Date();
		const startDate = today.getTime();

		// Make API Call
		const response = await fetch(
			"https://api.clickup.com/api/v2/list/901612403369/task",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: process.env.CLICKUP_API_TOKEN as string,
				},
				body: JSON.stringify({
					name: `${name} : ${phone}`,
					status: "NEW LEAD (UNCONTACTED)",
					start_date: startDate,
					tags: [{ name: "website" }, { name: `${age} yrs` }],
					description: `
					Player Name: ${name}
					School: ${current_school || "-"}
					Address: ${locality || "-"}
					Age: ${age}
					Phone: ${phone}
          			`,
				}),
			}
		);

		// If not OK then return error
		if (!response.ok) {
			const error = await response.text();
			return NextResponse.json({ success: false, error }, { status: 500 });
		}

		// Return success
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
