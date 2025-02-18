"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./hamburger.module.scss";

interface HamburgerProps {
	onClick: () => void;
	isDropdownVisible: boolean;
}
/** Hamburger Component */
const Hamburger: React.FC<HamburgerProps> = ({
	onClick,
	isDropdownVisible = false,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		// Hamburger menu component
		<div
			className={`${styles.hamburgerWrapper} ${
				isDropdownVisible ? styles.showDropdown : ""
			}`}
			onClick={onClick}
		>
			{/* Hamburger line items */}
			<div className={styles.line} />
			<div className={styles.line} />
		</div>
	);
};

export default Hamburger;
