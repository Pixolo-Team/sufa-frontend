"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./footer.module.scss";

// COMPONENTS //
import Link from "next/link";

// SVG's //
import SkorostSchoolLogo from "@/../public/images/skorost-school.svg";
import PixoloLogo from "@/../public/images/pixolo-logo.svg";
import ZizoLogo from "@/../public/images/zizo-logo.svg";

/** Footer Screen */
const Footer: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<footer className={`${styles.footerWrap} bg-primary-deep`}>
			<div className="container">
				<div
					className={`${styles.footerContentWrapper} flex flex-column align-center`}
				>
					<div
						className={`${styles.footerTopWrap} flex align-center justify-between flex-wrap`}
					>
						{/* Logo */}
						<SkorostSchoolLogo />
					</div>
					<div className={`${styles.partnersSection}`}>
						<p className={`${styles.partnersTitle} font-weight-500`}>
							We wouldn’t exist if it wasn’t for the constant support from our partners
						</p>
						<div className="flex justify-between">
							{/* Pixolo logo */}
							<PixoloLogo />
							{/* Zizo logo */}
							<ZizoLogo />
						</div>
					</div>
					<div className={styles.fansSection}>
						<p className={`${styles.fansTitle} font-weight-700`}>
							Begin Y<span className={styles.highlightedText}>our</span> Journey
						</p>
					</div>
				</div>
				<div
					className={`${styles.footerBottomSection}  flex justify-between text-center`}
				>
					<p>© Skorost United</p>
					<Link href="/">
						<p>Privacy Policy</p>
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
