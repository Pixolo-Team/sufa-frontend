"use client";
// REACT //
import React from "react";
import Marquee from "react-fast-marquee";

// STYLES //
import styles from "./children-to-champion.module.scss";

// COMPONENTS //
import ChildrenChampionItem from "@/components/children-champion/ChildrenChampionItem";

/** Children To Champions Screen */
const ChildrenToChampions: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className={`${styles.childrenToChampionsWrapper} section-spacing`}>
			{/* Marquee Wrapper */}
			<div className={`${styles.marqueeContainer}`}>
				{/* Top Marquee */}
				<div
					className={`${styles.topMarquee} bg-primary-regular flex  justify-center`}
				>
					<Marquee direction="left">
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
					</Marquee>
				</div>

				{/* Bottom Marquee */}
				<div className={`${styles.bottomMarquee}`}>
					<Marquee direction="right">
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
					</Marquee>
				</div>
			</div>
		</section>
	);
};

export default ChildrenToChampions;
