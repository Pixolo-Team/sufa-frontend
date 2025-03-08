"use client";
// REACT //
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

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
	const sectionHeaderRef = useRef(null);

	// Helper Functions
	// Track the vertical scroll progress relative to the referenced section
	const { scrollYProgress } = useScroll({
		target: sectionHeaderRef,
		offset: ["start end", "end start"],
	});
	// Apply a scaling effect to the section header based on scroll progress
	const sectionHeaderStyles = useTransform(
		scrollYProgress,
		[0, 0.5, 1],
		[2, 1.2, 1]
	);

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
			<div ref={sectionHeaderRef}>
				{/* Faded text */}
				{!!fadedText && (
					<motion.h2
						className={`${styles.fadedText} font-weight-800`}
						style={{ scale: sectionHeaderStyles }}
					>
						{fadedText}
					</motion.h2>
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
