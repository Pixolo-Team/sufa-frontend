"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./accordian.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface AccordianProps {
	title: string;
	description: string;
}

/** Accordian Component */
const Accordian: React.FC<AccordianProps> = ({ title, description }) => {
	// Navigation and Route Params

	// Define States
	const [isAccordianActive, setIsAccordianActive] = useState<boolean>(false);

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div
			className={`${styles.accordianContainer} ${
				isAccordianActive && styles.active
			}`}
		>
			<div className={styles.questionWrapper}>
				{/* Title */}
				<p className={`${styles.title} font-weight-500`}>{title}</p>
				<button
					className={styles.iconWrapper}
					onClick={() => setIsAccordianActive(!isAccordianActive)}
				>
					{/* Icon */}
					<Icon iconName="plus" className={styles.icon} mode="outline" />
				</button>
			</div>
			{isAccordianActive && (
				<div className={styles.answerWrapper}>
					{/* Description */}
					<p className={`${styles.description} font-weight-400`}>{description}</p>
				</div>
			)}
		</div>
	);
};

export default Accordian;
