// REACT //
import React from "react";

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
					className={`${styles.topMarquee} translate-X bg-primary-regular flex  justify-center`}
				>
					<div className={`${styles.innerTextWrap}`}>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="primary" />
						</div>
					</div>
				</div>

				{/* Bottom Marquee */}
				<div className={`${styles.bottomMarquee} translate-X`}>
					<div className={`${styles.innerTextWrap}`}>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
						<div className={styles.marqueeItem}>
							<ChildrenChampionItem color="default" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ChildrenToChampions;
