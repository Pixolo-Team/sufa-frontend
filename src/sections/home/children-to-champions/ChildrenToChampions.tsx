// REACT //
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// STYLES //
import styles from "./children-to-champion.module.scss";

// COMPONENTS //
import ChildrenChampionItem from "@/components/children-champion/ChildrenChampionItem";

/** Children To Champions Screen */
const ChildrenToChampions: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs
	const sectionRef = useRef(null);

	// Define Framer Motion Hooks
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	// Define Animated Styles
	const topTextWrapper = useTransform(scrollYProgress, [0, 1], ["100vw", "0vw"]);
	const topTextX = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
	const bottomTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
	const bottomTextWrapper = useTransform(
		scrollYProgress,
		[0, 1],
		["0vw", "100vw"]
	);

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section
			className={`${styles.childrenToChampionsWrapper} childrenToChampionsWrapper section-spacing `}
		>
			{/* Scrolling Texts Wrapper */}
			<div className={`${styles.scrollingTextsContainer}`} ref={sectionRef}>
				{/* Top Scrolling Text */}
				<div className={`${styles.topScrollingTexts} bg-primary-regular`}>
					<motion.div style={{ x: topTextWrapper }}>
						<motion.div
							className={`${styles.innerTextWrap}`}
							style={{
								x: topTextX,
							}}
						>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="primary" />
							</div>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="primary" />
							</div>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="primary" />
							</div>
						</motion.div>
					</motion.div>
				</div>
				{/* Bottom Scrolling Text */}
				<div className={`${styles.bottomScrollingTexts}`}>
					<motion.div style={{ x: bottomTextWrapper }}>
						<motion.div
							className={`${styles.innerTextWrap}`}
							style={{ x: bottomTextX }}
						>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="default" />
							</div>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="default" />
							</div>
							<div className={styles.scrollingText}>
								<ChildrenChampionItem color="default" />
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default ChildrenToChampions;
