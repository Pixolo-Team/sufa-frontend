// REACT //
import React from "react";

// STYLES //
import styles from "./sticky-social.module.scss";

// SVG's //
import SkorostLogo from "@/../public/images/skorost.svg";
import InstagramIcon from "@/../public/icons/outline/insta.svg";
import InfoIcon from "@/../public/icons/outline/info.svg";
import PhoneIcon from "@/../public/icons/outline/phone.svg";
import WhatsappIcon from "@/../public/icons/outline/whats-app.svg";

/** Sticky Social Component */
const StickySocial: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div>
			<div className={`${styles.stickySocialWrap} flex align-center`}>
				<div className={`${styles.socialIconsWrapper} flex align-center`}>
					{/* Instagram */}
					<a
						href="https://www.instagram.com/skorostunitedfootballacademy/"
						target="_blank"
						rel="noreferrer"
					>
						<InstagramIcon style={{ color: "white" }} />
					</a>
					<div className={styles.line}></div>
					{/* Info */}
					<a href="/" target="_blank" rel="noreferrer">
						<InfoIcon style={{ color: "white" }} />
					</a>
				</div>
				<SkorostLogo />
				<div className={`${styles.socialIconsWrapper} flex align-center`}>
					{/* Phone */}
					<a href="tel: 9004453226" target="_blank" rel="noreferrer">
						<PhoneIcon style={{ color: "white" }} />
					</a>
					<div className={styles.line}></div>
					{/* Whatsapp */}
					<a
						href="https://wa.me/919004453226?text=Hi! I would like to know more about your academy."
						target="_blank"
						rel="noreferrer"
					>
						<WhatsappIcon style={{ color: "white" }} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default StickySocial;
