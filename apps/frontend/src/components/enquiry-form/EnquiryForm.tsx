
// REACT //
import { useState, useCallback } from "react";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";

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

// Venue options
const VENUE_OPTIONS: DropdownOptionData[] = [
	{ label: "Ghatkopar East", value: "Ghatkopar East" },
	{ label: "Ghatkopar West", value: "Ghatkopar West" },
];

// Initial form state
const ENQUIRY_INPUT_INIT = {
	studentName: "",
	parentName: "",
	dob: "",
	phone: "",
	other_fields: {
		venue: null,
		details: "",
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

		// Check if student name is empty
		if (!enquiryInputs.studentName.trim())
			newErrors.studentName = "Student's name is required";

		// Check if your (parent) name is empty
		if (!enquiryInputs.parentName.trim())
			newErrors.parentName = "Your name is required";

		// Check if DOB is empty
		if (!enquiryInputs.dob.trim())
			newErrors.dob = "Student's date of birth is required";

		// Check if phone number is empty
		if (!enquiryInputs.phone.trim()) {
			newErrors.phone = "Phone Number is required";
		}

		// Check if venue is empty
		if (!enquiryInputs.other_fields.venue) {
			newErrors["other_fields.venue"] = "Venue is required";
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

		// Map to the lead payload. The contact "name" is the parent (Your name);
		// student details ride along in other_fields.
		const leadPayload = {
			name: enquiryInputs.parentName,
			phone: enquiryInputs.phone,
			other_fields: {
				subject: "Free Session",
				student_name: enquiryInputs.studentName,
				student_dob: enquiryInputs.dob,
				venue:
					(enquiryInputs.other_fields.venue as DropdownOptionData | null)
						?.value ?? "",
				details: enquiryInputs.other_fields.details,
			},
		};

		// Make Api call
		createLeadRequest(leadPayload)
			.then((response) => {
				// If success then show a toast and reset form
				if (response.success) {
					showToast("Lead created successfully", ToastTypes.SUCCESS);
					// Reset form
					setEnquiryInputs(ENQUIRY_INPUT_INIT);
				} else {
					showToast(
						response.message ?? "Failed to create lead",
						ToastTypes.ERROR
					);
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
		<>
			<div className={`flex flex-wrap flex-column ${styles.inputBoxWrapper}`}>
				{/* Student's Name Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Student's Name"
						placeholder="Enter the student's name"
						value={enquiryInputs.studentName}
						isRequired
						isError={!!enquiryErrors.studentName}
						onChange={(value) => handleInputChange("studentName", value)}
						errorMessage={enquiryErrors.studentName}
						onClear={() => handleInputChange("studentName", "")}
						id="student-name"
					/>
				</div>
				{/* Your Name Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Your Name"
						placeholder="Enter your name"
						value={enquiryInputs.parentName}
						isRequired
						isError={!!enquiryErrors.parentName}
						onChange={(value) => handleInputChange("parentName", value)}
						errorMessage={enquiryErrors.parentName}
						onClear={() => handleInputChange("parentName", "")}
						id="parent-name"
					/>
				</div>
				{/* Student's DOB Input Box */}
				<div className={styles.inputBox}>
					<InputBox
						label="Student's Date of Birth"
						placeholder="Select date of birth"
						value={enquiryInputs.dob}
						type={InputTextTypes.DATE}
						isRequired
						isError={!!enquiryErrors.dob}
						onChange={(value) => handleInputChange("dob", value)}
						errorMessage={enquiryErrors.dob}
						onClear={() => handleInputChange("dob", "")}
						id="student-dob"
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
				{/* Select Venue */}
				<div className={styles.inputBox}>
					<Select
						options={VENUE_OPTIONS}
						isRequired
						label="Venue"
						onChange={(item) => handleOthersChange("venue", item)}
						selectedOption={enquiryInputs.other_fields.venue}
						placeholder="Select Venue"
						isError={!!enquiryErrors["other_fields.venue"]}
						errorMessage={enquiryErrors["other_fields.venue"]}
					/>
				</div>

				<div className={styles.textArea}>
					{/* Any other details (optional) */}
					<TextArea
						label="Any other details (optional)"
						value={enquiryInputs.other_fields.details}
						onChange={(value) => handleOthersChange("details", value)}
						errorMessage=""
						isError={false}
						isRequired={false}
						onClear={() => handleOthersChange("details", "")}
						placeholder="Any other details"
						id="other-details"
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
		</>
	);
};

export default EnquiryForm;
