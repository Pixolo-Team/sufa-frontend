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
	firstName: string;
	lastName: string;
	description: string;
	designation: string;
	coachImageSrc: string;
	socialMedia?: {
		instagram?: string;
		facebook?: string;
	};
}

/** Coaches Card Screen */
const CoachesCard: React.FC<CoachesCardProps> = ({
	firstName = "",
	lastName = "",
	description = "",
	designation = "",
	coachImageSrc = "",
	socialMedia,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={`${styles.contentWrapper}`}>
			{/* Card title */}
			<div className={styles.titleWrapper}>
				{/* Coach First name */}
				<p className={styles.firstName}>{firstName}</p>
				{/* Coach Last name */}
				<p className={styles.lastName}>{lastName}</p>
			</div>
			<div className={`${styles.imageDesignationWrapper} `}>
				{/* Image */}
				<div className={styles.imageWrapper}>
					<Image src={coachImageSrc} alt={firstName} width={280} height={280} />
				</div>
				{/* Button with Social Media Icons or Arrow */}
				<button className={`${styles.linkButton} flex align-center justify-center`}>
					{socialMedia?.instagram ? (
						<a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer">
							<Icon className={styles.buttonIcon} iconName="instagram" />
						</a>
					) : socialMedia?.facebook ? (
						<a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer">
							<Icon className={styles.buttonIcon} iconName="facebook" />
						</a>
					) : (
						<Icon className={styles.buttonIcon} iconName="arrow" />
					)}
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
			<div className={"flex justify-center"}>
				{/* Description */}
				<p className={styles.description}>{description}</p>
			</div>
		</div>
	);
};

export default CoachesCard;
