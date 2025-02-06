"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Variants } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "@/app/page.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// IMAGES //
import Pixolo from "@/../public/images/pixolo.png";
import BrandLogo from "@/../public/images/brand/brand-logo.png";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className={styles.homeContainer}>
			{/* Neevo Icon */}
			<Image
				className={styles.brandIcon}
				src={BrandLogo}
				alt="Neevo Logo"
				width={210}
			/>

			<div className={styles.homeContent}>
				{/* Heading */}
				<p className={styles.homeHeading}> Build with Precision </p>
				{/* Subheading */}
				<p className={styles.homeSubheading}>
					Empowering Teams to <span className={styles.designText}>Design</span> with
					Purpose
				</p>
			</div>

			<div>
				{/* Explore More */}
				<p className={styles.exploreMore}>Explore more</p>
				<div className={styles.actionButtons}>
					{/* Documentation */}
					<Button
						text="Docs"
						onClick={() => console.log("clicked")}
						size={ButtonSizes.LARGE}
						variant={Variants.SOFT}
						color={Colors.PRIMARY}
						level={ButtonLevels.INLINE}
					/>

					{/* Login */}
					<Button
						text="Login"
						onClick={() => console.log("clicked")}
						size={ButtonSizes.LARGE}
						variant={Variants.SOFT}
						color={Colors.PRIMARY}
						level={ButtonLevels.INLINE}
					/>

					{/* Setting */}
					<Button
						text="Settings"
						onClick={() => console.log("clicked")}
						size={ButtonSizes.LARGE}
						variant={Variants.SOFT}
						color={Colors.PRIMARY}
						level={ButtonLevels.INLINE}
					/>
				</div>
			</div>

			{/* Footer */}
			<div className={styles.homeBottomContainer}>
				<p className={styles.bottomText}>Made by developers at</p>
				{/* Pixolo Logo */}
				<Image className={styles.pixoloIcon} src={Pixolo} alt="Pixolo" />
			</div>
		</div>
	);
};
export default HomeScreen;
