"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./Banner.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";

/** Banner Screen */
const Banner: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={styles.bannerWrapper}>
			<div>
				{/* Image Wrapper */}
				<picture>
					<source media="(min-width: 768px)" srcSet="/images/group-banner.png" />
					<source media="(min-width: 600px)" srcSet="/images/banner.png" />
					<img
						src="/images/banner.png"
						alt="Group Banner"
						className={styles.groupBannerImage}
					/>
				</picture>
			</div>
			{/* Content Wrapper */}
			<div className={`${styles.textContent} flex align-center justify-center`}>
				{/* Banner title */}
				<p className={styles.bannerTitle}>Where Little Feet Dream Big!</p>
				{/* Banner description */}
				<p className={styles.bannerDescription}>
					At Skorost United Academy, we don’t just train players—we shape champions.
					With every kick, every sprint, and every lesson, young athletes grow
					stronger, smarter, and ready to take on the world.
				</p>
				{/* Free Trial Button */}
				<Button
					text={"Book a FREE TRIAL"}
					onClick={() => {
						console.log();
					}}
					shape={Shapes.ROUNDED}
					size={ButtonSizes.XLARGE}
					color={Colors.SECONDARY}
					level={ButtonLevels.INLINE}
				/>
			</div>
		</div>
	);
};

export default Banner;
