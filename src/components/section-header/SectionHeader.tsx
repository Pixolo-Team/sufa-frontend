"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./section-header.module.scss";

interface SectionHeaderProps {
	fadedText: string;
	highlightedText: string;
}

/** Section Header Component */
const SectionHeader: React.FC<SectionHeaderProps> = ({
	fadedText = "",
	highlightedText = "",
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={"container text-center"}>
			{/* Faded text */}
			<p className={styles.fadedText}>{fadedText}</p>
			{/* Highlighted text */}
			<p className={styles.highlightedText}>{highlightedText}</p>
		</div>
	);
};

export default SectionHeader;
