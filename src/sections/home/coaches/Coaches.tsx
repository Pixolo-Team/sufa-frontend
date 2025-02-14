"use client";
// REACT //
import React from "react";

// COMPONENTS //
import CoachesCard from "@/components/coaches-card/CoachesCard";

/** Coaches Screen */
const Coaches: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className="container">
			<div>Hello Coaches</div>
			<div style={{ width: "300px" }}>
				<CoachesCard
					firstName={"Adarsh"}
					lastName={"Anchan"}
					description={
						"Pandit is our Head Coach, he is very experienced and good with kids. He has school experience. He is thin. He wears specs."
					}
					designation={"Frontend Engineer - Lead"}
					coachImageSrc={"/images/coach.jpg"}
					socialMedia={{ instagram: "jka" }}
				/>
			</div>
		</div>
	);
};

export default Coaches;
