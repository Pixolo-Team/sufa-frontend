"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./footer.module.scss";

// COMPONENTS //
import Link from "next/link";
import Image from "next/image";

// IMAGES //
import HomeKit from "@/../public/images/25-26-home-kit-mockup.png";
import AwayKit from "@/../public/images/25-26-away-kit-mockup.png";

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
					className={`${styles.footerContentWrapper} flex flex-row align-center flex-wrap justify-between`}
				>
					<div
						className={`${styles.footerTopWrap} flex align-center justify-between flex-wrap`}
					>
						{/* Logo */}
						<SkorostSchoolLogo />
					</div>
					<div className={`${styles.partnersSection}`}>
						<p className={`${styles.partnersTitle} font-weight-500 hide-on-desktop`}>
							We wouldn’t exist if it wasn’t for the constant support from our partners
						</p>
						<div className={`${styles.partners} flex justify-between`}>
							{/* Pixolo logo */}
							<PixoloLogo />
							{/* Zizo logo */}
							<ZizoLogo />
						</div>
					</div>
				</div>
				<div className={`${styles.fansSection} `}>
					<div
						className={`${styles.kitsWrapper} hide-on-mobile flex justify-center`}
					>
						{/* Home Kit */}
						<Image src={HomeKit} alt="Home kit" className="img-responsive" />
						{/* Away Kit */}
						<Image src={AwayKit} alt="Away kit" className="img-responsive full" />
					</div>
					<p className={`${styles.fansTitle} font-tertiary font-weight-700`}>
						Begin Y<span className={styles.highlightedText}>our</span> Journey
					</p>
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
