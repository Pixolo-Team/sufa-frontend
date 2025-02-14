"use client";
// REACT //
import React, { useState } from "react";

// COMPONENTS //
import Accordian from "@/components/accordian/Accordian";

/** Faq Screen */
const Faq: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	// Define Refs

	// Helper Functions
	/** Function to handle toggle */
	const handleToggle = (index: number) => {
		setActiveIndex((prev) => (prev === index ? null : index));
	};

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<>
			{[1, 2, 3, 4].map((item, index) => (
				<Accordian
					key={index}
					title={`What age groups do you accept? ${item}`}
					description={`
					We accept students from ages 5-18. We have different programs for different age groups.
					 ${item}`}
					isOpen={activeIndex === index}
					onToggle={() => handleToggle(index)}
				/>
			))}
		</>
	);
};

export default Faq;
