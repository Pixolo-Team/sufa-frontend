"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./section-header.module.scss";

// COMPONENTS //
import Image from "next/image";

interface SectionHeaderProps {
	fadedText?: string;
	highlightedText: string;
	image?: string;
}

/** Section Header Component */
const SectionHeader: React.FC<SectionHeaderProps> = ({
	fadedText = "",
	highlightedText = "",
	image,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div
			className={`text-center flex align-center justify-center ${styles.wrapper}`}
		>
			{/* Image */}
			{!!image && (
				<Image
					src={image}
					alt="Section Header Image"
					className={styles.image}
					width={100}
					height={100}
				/>
			)}
			<div>
				{/* Faded text */}
				{!!fadedText && (
					<p className={`${styles.fadedText} font-weight-800`}>{fadedText}</p>
				)}
				{/* Highlighted text */}
				<p className={`${styles.highlightedText} font-weight-700`}>
					{highlightedText}
				</p>
			</div>
		</div>
	);
};

export default SectionHeader;
