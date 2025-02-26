"use client";
// REACT //
import React, { useRef } from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./join-us.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// OTHERS //
import { useScroll, useTransform, motion } from "framer-motion";

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
	const joinUsSectionRef = useRef(null);

	// Helper Functions
	// Get the vertical scroll progress relative to the referenced section
	const { scrollYProgress } = useScroll({
		target: joinUsSectionRef,
		offset: ["start end", "end start"],
	});
	// Apply a vertical parallax effect based on scroll progress
	const joinUsSectionStyles = useTransform(
		scrollYProgress,
		[0, 1],
		["-20%", "20%"]
	);

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section
			className={`${styles.sectionWrapper} flex justify-center align-center`}
			ref={joinUsSectionRef}
		>
			{/* Join us image */}
			<motion.div
				className={styles.imageWrapper}
				style={{ y: joinUsSectionStyles }}
			>
				<picture>
					<source media="(min-width: 768px)" srcSet="/images/join-us-desktop.jpg" />
					<source media="(min-width: 600px)" srcSet="/images/join-us-mobile.jpg" />
					<Image
						src="/images/join-us-mobile.jpg"
						alt="cta"
						className={styles.image}
						fill
					/>
				</picture>
			</motion.div>
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
