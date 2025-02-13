"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./courses-card.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";

interface CoursesCardProps {
	courseImageSrc: string;
	courseTitle: string;
	onClick: () => void;
}

/** Courses Card Component */
const CoursesCard: React.FC<CoursesCardProps> = ({
	courseImageSrc = "",
	courseTitle = "",
	onClick,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		// Course card and Image
		<div className={styles.contentWrapper}>
			{/* Course Image */}
			<div className={styles.imageContainer}>
				<Image
					src={courseImageSrc}
					alt={courseTitle}
					className={styles.courseImage}
					fill
				/>
			</div>
			<div className={styles.textWrapper}>
				{/* Card title */}
				{courseTitle.trim() !== "" && (
					<p className={`${styles.cardText} font-weight-600`}>{courseTitle}</p>
				)}
			</div>
			{/* Icon Button */}
			<button
				className={`${styles.linkButton} flex align-center justify-center`}
				onClick={onClick}
			>
				{/* Icon */}
				<Icon className={styles.buttonIcon} iconName={"arrow"} />
			</button>
		</div>
	);
};

export default CoursesCard;
