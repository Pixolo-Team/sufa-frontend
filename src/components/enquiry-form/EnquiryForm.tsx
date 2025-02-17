"use client";

// REACT //
import { useState, useCallback } from "react";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "./enquire-form.module.scss";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Button from "@/neevo/components/button/Button";
import Select from "@/neevo/components/select/Select";
import TextArea from "@/neevo/components/text-area/TextArea";

// API SERVICES //
import { createLeadRequest } from "@/services/api/privyr.api.service";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { validateEmail } from "@/utils/validate-inputs.util";

// Initial form state
const initialValues = {
	name: "",
	email: "",
	phone: "",
	others: {
		Subject: "",
		Message: "",
	},
};

// Subject Option
const SUBJECT_OPTIONS = [
	{ label: "Free Session", value: "Free Session" },
	{ label: "General Enquiry", value: "General Enquiry" },
];

const EnquiryForm: React.FC = () => {
	// Define states
	const [inputValues, setInputValues] = useState(initialValues);
	const [errors, setErrors] = useState<Record<string, string>>({});

	/** Validate form */
	const validateForm = useCallback(() => {
		const newErrors: Record<string, string> = {};

		// Check if name is empty
		if (!inputValues.name.trim()) newErrors.name = "Name is required";

		// Check if email is valid and not empty
		if (!inputValues.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(inputValues.email)) {
			newErrors.email = "Invalid email format";
		}

		// Check if phone number is empty
		if (!inputValues.phone.trim()) {
			newErrors.phone = "Phone Number is required";
		}

		// Check if subject is empty
		if (!inputValues.others.Subject.trim()) {
			newErrors["others.Subject"] = "Subject is required";
		}

		// Set Error State
		setErrors(newErrors);

		// If new errors object is empty then return true else false
		return Object.keys(newErrors).length === 0;
	}, [inputValues]);

	/** Submit form */
	const submitForm = useCallback(() => {
		// If not a valid form then return
		if (!validateForm()) return;

		// Make Api call
		createLeadRequest(inputValues)
			.then((response) => {
				// If success then show a toast and reset form
				if (response.success) {
					showToast("Lead created successfully", ToastTypes.SUCCESS);
					// Reset form
					setInputValues(initialValues);
				} else {
					showToast("Failed to create lead", ToastTypes.ERROR);
				}
			})
			.catch(() => {
				showToast("Failed to create lead", ToastTypes.ERROR);
			});
	}, [inputValues, validateForm]);

	/** Update Inputs */
	const handleInputChange = useCallback((key: string, value: string) => {
		setInputValues((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	/** Handle Nested Input Change for "others" */
	const handleOthersChange = useCallback((key: string, value: string) => {
		setInputValues((prev) => ({
			...prev,
			others: {
				...prev.others,
				[key]: value,
			},
		}));
	}, []);

	return (
		<>
			<div className={`flex ${styles.inputBoxWrapper}`}>
				{/* Name Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Name"
						placeholder="Enter your name"
						value={inputValues.name}
						isRequired
						isError={!!errors.name}
						onChange={(value) => handleInputChange("name", value)}
						errorMessage={errors.name}
						onClear={() => handleInputChange("name", "")}
					/>
				</div>
				{/* Email Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Email"
						placeholder="Enter your email"
						value={inputValues.email}
						isRequired
						isError={!!errors.email}
						onChange={(value) => handleInputChange("email", value)}
						errorMessage={errors.email}
						onClear={() => handleInputChange("email", "")}
					/>
				</div>
			</div>

			<div className={`flex ${styles.inputBoxWrapper}`}>
				{/* Phone Number Input Box  */}
				<div className={styles.inputBox}>
					<InputBox
						label="Phone Number"
						placeholder="Enter your phone number"
						value={inputValues.phone}
						type={InputTextTypes.NUMBER}
						isRequired
						isError={!!errors.phone}
						onChange={(value) => handleInputChange("phone", value)}
						errorMessage={errors.phone}
						onClear={() => handleInputChange("phone", "")}
					/>
				</div>
				{/* Select Subject */}
				<div className={styles.inputBox}>
					<Select
						options={SUBJECT_OPTIONS}
						isRequired
						label="Subject"
						onChange={(value) => handleOthersChange("Subject", value.value)}
						placeholder="Select Subject"
						isError={!!errors["others.Subject"]}
						errorMessage={errors["others.Subject"]}
					/>
				</div>
			</div>

			<div className={styles.inputBoxWrapper}>
				{/* Message Text area */}
				<TextArea
					label="Message"
					value={inputValues.others.Message}
					onChange={(value) => handleOthersChange("Message", value)}
					errorMessage=""
					isError={false}
					isRequired={false}
					onClear={() => handleOthersChange("Message", "")}
				/>
			</div>

			{/* Submit Button */}
			<Button
				onClick={submitForm}
				text="Submit"
				color={Colors.SECONDARY}
				shape={Shapes.ROUNDED}
			/>
		</>
	);
};

export default EnquiryForm;
