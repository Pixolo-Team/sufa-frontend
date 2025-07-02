// REACT //
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

// STYLES //
import styles from "./established.module.scss";

// COMPONENTS //
import Image from "next/image";

// IMAGES //
import SkorostImage from "@/../public/images/new-skorost.png";

/** Established Screen */
const Established: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs
	const establishSectionRef = useRef(null);

	// Helper Functions
	// Get the vertical scroll progress relative to the referenced section
	const { scrollYProgress } = useScroll({
		target: establishSectionRef,
		offset: ["start end", "end start"],
	});
	// Apply a vertical parallax effect based on scroll progress
	const establishedStyles = useTransform(
		scrollYProgress,
		[0, 1],
		["-20%", "20%"]
	);

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing" ref={establishSectionRef}>
			<div className={`${styles.establishedWrapper} `}>
				{/* Heading at front */}
				<div className={`${styles.heading} ${styles.backHeading} font-weight-700 `}>
					<p className="fade-in-up">ESTABLISHED IN 2003</p>
				</div>
				<div className={styles.sliderWrapper}>
					{/* Heading at back */}
					<div
						className={`${styles.heading} ${styles.frontHeading} font-weight-700 `}
					>
						<p className="fade-in-up">ESTABLISHED IN 2003</p>
					</div>
					{/* Images slider */}
					<motion.div
						className={styles.imageWrapper}
						style={{ y: establishedStyles }}
					>
						<Image
							src={SkorostImage}
							alt="Football coaching team with young players at the best kids football academy in Ghatkopar since 2003"
							className={`img-responsive full-width-img ${styles.image}`}
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Established;
