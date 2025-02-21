"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./footer.module.scss";

// SVG's //
import InstagramIcon from "@/../public/icons/outline/instagram.svg";
import FacebookIcon from "@/../public/icons/outline/facebook.svg";
import YoutubeIcon from "@/../public/icons/outline/youtube.svg";

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
					className={`${styles.footerContent}  flex justify-between flex-column`}
				>
					{/* Copyright section */}
					<div className={`${styles.copyrightWrapper}`}>
						<span> © Skorost United Football Academy 2025. </span>
						{""}
						<span> All Rights Reserved </span>
					</div>
					{/* Social media link section */}
					<div className={`${styles.socialMediaWrap} flex`}>
						<p>Follow us on</p>
						<a
							href="https://www.instagram.com/skorostunitedfootballacademy/"
							target="_blank"
							rel="noreferrer"
						>
							{/* Instagram Icon */}
							<InstagramIcon style={{ color: "white" }} />
						</a>
						<a
							href="https://www.facebook.com/profile.php?id=61573394522811/"
							target="_blank"
							rel="noreferrer"
						>
							{/* Facebook Icon */}
							<FacebookIcon style={{ color: "white" }} />
						</a>
						<a
							href="https://www.youtube.com/@SkorostUnitedFootballAcademy/"
							target="_blank"
							rel="noreferrer"
						>
							{/* Youtube Icon */}
							<YoutubeIcon style={{ color: "white" }} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
