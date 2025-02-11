"use client";
// REACT //
import React from "react";

// COMPONENTS //
import SectionHeader from "@/components/section-header/SectionHeader";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className={"flex align-center justify-center"}>
			{/* Section Header Component */}
			<SectionHeader fadedText="Champs" highlightedText="Meet Our Graduates" />
		</div>
	);
};
export default HomeScreen;
