"use client";
// REACT //
import React from "react";

// COMPONENTS //
import CoachesCard from "@/components/coaches-card/CoachesCard";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className={"flex justify-center align-center"}>
			<CoachesCard
				first_name={"Shubam"}
				last_name={"Pandit"}
				description={
					"Pandit is our Head Coach, he is very experienced and good with kids. He has school experience. He is thin. He wears specs."
				}
				designation={"Head coach"}
				src={"/images/pandit.png"}
			/>
		</div>
	);
};
export default HomeScreen;
