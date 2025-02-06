"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./side-menu-logo.module.scss";

// COMPONENTS //
import Image from "next/image";

// CONSTANTS //
import { CONSTANTS } from "@/infrastructure/constants";

// IMAGES //
import BrandLogoImg from "@/../public/images/brand/only-logo.png";

interface SideMenuLogoProps {
	isSideMenuCollapsed: boolean;
	isSideMenuHovered: boolean;
}

// Define Variables

/** Side Menu Logo Component */
const SideMenuLogo: React.FC<SideMenuLogoProps> = ({
	isSideMenuCollapsed = false,
	isSideMenuHovered = false,
}) => {
	// Define Contexts

	// Define States

	// Helper Functions

	// Use Effect

	return (
		<div
			className={`${styles.logoWrapper} ${
				isSideMenuCollapsed && styles.collapsed
			} ${isSideMenuHovered && styles.hovered}`}
		>
			{/* Brand Logo */}
			<div className={styles.logoContainer}>
				<Image
					className={styles.logoImage}
					src={BrandLogoImg}
					alt={`${CONSTANTS.COMPANY_NAME}`}
				/>
			</div>
			{/* Brand/Company Name */}
			<p className={styles.brandLogoText}>{CONSTANTS.COMPANY_NAME}</p>
		</div>
	);
};

export default SideMenuLogo;
