"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes, Sizes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./Banner.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// IMAGES //
import BannerImage from "@/../public/images/banner.png";

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
			{/* <Image src={BannerImage} alt="Banner" className={styles.bannerImage} /> */}
			<div className={styles.textContent}>
				<p className={styles.bannerTitle}>Where Little Feet Dream Big!</p>
				<p className={styles.bannerDescription}>
					At Skorost United Academy, we don’t just train players—we shape champions.
					With every kick, every sprint, and every lesson, young athletes grow
					stronger, smarter, and ready to take on the world.
				</p>
				<Button
					text={"Book a FREE TRIAL"}
					onClick={() => {
						console.log();
					}}
					shape={Shapes.ROUNDED}
					size={ButtonSizes.XLARGE}
					color={Colors.SECONDARY}
				/>
			</div>
		</div>
	);
};

export default Banner;
