"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./header.module.scss";

// OTHERS //
import Hamburger from "../hamburger/Hamburger";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";

// Header items
const headerTitlesList: string[] = ["Courses", "Contact Us"];

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
		<header>
			<div className={styles.headerWrap}>
				<div className="flex justify-between align-center">
					{/* Header logo */}
					<SkorostLogo />

					{/* Titles */}
					<div className={`${styles.titleWrapper} font-weight-500 justify-end`}>
						{headerTitlesList.map((title, titleIndex) => (
							<p key={titleIndex} className={styles.title}>
								{title}
							</p>
						))}
					</div>

					{/* Hamburger Menu */}
					<Hamburger
						onClick={() => setDropdownVisible((prev) => !prev)}
						isDropdownVisible={isDropdownVisible}
					/>
				</div>
				{/* Menu Dropdown */}
				<div
					className={`font-weight-500  ${
						isDropdownVisible ? styles.showDropdown : styles.hideDropdown
					}`}
				>
					{headerTitlesList.map((title, index) => (
						<p key={index} className={styles.title}>
							{title}
						</p>
					))}
				</div>
			</div>
		</header>
	);
};

export default Header;
