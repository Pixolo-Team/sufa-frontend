"use client";
// REACT //
import React, { useState } from "react";

// TYPES //
import { HeaderListData } from "@/types/header";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./header.module.scss";

// COMPONENTS //
import Hamburger from "@/components/hamburger/Hamburger";
import Link from "next/link";
import Button from "@/neevo/components/button/Button";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";

// Header items
const headerListItems: HeaderListData[] = [
	{ label: "Courses", id: "courses" },
	{ label: "Contact Us", id: "contact" },
];

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
						<Button
							text="Book a Free Trial"
							onClick={() => console.log()}
							shape={Shapes.ROUNDED}
							color={Colors.SECONDARY}
							size={ButtonSizes.SMALL}
							level={ButtonLevels.INLINE}
						/>
						{/* {headerListItems.map((link, linkIndex) => (
							<a href="/" key={linkIndex} className={styles.pageLink}>
								{link}
							</a>
						))} */}
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
					<Button
						text="Book a Free Trial"
						onClick={() => console.log()}
						shape={Shapes.ROUNDED}
						color={Colors.SECONDARY}
						size={ButtonSizes.SMALL}
						level={ButtonLevels.INLINE}
					/>
					{/* {headerListItems.map((link, linkIndex) => (
						<a href="/" key={linkIndex} className={styles.pageLink}>
							{link}
						</a>
					))} */}
				</div>
			</div>
		</header>
	);
};

export default Header;
