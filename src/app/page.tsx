"use client";
// REACT //
import React from "react";

// COMPONENTS //
import CoursesCard from "@/components/courses-card/CoursesCard";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className={"flex justify-center align-center"}>
			<CoursesCard
				src="/images/keeper.png"
				courseTitle="Goalkeeper"
				onClick={() => {
					"click";
				}}
			/>
		</div>
	);
};
export default HomeScreen;
