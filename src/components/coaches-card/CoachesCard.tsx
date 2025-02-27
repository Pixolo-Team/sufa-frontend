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
	};
	alt?: string;
}

/** Coaches Card Screen */
const CoachesCard: React.FC<CoachesCardProps> = ({
	firstName = "",
	lastName = "",
	description = "",
	designation = "",
	coachImageSrc = "",
	socialMedia = {},
	alt = "",
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={styles.cardWrapper}>
			<div className={`${styles.contentWrapper} flex flex-column align-start`}>
				{/* Card title */}
				<div className={styles.titleWrapper}>
					{/* Coach First name */}
					<p className={`${styles.firstName} font-secondary font-weight-600`}>
						{firstName}
					</p>
					{/* Coach Last name */}
					<p className={`${styles.lastName} font-secondary font-weight-800`}>
						{lastName}
					</p>
				</div>
				<div className={`${styles.imageDesignationWrapper} `}>
					{/* Image */}
					<div className={styles.imageWrapper}>
						<Image
							src={coachImageSrc}
							alt={alt}
							width={250}
							height={250}
							className="img-responsive full-width-img"
						/>
					</div>
					{/* Button with Social Media Icons or Arrow */}
					{socialMedia?.instagram && (
						<button
							className={`${styles.linkButton} flex align-center justify-center`}
						>
							<a
								className="flex"
								href={socialMedia.instagram}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon className={styles.buttonIcon} iconName="instagram" />
							</a>
						</button>
					)}
					<div className={`${styles.chipWrapper} font-secondary font-weight-700`}>
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
					<p className={`${styles.description} font-secondary font-weight-500`}>
						{description}
					</p>
				</div>
			</div>
		</div>
	);
};

export default CoachesCard;
