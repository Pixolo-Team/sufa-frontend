"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./faq.module.scss";

// COMPONENTS //
import Accordian from "@/components/accordian/Accordian";
import SectionHeader from "@/components/section-header/SectionHeader";

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
		<section className="section-spacing container">
			{/* Section Header */}
			<SectionHeader
				fadedText="Faq`s"
				highlightedText="All the A’s to your Q’s"
				image={"/images/squirrel.png"}
			/>
			{/* Accordian Items */}
			<div className={styles.content}>
				{[1, 2, 3, 4].map((item, index) => (
					<div key={index} className={styles.accordianItem}>
						<Accordian
							title={`What age groups do you accept? ${item}`}
							description={`
					We accept students from ages 5-18. We have different programs for different age groups.
					 ${item}`}
							isOpen={activeIndex === index}
							onToggle={() => handleToggle(index)}
						/>
					</div>
				))}
			</div>
		</section>
	);
};

export default Faq;
