"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./content-from-cms.module.scss";

interface ContentFromCmsProps {
	wrapperClassName: string;
	children: React.ReactNode;
	overrideDefaultStyles?: boolean;
}

/** Content From Cms Component */
const ContentFromCms: React.FC<ContentFromCmsProps> = ({
	wrapperClassName = "",
	children,
	overrideDefaultStyles = true,
}) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div
			className={`${
				!overrideDefaultStyles ? styles.cmsStyles : ""
			} ${wrapperClassName}`}
		>
			{children}
		</div>
	);
};

export default ContentFromCms;
