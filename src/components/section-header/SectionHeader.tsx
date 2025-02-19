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
	leftImage?: string;
}

/** Section Header Component */
const SectionHeader: React.FC<SectionHeaderProps> = ({
	fadedText = "",
	highlightedText = "",
	leftImage,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div
			className={`fade-in-up text-center flex align-center justify-center ${styles.wrapper}`}
		>
			{/* Image */}
			{!!leftImage && (
				<div className={styles.leftImageWrapper}>
					<Image
						src={leftImage}
						alt="Section Header Image"
						className={`${styles.image} img-responsive full-width-img`}
						width={100}
						height={100}
					/>
				</div>
			)}
			<div>
				{/* Faded text */}
				{!!fadedText && (
					<h2 className={`${styles.fadedText} font-weight-800`}>{fadedText}</h2>
				)}
				{/* Highlighted text */}
				<h3 className={`${styles.highlightedText} font-weight-700`}>
					{highlightedText}
				</h3>
			</div>
		</div>
	);
};

export default SectionHeader;
