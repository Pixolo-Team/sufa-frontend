"use client";
// REACT //
import React from "react";
import Marquee from "react-fast-marquee";

// STYLES //
import styles from "./children-to-champion.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import ChildrenChampion from "@/components/children-champion/ChildrenChampion";

/** Children To Champions Screen */
const ChildrenToChampions: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className={`${styles.wrapper} `}>
				{/* Marquee Wrapper */}
				<div className={`${styles.marqueeContainer} `}>
					{/* Top Marquee */}
					<div
						className={`${styles.marquee} ${styles.topMarquee} flex  justify-center`}
					>
						<Marquee direction="left">
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="primary" />
							</div>
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="primary" />
							</div>
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="primary" />
							</div>
						</Marquee>
					</div>

					{/* Bottom Marquee */}
					<div className={`${styles.marquee} ${styles.bottomMarquee}`}>
						<Marquee direction="right">
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="default" />
							</div>
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="default" />
							</div>
							<div className={styles.marqueeItem}>
								<ChildrenChampion color="default" />
							</div>
						</Marquee>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ChildrenToChampions;
