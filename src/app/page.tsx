"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "@/app/page.module.scss";

// COMPONENTS //
import SectionHeader from "@/components/section-header/SectionHeader";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className={styles.homeContainer}>
			{/* Section Header Component */}
			<SectionHeader fadedText="CHAMPS" highlightedText="Meet Our Graduates" />
		</div>
	);
};
export default HomeScreen;
