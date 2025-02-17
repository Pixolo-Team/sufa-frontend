"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./header.module.scss";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";
import HamburgerIcon from "@/../public/icons/hamburger.svg";

/** Header Screen */
const Header: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States
	const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<header className={styles.headerWrap}>
			<div className="flex justify-between align-center">
				{/* Header logo */}
				<SkorostLogo />
				{/* Titles */}
				<div className={`${styles.titleWrapper} font-weight-500 justify-end`}>
					<p>Courses</p>
					<p>Contact US</p>
				</div>
				{/* Hamburger Menu */}
				<div
					className={styles.hamburgerMenu}
					onClick={() => setDropdownVisible((prev) => !prev)}
				>
					<HamburgerIcon />
				</div>
			</div>
			{/* Menu Dropdown */}
			{isDropdownVisible && (
				<div
					className={`${styles.dropdownWrapper} font-weight-500 align-start flex-column`}
				>
					<p>Courses</p>
					<p>Contact US</p>
				</div>
			)}
		</header>
	);
};

export default Header;
