// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./banner.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import Image from "next/image";

// IMAGES //
import PandaImage from "@/../public/images/panda.png";

interface BannerProps {
	bannerTitle: string;
	bannerDescription: string;
	onButtonClick: () => void;
}

/** Banner Screen */
const Banner: React.FC<BannerProps> = ({
	bannerTitle,
	bannerDescription,
	onButtonClick,
}) => {
	// Navigation and Route Params
	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={`${styles.bannerWrapper} flex align-center justify-center`}>
			<div className={styles.imageWrapper}>
				{/* Image Wrapper */}
				<picture>
					<source media="(min-width: 768px)" srcSet="/images/banner-desktop.jpg" />
					<source media="(min-width: 600px)" srcSet="/images/banner-mobile.jpg" />
					<img
						src="/images/banner-mobile.jpg"
						alt="Group Banner"
						className={styles.groupBannerImage}
					/>
				</picture>
			</div>
			{/* Content Wrapper */}
			<div
				className={`${styles.textContent} flex align-center justify-center flex-column`}
			>
				{/* Banner title */}
				<h1 className={`${styles.bannerTitle} font-weight-700 fade-in-up`}>
					{bannerTitle}
				</h1>
				{/* Banner description */}
				<p className={`${styles.bannerDescription} font-weight-400 fade-in-up`}>
					{bannerDescription}
				</p>
				{/* Free Trial Button */}
				<div className={`${styles.buttonWrapper} fade-in-up`}>
					<Image src={PandaImage} alt="Panda" className={styles.buttonImage} />
					<Button
						text={"Book a FREE TRIAL Now"}
						onClick={() => {
							onButtonClick();
						}}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.XLARGE}
						color={Colors.SECONDARY}
						level={ButtonLevels.INLINE}
					/>
				</div>
			</div>
		</div>
	);
};

export default Banner;
