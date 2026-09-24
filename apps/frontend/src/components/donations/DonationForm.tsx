// REACT //
import { memo, useCallback, useState } from "react";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "../operations/operations.module.scss";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Button from "@/neevo/components/button/Button";
import TextArea from "@/neevo/components/text-area/TextArea";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";
import { createDonation } from "@/services/donations.api.service";

const todayIso = (): string => {
	const now = new Date();

	return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
};

const DONATION_INPUT_INIT = {
	name: "",
	amount: "",
	donatedOn: todayIso(),
	details: "",
};

type DonationInputs = typeof DONATION_INPUT_INIT;

/** Pure validator - defined outside so its identity never changes per render. */
const validateInputs = (inputs: DonationInputs): Record<string, string> => {
	const newErrors: Record<string, string> = {};

	if (!inputs.name.trim()) newErrors.name = "Donor name is required";

	const amount = Number(inputs.amount);

	if (!inputs.amount.trim()) newErrors.amount = "Amount is required";
	else if (!Number.isFinite(amount) || amount <= 0)
		newErrors.amount = "Enter a valid amount";

	if (!inputs.donatedOn) newErrors.donatedOn = "Date is required";
	if (!inputs.details.trim()) newErrors.details = "Details are required";

	return newErrors;
};

/**
 * Staff form - one donor entry straight into `donations`.
 * Memoised + stable field handlers so typing in one field does not
 * re-create callbacks for the other fields each keystroke.
 */
const DonationForm: React.FC = memo(() => {
	const [inputs, setInputs] = useState(DONATION_INPUT_INIT);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = useCallback((key: string, value: string) => {
		setInputs((previous) => ({ ...previous, [key]: value }));
	}, []);

	// Stable per-field callbacks - child inputs keep the same onChange identity
	// across renders unless their own value changes.
	const handleNameChange = useCallback(
		(value: string) => handleInputChange("name", value),
		[handleInputChange]
	);
	const handleAmountChange = useCallback(
		(value: string) => handleInputChange("amount", value),
		[handleInputChange]
	);
	const handleDateChange = useCallback(
		(value: string) => handleInputChange("donatedOn", value),
		[handleInputChange]
	);
	const handleDetailsChange = useCallback(
		(value: string) => handleInputChange("details", value),
		[handleInputChange]
	);
	const handleNameClear = useCallback(
		() => handleInputChange("name", ""),
		[handleInputChange]
	);
	const handleAmountClear = useCallback(
		() => handleInputChange("amount", ""),
		[handleInputChange]
	);
	const handleDateClear = useCallback(
		() => handleInputChange("donatedOn", ""),
		[handleInputChange]
	);
	const handleDetailsClear = useCallback(
		() => handleInputChange("details", ""),
		[handleInputChange]
	);

	const handleSubmit = useCallback(() => {
		if (isSubmitting) return;

		const newErrors = validateInputs(inputs);

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) return;

		setIsSubmitting(true);

		createDonation({
			name: inputs.name,
			amount: Number(inputs.amount),
			details: inputs.details,
			donatedOn: inputs.donatedOn,
		})
			.then(() => {
				showToast("Donation added", ToastTypes.SUCCESS);
				setInputs({ ...DONATION_INPUT_INIT, donatedOn: todayIso() });
				setErrors({});
			})
			.catch((error: unknown) => {
				console.error("Failed to create donation:", error);
				showToast("Could not add donation. Try again.", ToastTypes.ERROR);
			})
			.finally(() => setIsSubmitting(false));
	}, [inputs, isSubmitting]);

	return (
		<div className={styles.leadForm}>
			<div className={styles.inputBox}>
				<InputBox
					label="Donor Name"
					placeholder="e.g. Gaurav Idani"
					value={inputs.name}
					isRequired
					isError={!!errors.name}
					onChange={handleNameChange}
					errorMessage={errors.name}
					onClear={handleNameClear}
					id="donation-name"
				/>
			</div>

			<div className={styles.inputBox}>
				<InputBox
					label="Amount (₹)"
					placeholder="e.g. 1400"
					value={inputs.amount}
					type={InputTextTypes.NUMBER}
					isRequired
					isError={!!errors.amount}
					onChange={handleAmountChange}
					errorMessage={errors.amount}
					onClear={handleAmountClear}
					id="donation-amount"
				/>
			</div>

			<div className={styles.inputBox}>
				<InputBox
					label="Date"
					placeholder="Select date"
					value={inputs.donatedOn}
					type={InputTextTypes.DATE}
					isRequired
					isError={!!errors.donatedOn}
					errorMessage={errors.donatedOn}
					onChange={handleDateChange}
					onClear={handleDateClear}
					id="donation-date"
				/>
			</div>

			<div className={styles.textArea}>
				<TextArea
					label="Details"
					value={inputs.details}
					onChange={handleDetailsChange}
					errorMessage={errors.details ?? ""}
					isError={!!errors.details}
					isRequired
					onClear={handleDetailsClear}
					placeholder="e.g. 1 Player Match kits"
					id="donation-details"
				/>
			</div>

			<div className={styles.buttonWrapper}>
				<Button
					onClick={handleSubmit}
					text={isSubmitting ? "Adding..." : "Add Donation"}
					color={Colors.PRIMARY}
					shape={Shapes.ROUNDED}
					size={ButtonSizes.LARGE}
					isDisabled={isSubmitting}
				/>
			</div>
		</div>
	);
});

DonationForm.displayName = "DonationForm";

export default DonationForm;
