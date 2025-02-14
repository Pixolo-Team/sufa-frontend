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
	isOpen: boolean;
	onToggle: () => void;
}

/** Accordian Component */
const Accordian: React.FC<AccordianProps> = ({
	title,
	description,
	isOpen = false,
	onToggle,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={`${styles.accordianContainer}`} onClick={onToggle}>
			<div
				className={`${styles.questionWrapper} flex align-center justify-between`}
			>
				{/* Title */}
				<p className={`${styles.title} font-weight-500`}>{title}</p>
				<button
					className={`${styles.iconWrapper} flex align-center justify-center`}
				>
					{/* Icon */}
					<Icon iconName="plus" className={styles.icon} mode="outline" />
				</button>
			</div>
			{isOpen && (
				<div className={styles.answerWrapper}>
					{/* Description */}
					<p className={`${styles.description} font-weight-400`}>{description}</p>
				</div>
			)}
		</div>
	);
};

export default Accordian;
