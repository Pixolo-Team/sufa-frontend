"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./courses-card.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";
import Tilty from "react-tilty";

interface CoursesCardProps {
	wrapperClass?: string;
	courseImageSrc: string;
	courseTitle: string;
	onClick: () => void;
}

/** Courses Card Component */
const CoursesCard: React.FC<CoursesCardProps> = ({
	wrapperClass = "",
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
		<Tilty
			className={`${styles.contentWrapper} ${wrapperClass}`}
			glare={true}
			maxGlare={0.5}
			style={{
				boxShadow: "0 3px 47px rgba(0, 0, 0, 0.2)",
			}}
			scale={1.05}
		>
			<div>
				{/* Course Image */}
				<div className={styles.imageContainer}>
					<Image
						src={courseImageSrc}
						alt={courseTitle}
						className={`${styles.courseImage} img-responsive`}
						width={640}
						height={360}
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
					<Icon
						className={styles.buttonIcon}
						iconName={"link-arrow"}
						mode="filled"
					/>
				</button>
			</div>
		</Tilty>
	);
};

export default CoursesCard;
