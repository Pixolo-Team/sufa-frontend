"use client";
// REACT //
import React, { useState } from "react";

// MODULES //
import { Paths } from "@/enums/paths.enum";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./reset-password.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import InputBox from "@/neevo/components/input-box/InputBox";
import Image from "next/image";
import Link from "next/link";

// UTILS //
import { validateEmail } from "@/utils/validate-inputs.util";

// IMAGES //
import BrandLogo from "@/../public/images/brand/brand-logo.png";

/** Reset password screen */
const ResetPasswordScreen: React.FC<unknown> = () => {
	// Define Navigation

	// Define States
	const [emailInput, setEmailInput] = useState<string>("");

	// Error States
	const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

	// Define Refs

	// Helper Functions
	/** Function to check if all fields are valid */
	const validateEmailInputField = (): boolean => {
		let isValid = true;

		// Check if Email is empty
		if (emailInput.trim() === "") {
			setEmailErrorMessage("Email is required");
			isValid = false;
		} else if (!validateEmail(emailInput)) {
			// Check if Email is valid
			setEmailErrorMessage("Please enter a valid email address");
			isValid = false;
		} else {
			// If Email is valid then empty the error message
			setEmailErrorMessage("");
		}

		return isValid;
	};

	/** Function to submit the form */
	const doSubmit = () => {
		// Validate the fields
		if (validateEmailInputField()) {
			console.log("Email is valid");
		}
	};

	// View starts here
	return (
		// Main section
		<div className={styles.resetPasswordScreen}>
			<div className={`container ${styles.resetPasswordContainer}`}>
				{/* Left section */}
				<div className={styles.leftSection}>
					<div className={styles.leftContent}>
						{/* Page Heading */}
						<h1 className={styles.leftSectionTitle}>Reset Password</h1>
						<p className={styles.leftSectionDescription}>
							Don’t worry ! We will help you rest it. Enter your email in the right.
						</p>
					</div>
				</div>

				{/* Form box section */}
				<div className={styles.resetPasswordFormWrap}>
					{/* Brand Logo */}
					<Image
						className={styles.brandIcon}
						src={BrandLogo}
						alt="Brand Logo"
						width={150}
					/>

					{/* Form Title and Description */}
					<div className={styles.resetPasswordInfo}>
						<h2 className={styles.resetTitle}>Reset Password</h2>
						<p className={styles.resetInfo}>
							Enter your email and we’ll send you a link to reset your password
						</p>
					</div>

					<div>
						{/* Email Input Box */}
						<InputBox
							label="Email"
							placeholder="abc@gmail.com"
							type={InputTextTypes.EMAIL}
							value={emailInput}
							onChange={(value) => {
								setEmailInput(value);
							}}
							isError={emailErrorMessage !== ""}
							errorMessage={emailErrorMessage}
							onClear={() => {
								setEmailInput("");
								setEmailErrorMessage("");
							}}
						/>
						{/* Login Button */}
						<div className={styles.submitButton}>
							<Button
								size={ButtonSizes.SMALL}
								onClick={doSubmit}
								text="Submit"
								level={ButtonLevels.BLOCK}
							/>
						</div>
					</div>

					{/* Reset password link */}
					<p className={styles.resetPasswordLinkWrap}>
						Go to Login?
						<Link className={styles.resetPasswordLink} href={Paths.LOGIN}>
							Click Here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordScreen;
