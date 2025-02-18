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
				isDropdownVisible ? styles.active : ""
			}`}
			onClick={onClick}
		>
			<div className={styles.line}></div>
			<div className={styles.line}></div>
		</div>
	);
};

export default Hamburger;
