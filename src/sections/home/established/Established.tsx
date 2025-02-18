"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./established.module.scss";

// COMPONENTS //
import Image from "next/image";

// IMAGES //
import SkorostImage from "@/../public/images/skorost.jpg";

/** Established Screen */
const Established: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
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
					<div className={styles.imageWrapper}>
						<Image
							src={SkorostImage}
							alt="skorost"
							className={"img-responsive full-width-img"}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Established;
