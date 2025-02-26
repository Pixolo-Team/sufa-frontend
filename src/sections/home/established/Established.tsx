// REACT //
import React, { useRef } from "react";

// STYLES //
import styles from "./established.module.scss";

// COMPONENTS //
import Image from "next/image";

// OTHERS //
import { useScroll, useTransform, motion } from "framer-motion";

// IMAGES //
import SkorostImage from "@/../public/images/skorost.jpg";

/** Established Screen */
const Established: React.FC<unknown> = () => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing" ref={ref}>
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
					{/* Images Silder */}
					<motion.div className={styles.imageWrapper} style={{ y }}>
						<Image
							src={SkorostImage}
							alt="skorost"
							className={"img-responsive full-width-img"}
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Established;
