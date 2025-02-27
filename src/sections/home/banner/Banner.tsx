// REACT //
import React, { useEffect, useState } from "react";

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
	const [animateBanner, setAnimateBanner] = useState(false);

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions
	useEffect(() => {
		setAnimateBanner(true); // Optional initial delay
	}, []);

	// View starts here
	return (
		<div
			className={`${styles.bannerWrapper} ${
				animateBanner ? styles.animateBanner : ""
			}  flex align-center justify-center`}
		>
			<div className={`${styles.imageWrapper}`}>
				{/* Video / Image Wrapper */}
				<iframe
					src="https://www.youtube.com/embed/5xpKumlsud8?playlist=5xpKumlsud8&controls=0&loop=1&autoplay=1&mute=1&rel=0&showinfo=0"
					frameBorder="0"
					title="Best Football Academy in Ghatkopar, Mumbai"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
				<div className={styles.overlay}></div>
			</div>
			{/* Content Wrapper */}
			<div
				className={`${styles.textContent} flex align-center justify-center flex-column`}
			>
				{/* Banner title */}
				<div className={`${styles.bannerTitleWrap} ${styles.textContentWrap}`}>
					<h1
						className={`${styles.bannerTitle} ${styles.textContentWrapInner} font-weight-700`}
					>
						{bannerTitle}
					</h1>
				</div>
				{/* Banner description */}
				<div
					className={`${styles.bannerDescriptionWrap} ${styles.textContentWrap}`}
				>
					<p
						className={`${styles.bannerDescription} ${styles.textContentWrapInner} font-weight-400`}
					>
						{bannerDescription}
					</p>
				</div>
				{/* Free Trial Button */}
				<div className={`${styles.buttonWrapper}`}>
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
