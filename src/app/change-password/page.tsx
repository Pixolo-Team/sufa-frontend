"use client";

// REACT //
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// MODULES //
import { Paths } from "@/enums/paths.enum";

// TYPES //
import {
	ChangePasswordData,
	ChangePasswordErrorData,
	ChangePasswordVisibilityData,
} from "@/types/change-password";
import { ApiResponseData } from "@/types/app";

// ENUMS //
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "./change-password.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import InputBox from "@/neevo/components/input-box/InputBox";
import Image from "next/image";

// API SERVICES //
import { changePasswordRequest } from "@/services/api/account.api.service";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// IMAGES //
import BrandLogo from "@/../public/images/brand/brand-logo.png";

/** Change password screen */
const ChangePasswordScreen: React.FC<unknown> = () => {
	// Define Navigation
	const router = useRouter();

	// State for passwords
	const [changePasswordInput, setChangePasswordInput] =
		useState<ChangePasswordData>({
			password: "",
			confirmPassword: "",
		});

	// State for error messages
	const [changePasswordError, setChangePasswordError] =
		useState<ChangePasswordErrorData>({
			password: "",
			confirmPassword: "",
		});

	// State for password visibility
	const [fieldVisibility, setFieldVisibility] =
		useState<ChangePasswordVisibilityData>({
			password: false,
			confirmPassword: false,
		});

	// Handlers
	/** Toggle the visibility of the specified password field.*/
	const togglePasswordVisibility = (
		field: keyof ChangePasswordVisibilityData
	) => {
		setFieldVisibility((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	/** Handles Password change. */
	const handleInputChange = (field: keyof ChangePasswordData, value: string) => {
		setChangePasswordInput((prev) => ({ ...prev, [field]: value }));
	};

	/** Validates the input fields and updates error messages if invalid.*/
	const validateInputFields = (): boolean => {
		let isValid = true;
		const errors: ChangePasswordErrorData = { password: "", confirmPassword: "" };

		// Check if the password is empty.
		if (changePasswordInput.password.trim() === "") {
			errors.password = "Password is required";
			isValid = false;
		}
		// Check if password meets the minimum length requirement.
		else if (changePasswordInput.password.length < 8) {
			errors.password = "Password must be at least 8 characters";
			isValid = false;
		}

		//Check if the confirm password is empty
		if (changePasswordInput.confirmPassword.trim() === "") {
			errors.confirmPassword = "Confirm Password is required";
			isValid = false;
		}
		// Check if confirm password matches the password.
		else if (
			changePasswordInput.confirmPassword !== changePasswordInput.password
		) {
			errors.confirmPassword = "Passwords do not match";
			isValid = false;
		}

		// Update the error state with the validation results
		setChangePasswordError(errors);
		return isValid;
	};

	/** Change password logic by validating inputs. */
	const changePassword = () => {
		// Check if all the fields are valid
		if (validateInputFields()) {
			// Make API Call to Change the password
			changePasswordRequest(
				changePasswordInput.confirmPassword,
				changePasswordInput.password
			)
				.then((response: ApiResponseData<boolean>) => {
					if (response.status_code === 200) {
						// Navigate to Login Page
						router.push(Paths.LOGIN);
					} else {
						// Display error message in toast
						showToast(response.message, ToastTypes.ERROR);
					}
				})
				.catch(() => {
					// Display error message in toast
					showToast("Something went wrong", ToastTypes.ERROR);
				});
		}
	};

	// View starts here
	return (
		<div className={styles.changePasswordScreen}>
			{/* Main container for the change password screen */}
			<div className={`container ${styles.changePasswordContainer}`}>
				{/* Left section */}
				<div className={styles.leftSection}>
					<div className={styles.leftContent}>
						<h1 className={styles.leftSectionTitle}>Change Password</h1>
						<p className={styles.leftSectionDescription}>
							Enter your new Password. Remember to keep it strong, and do not share it
							with others.
						</p>
					</div>
				</div>

				{/* Form section for changing the password */}
				<div className={styles.changePasswordFormWrap}>
					{/* Brand logo */}
					<Image
						className={styles.brandIcon}
						src={BrandLogo}
						alt="Brand Logo"
						width={150}
					/>
					<div className={styles.changePasswordInfo}>
						<h2 className={styles.changeTitle}>Change Password</h2>
						<p className={styles.changeInfo}>
							Enter a new password and confirm it to change your password.
						</p>
					</div>

					{/* Input fields for password and confirm password */}
					<div className={styles.inputArea}>
						{/* New Password input field */}
						<InputBox
							label="New Password"
							placeholder="Enter your new password"
							type={
								fieldVisibility.password ? InputTextTypes.TEXT : InputTextTypes.PASSWORD
							}
							value={changePasswordInput.password}
							showClear={false}
							onChange={(value) => handleInputChange("password", value)}
							iconRight={fieldVisibility.password ? "eye" : "invisible"}
							onRightIconClick={() => togglePasswordVisibility("password")}
							isRequired={true}
							isError={changePasswordError.password !== ""}
							errorMessage={changePasswordError.password}
							onClear={() => handleInputChange("password", "")}
						/>
						{/* Confirm New Password input field */}
						<InputBox
							label="Confirm Password"
							placeholder="Re-enter your new password"
							type={
								fieldVisibility.confirmPassword
									? InputTextTypes.TEXT
									: InputTextTypes.PASSWORD
							}
							value={changePasswordInput.confirmPassword}
							showClear={false}
							onChange={(value) => handleInputChange("confirmPassword", value)}
							iconRight={fieldVisibility.confirmPassword ? "eye" : "invisible"}
							onRightIconClick={() => togglePasswordVisibility("confirmPassword")}
							isRequired={true}
							isError={changePasswordError.confirmPassword !== ""}
							errorMessage={changePasswordError.confirmPassword}
							onClear={() => handleInputChange("confirmPassword", "")}
						/>
					</div>

					{/* Submit button for changing the password */}
					<div className={styles.changePasswordButton}>
						<Button
							size={ButtonSizes.LARGE}
							onClick={changePassword}
							text="Change Password"
							level={ButtonLevels.BLOCK}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChangePasswordScreen;
