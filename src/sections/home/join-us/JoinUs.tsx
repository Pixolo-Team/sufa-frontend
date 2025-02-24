"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./join-us.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// IMAGES //
import FootballImage from "@/../public/images/football.png";

interface JoinUsProps {
	onButtonClick: () => void;
}

/** Join Us Screen */
const JoinUs: React.FC<JoinUsProps> = ({ onButtonClick }) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section
			className={`${styles.sectionWrapper} flex justify-center align-center`}
		>
			{/* Join us image */}
			<div className={styles.imageWrapper}>
				<picture>
					<source media="(min-width: 768px)" srcSet="/images/join-us.jpg" />
					<source media="(min-width: 600px)" srcSet="/images/join-us-mobile.jpg" />
					<img src="/images/join-us-mobile.jpg" alt="cta" className={styles.image} />
				</picture>
			</div>
			<div className={`${styles.contentWrapper} text-center `}>
				{/* Title */}
				<p className={`${styles.title} font-weight-500 fade-in-up`}>
					Join the Academy today and start{" "}
					<span className={styles.inlineImageWrapper}>
						<Image
							src={FootballImage}
							alt="football"
							className={styles.inlineImage}
						/>
					</span>
					your journey towards excellence!
				</p>
				{/* Description */}
				<p className={`${styles.description} fade-in-up`}>
					Click below and register for a free trial session and become a part of our
					community.
				</p>
				{/* Button */}
				<div className="fade-in-up">
					<Button
						text={"Book a Free Trial"}
						color={Colors.SECONDARY}
						size={ButtonSizes.XLARGE}
						shape={Shapes.ROUNDED}
						level={ButtonLevels.INLINE}
						onClick={() => {
							onButtonClick();
						}}
					/>
				</div>
			</div>
		</section>
	);
};

export default JoinUs;
