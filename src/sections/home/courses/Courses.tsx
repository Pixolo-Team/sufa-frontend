"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./courses.module.scss";

// COMPONENTS //
import CoursesCard from "@/components/courses-card/CoursesCard";
import SectionHeader from "@/components/section-header/SectionHeader";

/** Courses Screen */
const Courses: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions`

	// View starts here
	return (
		<div>
			{/* Section header component */}
			<SectionHeader fadedText="Champions" highlightedText="Courses" />
			<p className={`${styles.sectionDescription} font-weight-500 text-center`}>
				Designed for Excellence!
			</p>
			{/* Courses card components */}
			<div className={`${styles.cardsWrapper} container flex flex-column`}>
				<CoursesCard
					courseImageSrc="/images/keeper.jpg"
					courseTitle="Goalkeeper Development"
					onClick={() => console.log("Goalkeeper Development")}
				/>
				<CoursesCard
					courseImageSrc="/images/keeper.jpg"
					courseTitle="Goalkeeper Development"
					onClick={() => console.log("Goalkeeper Development")}
				/>
				<CoursesCard
					courseImageSrc="/images/keeper.jpg"
					courseTitle="Goalkeeper Development"
					onClick={() => console.log("Goalkeeper Development")}
				/>
			</div>
		</div>
	);
};

export default Courses;
