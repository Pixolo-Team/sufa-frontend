// REACT //
import { useCallback, useState } from "react";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Button from "@/neevo/components/button/Button";
import Select from "@/neevo/components/select/Select";
import TextArea from "@/neevo/components/text-area/TextArea";

// HOOKS //
import { useLeadSubmit } from "@/hooks/use-lead-submit";

// CONSTANTS //
import { VENUE_OPTIONS } from "@/constants/venues";

const LEAD_INPUT_INIT: {
	name: string;
	phone: string;
	studentName: string;
	studentDob: string;
	venue: DropdownOptionData | null;
	otherInfo: string;
} = {
	name: "",
	phone: "",
	studentName: "",
	studentDob: "",
	venue: null,
	otherInfo: "",
};

/** Staff tool - capture a lead's contact + student details, insert straight into the `leads` table. */
const LeadForm: React.FC = () => {
	const [inputs, setInputs] = useState(LEAD_INPUT_INIT);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = useCallback((key: string, value: string) => {
		setInputs((previous) => ({ ...previous, [key]: value }));
	}, []);

	const handleVenueChange = useCallback((option: DropdownOptionData) => {
		setInputs((previous) => ({ ...previous, venue: option }));
	}, []);

	const { submitLead, isSubmitting } = useLeadSubmit({
		onSuccess: () => {
			setInputs(LEAD_INPUT_INIT);
			setErrors({});
		},
		successMessage: "Lead created successfully",
	});

	const validate = useCallback(() => {
		const newErrors: Record<string, string> = {};

		if (!inputs.name.trim()) newErrors.name = "Name is required";
		if (!inputs.phone.trim()) newErrors.phone = "Phone number is required";
		if (!inputs.studentName.trim())
			newErrors.studentName = "Student's name is required";
		if (!inputs.venue) newErrors.venue = "Venue is required";

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	}, [inputs]);

	const handleSubmit = useCallback(() => {
		if (!validate()) return;

		const otherInfo = [
			inputs.otherInfo.trim() ? `Details: ${inputs.otherInfo.trim()}` : null,
		]
			.filter(Boolean)
			.join("\n");

		submitLead({
			source: "operation_portal",
			name: inputs.name,
			phone: inputs.phone,
			studentName: inputs.studentName,
			studentDob: inputs.studentDob,
			centerName: inputs.venue?.value ?? null,
			otherInfo,
		});
	}, [inputs, validate, submitLead]);

	return (
		<div className={styles.leadForm}>
			<div className={styles.inputBox}>
				<InputBox
					label="Name"
					placeholder="Enter the contact's name"
					value={inputs.name}
					isRequired
					isError={!!errors.name}
					onChange={(value) => handleInputChange("name", value)}
					errorMessage={errors.name}
					onClear={() => handleInputChange("name", "")}
					id="lead-name"
				/>
			</div>

			<div className={styles.inputBox}>
				<InputBox
					label="Phone Number"
					placeholder="Enter the phone number"
					value={inputs.phone}
					type={InputTextTypes.NUMBER}
					isRequired
					isError={!!errors.phone}
					onChange={(value) => handleInputChange("phone", value)}
					errorMessage={errors.phone}
					onClear={() => handleInputChange("phone", "")}
					id="lead-phone"
				/>
			</div>

			<div className={styles.inputBox}>
				<InputBox
					label="Student's Name"
					placeholder="Enter the student's name"
					value={inputs.studentName}
					isRequired
					isError={!!errors.studentName}
					onChange={(value) => handleInputChange("studentName", value)}
					errorMessage={errors.studentName}
					onClear={() => handleInputChange("studentName", "")}
					id="lead-student-name"
				/>
			</div>

			<div className={styles.inputBox}>
				<InputBox
					label="Student's Date of Birth"
					placeholder="Select date of birth"
					value={inputs.studentDob}
					type={InputTextTypes.DATE}
					isRequired={false}
					isError={false}
					errorMessage=""
					onChange={(value) => handleInputChange("studentDob", value)}
					onClear={() => handleInputChange("studentDob", "")}
					id="lead-student-dob"
				/>
			</div>

			<div className={styles.inputBox}>
				<Select
					options={VENUE_OPTIONS}
					isRequired
					label="Venue"
					onChange={handleVenueChange}
					selectedOption={inputs.venue}
					placeholder="Select Venue"
					isError={!!errors.venue}
					errorMessage={errors.venue}
				/>
			</div>

			<div className={styles.textArea}>
				<TextArea
					label="Other Information"
					value={inputs.otherInfo}
					onChange={(value) => handleInputChange("otherInfo", value)}
					errorMessage=""
					isError={false}
					isRequired={false}
					onClear={() => handleInputChange("otherInfo", "")}
					placeholder="Anything else worth noting"
					id="lead-other-info"
				/>
			</div>

			<div className={styles.buttonWrapper}>
				<Button
					onClick={handleSubmit}
					text={isSubmitting ? "Adding..." : "Submit"}
					color={Colors.PRIMARY}
					shape={Shapes.ROUNDED}
					size={ButtonSizes.LARGE}
					isDisabled={isSubmitting}
				/>
			</div>
		</div>
	);
};

export default LeadForm;
