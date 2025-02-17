"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./children-champion-item.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface ChildrenChampionProps {
	color?: "primary" | "default";
}

/** Children To Champions Component */
const ChildrenChampionItem: React.FC<ChildrenChampionProps> = ({
	color = "default",
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div
			className={`${styles.contentWrapper} flex align-center justify-center ${
				color === "primary" ? styles.itemPrimary : ""
			}`}
		>
			{/* Title */}
			<p className={`${styles.title} font-weight-700`}>
				From Children to Champions
			</p>
			{/* Icon */}
			<div>
				<Icon iconName={"cute"} className={styles.icon} mode="filled" />
			</div>
		</div>
	);
};

export default ChildrenChampionItem;
