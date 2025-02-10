"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./courses-card.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface CoursesCardProps {
	src: string;
	courseTitle: string;
	onClick: () => void;
}

/** Courses Card Component */
const CoursesCard: React.FC<CoursesCardProps> = ({
	src = "",
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
		<div
			className={styles.contentWrapper}
			style={{ backgroundImage: `url(${src})` }}
		>
			<div className={styles.textWrapper}>
				{/* Card title */}
				<p className={styles.cardText}>{courseTitle}</p>
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
