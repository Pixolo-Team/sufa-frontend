"use client";
// REACT //
import React from "react";

// COMPONENTS //
import GraduatesCard from "@/components/graduates-card/GraduatesCard";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className="flex align-center justify-center">
			<GraduatesCard
				src="/images/pandit.png"
				coach_name="Mervin Kurisingal"
				description="Graduated in 2003 and played in the India League for DK Pharma"
			/>
		</div>
	);
};
export default HomeScreen;
