"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes, Sizes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "./coaches-card.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";
import Chip from "@/neevo/components/chip/Chip";

interface CoachesCardProps {
	first_name: string;
	last_name: string;
	description: string;
	designation: string;
	src: string;
}

/** Coaches Card Screen */
const CoachesCard: React.FC<CoachesCardProps> = ({
	first_name = "",
	last_name = "",
	description = "",
	designation = "",
	src = "",
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={styles.contentWrapper}>
			{/* Card title */}
			<div className={styles.titleWrapper}>
				{/* Coach First name */}
				<p className={styles.firstName}>{first_name}</p>
				{/* Coach Last name */}
				<p className={styles.lastName}>{last_name}</p>
			</div>
			<div className={styles.imageDescriptionWrapper}>
				{/* Image */}
				<div className={styles.imageWrapper}>
					<Image src={src} alt="img" width={280} height={280} />
				</div>
				{/* Description */}
				<p className={styles.description}>{description}</p>
			</div>
			<button className={`${styles.linkButton} flex align-center justify-center`}>
				{/* Icon */}
				{/* TODO: Add Social media icon */}
				<Icon className={styles.buttonIcon} iconName={"arrow"} />
			</button>
			<div className={styles.chipWrapper}>
				{/* Designation */}
				<Chip
					text={designation}
					color={Colors.PRIMARY}
					shape={Shapes.ROUNDED}
					size={Sizes.LARGE}
				/>
			</div>
		</div>
	);
};

export default CoachesCard;
