// REACT //
import React, { useEffect, useState } from "react";

// STYLES //
import styles from "./sticky-social.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";

/** Sticky Social Component */
const StickySocial: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States
	const [isStickySocialVisible, setIsStickySocialVisible] = useState(false);

	// Define Refs

	// Helper Functions
	/** Function to check scroll position */
	const checkScrollPosition = () => {
		setIsStickySocialVisible(window.scrollY > window.innerHeight);
	};

	// UseEffect Functions and UseFocusEffect Functions
	useEffect(() => {
		// Attach event listener
		window.addEventListener("scroll", checkScrollPosition);
		// Run once on mount to check initial scroll position
		checkScrollPosition();
		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("scroll", checkScrollPosition);
		};
	}, []);

	// View starts here
	return (
		<div>
			<div
				className={`${styles.stickySocialWrap} ${
					isStickySocialVisible ? styles.show : ""
				} flex align-center`}
			>
				<div className={`${styles.socialIconsWrapper} flex align-center`}>
					{/* Instagram */}
					<a
						href="https://www.instagram.com/skorostunitedfootballacademy/"
						target="_blank"
						rel="noreferrer"
					>
						<Icon iconName="instagram" className={styles.icon} />
					</a>
					<div className={styles.line}></div>
					{/* Info */}
					<a href="/" target="_blank" rel="noreferrer">
						<Icon iconName="info" className={styles.icon} />
					</a>
				</div>
				<SkorostLogo />
				<div className={`${styles.socialIconsWrapper} flex align-center`}>
					{/* Phone */}
					<a href="tel: 9004453226" target="_self" rel="noreferrer">
						<Icon iconName="phone" className={styles.icon} />
					</a>
					<div className={styles.line}></div>
					{/* Whatsapp */}
					<a
						href="https://wa.me/919004453226?text=Hi! I would like to know more about your academy."
						target="_blank"
						rel="noreferrer"
					>
						<Icon iconName="whatsapp" className={styles.icon} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default StickySocial;
