"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./header.module.scss";

// COMPONENTS //
import Hamburger from "@/components/hamburger/Hamburger";
import Link from "next/link";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";

// Header items
const headerListItems: string[] = ["Courses", "Contact Us"];

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
				<div className={`${styles.headerMain} flex justify-between align-center`}>
					{/* Header logo */}
					<Link href="/">
						<SkorostLogo className={styles.headerLogo} />
					</Link>

					{/* Links */}
					<nav className={`${styles.pageLinkWrap} font-weight-500 justify-end`}>
						{headerListItems.map((link, linkIndex) => (
							<a href="/" key={linkIndex} className={styles.pageLink}>
								{link}
							</a>
						))}
					</nav>

					{/* Hamburger Menu */}
					<Hamburger
						onClick={() => setDropdownVisible((prev) => !prev)}
						isDropdownVisible={isDropdownVisible}
					/>
				</div>
				{/* Menu Dropdown */}
				<div
					className={`font-weight-500 ${styles.headerDropdown} ${
						isDropdownVisible ? styles.showDropdown : ""
					}`}
				>
					{headerListItems.map((link, linkIndex) => (
						<a href="/" key={linkIndex} className={styles.pageLink}>
							{link}
						</a>
					))}
				</div>
			</div>
		</header>
	);
};

export default Header;
