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
		<section
			className={`${styles.childrenToChampionsWrapper} childrenToChampionsWrapper section-spacing `}
		>
			{/* Scrolling Texts Wrapper */}
			<div className={`${styles.scrollingTextsContainer}`}>
				{/* Top Scrolling Text */}
				<div className={`${styles.topScrollingTexts} bg-primary-regular`}>
					<div className={`${styles.innerTextWrap}`}>
						<div className={styles.scrollingText}>
							<ChildrenChampionItem color="primary" />
						</div>
						<div className={styles.scrollingText}>
							<ChildrenChampionItem color="primary" />
						</div>
					</div>
				</div>
				{/* Bottom Scrolling Text */}
				<div className={`${styles.bottomScrollingTexts}`}>
					<div className={`${styles.innerTextWrap}`}>
						<div className={styles.scrollingText}>
							<ChildrenChampionItem color="default" />
						</div>
						<div className={styles.scrollingText}>
							<ChildrenChampionItem color="default" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ChildrenToChampions;
