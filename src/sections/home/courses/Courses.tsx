"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./courses.module.scss";

// COMPONENTS //
import CoursesCard from "@/components/courses-card/CoursesCard";
import SectionHeader from "@/components/section-header/SectionHeader";

// IMAGES //
import gdpImage from "@/../public/images/courses/gdp.jpg";
import u11Image from "@/../public/images/courses/u-11.jpg";
import u15Image from "@/../public/images/courses/u-15.jpg";

/** Courses Screen */
const Courses: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions`

	// View starts here
	return (
		<section className="section-spacing">
			<div className="container">
				{/* Section header component */}
				<SectionHeader fadedText="Champions" highlightedText="Courses" />
				<p className={`${styles.sectionDescription} text-center font-weight-500`}>
					Designed for Excellence!
				</p>
				{/* Courses card components */}
				<div className={`${styles.cardsWrapper} flex flex-column`}>
					<CoursesCard
						wrapperClass={styles.cardItem}
						courseImageSrc={gdpImage.src}
						courseTitle="Goalkeeper Development"
						onClick={() => console.log("Goalkeeper Development")}
					/>
					<CoursesCard
						wrapperClass={styles.cardItem}
						courseImageSrc={u11Image.src}
						courseTitle="Under-11 Boys"
						onClick={() => console.log("Under-11 Boys")}
					/>
					<CoursesCard
						wrapperClass={styles.cardItem}
						courseImageSrc={u15Image.src}
						courseTitle="Under-15 Boys"
						onClick={() => console.log("Under-15 Boys")}
					/>
				</div>
			</div>
		</section>
	);
};

export default Courses;
