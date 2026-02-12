"use client";

// REACT //
import { useState, useCallback } from "react";

// TYPES //
import { DropdownOptionData } from "@/neevo/types/forms";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";

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

// Subject Option
const SUBJECT_OPTIONS: DropdownOptionData[] = [
	{ label: "Free Session", value: "Free Session" },
	{ label: "General Enquiry", value: "General Enquiry" },
];

// Initial form state
const ENQUIRY_INPUT_INIT = {
	name: "",
	age: "",
	phone: "",
	current_school: "",
	locality: "",
	other_fields: {
		subject: null,
		message: "",
	},
};

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

		// Check if age is empty
		if (!enquiryInputs.age.trim()) {
			newErrors.age = "Age is required";
		}

		// Check if phone number is empty
		if (!enquiryInputs.phone.trim()) {
			newErrors.phone = "Phone Number is required";
		}

		// Check if subject is empty
		if (!enquiryInputs.other_fields.subject) {
			newErrors["other_fields.subject"] = "Subject is required";
		}

		// Set Error State
		setEnquiryErrors(newErrors);

		// If new errors object is empty then return true else false
		return Object.keys(newErrors).length === 0;
	}, [enquiryInputs]);

	/** Submit Enquiry form */
	const submitEnquiryForm = useCallback(async () => {
		// If not a valid form then return
		if (!validateEnquiryForm()) return;

		try {
			// Make Api call
			const response = await createLeadRequest(enquiryInputs);

			// If success then show a toast and reset form
			if (response.success) {
				showToast("Lead created successfully", ToastTypes.SUCCESS);
				// Reset form
				setEnquiryInputs(ENQUIRY_INPUT_INIT);
			} else {
				showToast("Failed to create lead", ToastTypes.ERROR);
			}
		} catch {
			showToast("Failed to create lead", ToastTypes.ERROR);
		}
	}, [enquiryInputs, validateEnquiryForm]);

	/** Update Inputs */
	const handleInputChange = useCallback((key: string, value: string) => {
		setEnquiryInputs((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	/** Handle Nested Input Change for "others" */
	const handleOthersChange = useCallback(
		(key: string, value: string | DropdownOptionData) => {
			setEnquiryInputs((prev) => ({
				...prev,
				other_fields: {
					...prev.other_fields,
					[key]: value,
				},
			}));
		},
		[]
	);

	return (
		<div className="">
			<div className={`flex flex-wrap flex-column ${styles.inputBoxWrapper}`}>
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
						id="full-name"
					/>
				</div>
				{/* Age Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Age"
						placeholder="Enter your Age"
						value={enquiryInputs.age}
						type={InputTextTypes.NUMBER}
						isRequired
						isError={!!enquiryErrors.age}
						onChange={(value) => handleInputChange("age", value)}
						errorMessage={enquiryErrors.age}
						onClear={() => handleInputChange("age", "")}
						id="age"
					/>
				</div>

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
						id="phone-number"
					/>
				</div>
				{/* Select Subject */}
				<div className={styles.inputBox}>
					<Select
						options={SUBJECT_OPTIONS}
						isRequired
						label="Subject"
						onChange={(item) => handleOthersChange("subject", item)}
						selectedOption={enquiryInputs.other_fields.subject}
						placeholder="Select Subject"
						isError={!!enquiryErrors["other_fields.subject"]}
						errorMessage={enquiryErrors["other_fields.subject"]}
					/>
				</div>

				{/* Current School Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Current School"
						placeholder="Enter your Current School"
						value={enquiryInputs.current_school}
						type={InputTextTypes.TEXT}
						isError={!!enquiryErrors.current_school}
						onChange={(value) => handleInputChange("current_school", value)}
						errorMessage={enquiryErrors.current_school}
						onClear={() => handleInputChange("current_school", "")}
						id="current-school"
					/>
				</div>

				{/* Locality Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Locality"
						placeholder="Enter your Locality"
						value={enquiryInputs.locality}
						type={InputTextTypes.TEXT}
						isError={!!enquiryErrors.locality}
						onChange={(value) => handleInputChange("locality", value)}
						errorMessage={enquiryErrors.locality}
						onClear={() => handleInputChange("locality", "")}
						id="locality"
					/>
				</div>

				<div className={styles.textArea}>
					{/* Message Text area */}
					<TextArea
						label="Message"
						value={enquiryInputs.other_fields.message}
						onChange={(value) => handleOthersChange("message", value)}
						errorMessage=""
						isError={false}
						isRequired={false}
						onClear={() => handleOthersChange("message", "")}
						placeholder="Message"
						id="message-id"
					/>
				</div>
			</div>

			{/* Submit Button */}
			<div className={styles.buttonWrapper}>
				<Button
					onClick={submitEnquiryForm}
					text="Submit"
					color={Colors.SECONDARY}
					shape={Shapes.ROUNDED}
					size={ButtonSizes.XLARGE}
					extraClass="font-weight-600"
				/>
			</div>
		</div>
	);
};

export default EnquiryForm;
