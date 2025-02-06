"use client";
// REACT //
import React, { useState } from "react";

// MODULES //
import { Paths } from "@/enums/paths.enum";

// ENUMS //
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "./login.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import InputBox from "@/neevo/components/input-box/InputBox";
import Image from "next/image";
import Link from "next/link";

// CONTEXTS //
import { useAuthContext } from "@/contexts/Auth.context";

// UTILS //
import { validateEmail, validatePassword } from "@/utils/validate-inputs.util";

// IMAGES //
import BrandLogo from "@/../public/images/brand/brand-logo.png";

/** Login Screen */
const LoginScreen: React.FC<unknown> = () => {
	// Define Contexts
	const { login } = useAuthContext();

	// Define Navigation

	// Define States
	const [emailInput, setEmailInput] = useState<string>("");
	const [passwordInput, setPasswordInput] = useState<string>("");
	// Error States
	const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

	// Define Refs

	// Helper Functions
	/** Function to check if all fields are valid */
	const validateLoginForm = (): boolean => {
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

		// Check if Password is empty
		if (passwordInput.trim() === "") {
			setPasswordErrorMessage("Password is required");
			isValid = false;
		} else if (!validatePassword(passwordInput)) {
			// Check if Password is valid
			setPasswordErrorMessage(
				"Password must contain at least 8 characters, 1 uppercase alphabet, 1 special character, and 1 number"
			);
			isValid = false;
		} else {
			// If Password is valid then empty the error message
			setPasswordErrorMessage("");
		}

		return isValid;
	};

	/** On Login click - Validate the inputs and Login the User */
	const doLogin = () => {
		// Validate both the fields
		if (validateLoginForm()) {
			// Call Login function in Context
			login(emailInput, passwordInput);
		}
	};

	// View starts here
	return (
		<div className={styles.loginPage}>
			<div className={styles.loginLeft}>
				{/* Content on left */}
				<div className={styles.contentLeft}>
					{/* Star icon */}
					<h1 className={styles.loginTitle}>Neevo</h1>
					<p className={styles.loginDescription}>
						Welcome back to the Neevo Next Template. Login here to start.
					</p>
				</div>
			</div>

			{/* Login right */}
			<div className={styles.loginRight}>
				<div className={styles.formWrapper}>
					{/* Brand Logo */}
					<Image
						className={styles.brandLogo}
						src={BrandLogo}
						alt="Brand Logo"
						width={150}
						height={65}
					/>

					{/* Title On Login Page */}
					<div className={styles.loginFormWrap}>
						<h2 className={styles.loginFormTitle}>Welcome Back</h2>
						<p className={styles.loginFormDescription}>
							Login to the Neevo Next Template
						</p>
					</div>

					{/* Login Form */}
					<div className={styles.formDetails}>
						{/* Email field */}
						<div className={styles.formItem}>
							<InputBox
								label="Email"
								placeholder="Enter email here"
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

							{/* Password field */}
							<InputBox
								label="Password"
								placeholder="Enter password here"
								type={InputTextTypes.PASSWORD}
								value={passwordInput}
								onChange={(value) => {
									setPasswordInput(value);
								}}
								isError={passwordErrorMessage !== ""}
								errorMessage={passwordErrorMessage}
								onClear={() => {
									setPasswordInput("");
									setPasswordErrorMessage("");
								}}
							/>
						</div>

						{/* Login Button */}
						<div className={styles.loginBtn}>
							<Button
								size={ButtonSizes.LARGE}
								onClick={doLogin}
								text="Login"
								level={ButtonLevels.BLOCK}
							/>
						</div>

						{/* Reset password link */}
						<p className={styles.forgetPasswordLinkWrap}>
							Forgot Password?
							<Link className={styles.forgetPasswordLink} href={Paths.FORGOT_PASSWORD}>
								Click Here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
