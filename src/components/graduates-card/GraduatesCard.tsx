"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./graduates-card.module.scss";

// COMPONENTS //
import Image from "next/image";

interface GraduatesCardProps {
	src: string;
	coach_name: string;
	description: string;
}

/** Graduates Card Screen */
const GraduatesCard: React.FC<GraduatesCardProps> = ({
	src = "",
	coach_name = "",
	description = "",
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		// Card Component
		<div className={styles.cardWrapper}>
			<div className={styles.imageWrapper}>
				{/* Image */}
				<Image src={src} alt="img" width={260} height={360} />
			</div>
			<div className={styles.textWrapper}>
				{/* Coach name */}
				<p className={styles.title}>{coach_name}</p>
				{/* Description */}
				<p className={styles.description}>{description}</p>
			</div>
		</div>
	);
};

export default GraduatesCard;
