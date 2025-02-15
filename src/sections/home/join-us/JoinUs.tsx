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
import JoinUsImage from "@/../public/images/join-us.jpg";

/** Join Us Screen */
const JoinUs: React.FC<unknown> = () => {
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
				<Image src={JoinUsImage} alt="cta" className={styles.image} />
			</div>
			<div className={`${styles.contentWrapper} container text-center`}>
				{/* Title */}
				<p className={`${styles.title} font-weight-500`}>
					Join the Academy today and start{" "}
					<Image src={FootballImage} alt="football" className={styles.inlineImage} />
					your journey towards excellence!
				</p>
				{/* Description */}
				<p className={`${styles.description} font-weight-400`}>
					Click below and register for a free trial session and become a part of our
					community.
				</p>
				{/* Button */}
				<Button
					text={"Book a Free Trial"}
					color={Colors.SECONDARY}
					size={ButtonSizes.XLARGE}
					shape={Shapes.ROUNDED}
					level={ButtonLevels.INLINE}
					onClick={() => {
						console.log("Button Clicked");
					}}
				/>
			</div>
		</section>
	);
};

export default JoinUs;
