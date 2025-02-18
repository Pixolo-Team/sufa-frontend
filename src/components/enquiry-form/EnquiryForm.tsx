"use client";

// REACT //
import { useState, useCallback } from "react";

// TYPES //
import { DropdownOptionData } from "@/neevo/types/forms";

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
import { createLeadRequest } from "@/services/api/leads.api.service";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { validateEmail } from "@/utils/validate-inputs.util";

// Initial form state
const ENQUIRY_INPUT_INIT = {
	name: "",
	email: "",
	phone: "",
	others: {
		subject: "",
		message: "",
	},
};

// Subject Option
const SUBJECT_OPTIONS: DropdownOptionData[] = [
	{ label: "Free Session", value: "Free Session" },
	{ label: "General Enquiry", value: "General Enquiry" },
];

/** Enquiry Form Component */
const EnquiryForm: React.FC = () => {
	// Define states
	const [enquiryInputs, setEnquiryInputs] = useState(ENQUIRY_INPUT_INIT);
	const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({});

	/** Validate Enquiry form */
	const validateEnquiryForm = useCallback(() => {
		const newErrors: Record<string, string> = {};

		// Check if name is empty
		if (!enquiryInputs.name.trim()) newErrors.name = "Full name is required";

		// Check if email is valid and not empty
		if (!enquiryInputs.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(enquiryInputs.email)) {
			newErrors.email = "Invalid email format";
		}

		// Check if phone number is empty
		if (!enquiryInputs.phone.trim()) {
			newErrors.phone = "Phone Number is required";
		}

		// Check if subject is empty
		if (!enquiryInputs.others.subject.trim()) {
			newErrors["others.subject"] = "Subject is required";
		}

		// Set Error State
		setEnquiryErrors(newErrors);

		// If new errors object is empty then return true else false
		return Object.keys(newErrors).length === 0;
	}, [enquiryInputs]);

	/** Submit Enquiry form */
	const submitEnquiryForm = useCallback(() => {
		// If not a valid form then return
		if (!validateEnquiryForm()) return;

		// Make Api call
		createLeadRequest(enquiryInputs)
			.then((response) => {
				// If success then show a toast and reset form
				if (response.success) {
					showToast("Lead created successfully", ToastTypes.SUCCESS);
					// Reset form
					setEnquiryInputs(ENQUIRY_INPUT_INIT);
				} else {
					showToast("Failed to create lead", ToastTypes.ERROR);
				}
			})

			.catch(() => {
				showToast("Failed to create lead", ToastTypes.ERROR);
			});
	}, [enquiryInputs, validateEnquiryForm]);

	/** Update Inputs */
	const handleInputChange = useCallback((key: string, value: string) => {
		setEnquiryInputs((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	/** Handle Nested Input Change for "others" */
	const handleOthersChange = useCallback((key: string, value: string) => {
		setEnquiryInputs((prev) => ({
			...prev,
			others: {
				...prev.others,
				[key]: value,
			},
		}));
	}, []);

	return (
		<>
			<div className={`${styles.inputBoxWrapper}`}>
				{/* Name Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Full Name"
						placeholder="Enter your Full Name"
						value={enquiryInputs.name}
						isRequired
						isError={!!enquiryErrors.name}
						onChange={(value) => handleInputChange("name", value)}
						errorMessage={enquiryErrors.name}
						onClear={() => handleInputChange("name", "")}
					/>
				</div>
				{/* Email Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Email"
						placeholder="Enter your Email"
						value={enquiryInputs.email}
						isRequired
						isError={!!enquiryErrors.email}
						onChange={(value) => handleInputChange("email", value)}
						errorMessage={enquiryErrors.email}
						onClear={() => handleInputChange("email", "")}
					/>
				</div>
			</div>

			<div className={`${styles.inputBoxWrapper}`}>
				{/* Phone Number Input Box  */}
				<div className={styles.inputBox}>
					<InputBox
						label="Phone Number"
						placeholder="Enter your Phone Number"
						value={enquiryInputs.phone}
						type={InputTextTypes.NUMBER}
						isRequired
						isError={!!enquiryErrors.phone}
						onChange={(value) => handleInputChange("phone", value)}
						errorMessage={enquiryErrors.phone}
						onClear={() => handleInputChange("phone", "")}
					/>
				</div>
				{/* Select Subject */}
				<div className={styles.inputBox}>
					<Select
						options={SUBJECT_OPTIONS}
						isRequired
						label="Subject"
						onChange={(item) => handleOthersChange("subject", item.value)}
						placeholder="Select Subject"
						isError={!!enquiryErrors["others.subject"]}
						errorMessage={enquiryErrors["others.subject"]}
					/>
				</div>
			</div>

			<div className={`${styles.inputBoxWrapper}`}>
				<div className={styles.textArea}>
					{/* Message Text area */}
					<TextArea
						label="Message"
						value={enquiryInputs.others.message}
						onChange={(value) => handleOthersChange("message", value)}
						errorMessage=""
						isError={false}
						isRequired={false}
						onClear={() => handleOthersChange("message", "")}
					/>
				</div>
			</div>

			{/* Submit Button */}
			<Button
				onClick={submitEnquiryForm}
				text="Submit"
				color={Colors.SECONDARY}
				shape={Shapes.ROUNDED}
			/>
		</>
	);
};

export default EnquiryForm;
