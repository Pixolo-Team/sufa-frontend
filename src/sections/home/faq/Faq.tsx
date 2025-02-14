"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./faq.module.scss";

// COMPONENTS //
import Accordian from "@/components/accordian/Accordian";
import SectionHeader from "@/components/section-header/SectionHeader";
import Image from "next/image";

// IMAGES //
import SquirrelImage from "@/../public/images/squirrel.png";

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
			<div className={"flex justify-center items-center"}>
				<Image
					src={SquirrelImage}
					width={100}
					height={100}
					alt="Squirrel"
					className={styles.squirrelImage}
				/>
				<SectionHeader
					fadedText="Faq`s"
					highlightedText="All the A’s to your Q’s"
				/>
			</div>
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
