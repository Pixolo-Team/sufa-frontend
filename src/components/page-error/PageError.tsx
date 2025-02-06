"use client";

// REACT //
import React from "react";

// ENUMS //
import { ErrorCodes } from "@/neevo/enums/error.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./page-error.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import Icon from "@/neevo/components/Icon";

// IMAGES /

interface PageErrorProps {
	errorTitle: string;
	errorDescription: string;
	errorCode: ErrorCodes;
}

/** Page Error Component */
const PageError: React.FC<PageErrorProps> = ({
	errorTitle,
	errorDescription,
	errorCode,
}) => {
	// Define States

	// Define Refs

	// Define Contexts

	// Define Helper Functions
	/** Get component Icon based on error code */
	const getErrorImage = (errorCode: ErrorCodes) => {
		switch (errorCode) {
			case ErrorCodes.NOT_FOUND:
				// Error Icon for 404 error - Not Found
				return (
					<Icon iconName="not-found" className={styles.errorIcon} mode="filled" />
				);
			case ErrorCodes.BAD_REQUEST:
				return (
					// Error Icon for 400 error - Bad Request
					<Icon iconName="bad-request" className={styles.errorIcon} mode="filled" />
				);
			case ErrorCodes.INTERNAL_SERVER_ERROR:
				return (
					// Error Icon for 500 error - Internal Server Error
					<Icon
						iconName="internal-server-error"
						className={styles.errorIcon}
						mode="filled"
					/>
				);
			default:
				return null;
		}
	};

	// Return the JSX for the PageError component
	return (
		<div className={styles.errorPageWrapper}>
			{/* Error Image */}
			<div className={styles.errorImageWrapper}>{getErrorImage(errorCode)}</div>

			{/* Error Title  */}
			<p className={styles.errorTitle}>{errorTitle}</p>

			{/* Error Description */}
			<p className={styles.errorDescription}>{errorDescription}</p>

			{/* Button  */}
			<div className={styles.errorButtonWrapper}>
				<Button
					text="Back to Home"
					onClick={() => (window.location.href = "/documentation")}
					size={ButtonSizes.XLARGE}
				/>
			</div>
		</div>
	);
};

export default PageError;
