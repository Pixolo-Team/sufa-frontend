// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";
import type { OperationsCenterData } from "@/types/operations";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Select from "@/neevo/components/select/Select";

// HOOKS //
import { WEEKDAY_LABELS, type useFeeInputs } from "./use-fee-inputs";

// UTILS //
import {
	formatBatchTimings,
	formatPlanLabel,
	getBatchWeekdays,
} from "@/utils/operations.util";

interface FeeInputFieldsProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	onCenterChange: (centerId: string) => void;
	feeInputs: ReturnType<typeof useFeeInputs>;
}

/** The center / batch / plan / date inputs shared by the calculator and the QR */
const FeeInputFields: React.FC<FeeInputFieldsProps> = ({
	centers,
	center,
	onCenterChange,
	feeInputs,
}) => {
	const {
		inputs,
		batch,
		plan,
		registrationOption,
		isFixedTerm,
		billedWeekdays,
		setBatchId,
		setPlanId,
		setRegistrationOptionId,
		setStartDate,
		setEndDate,
		toggleWeekday,
	} = feeInputs;

	const centerOptions: DropdownOptionData[] = centers.map((item) => ({
		label: item.name,
		value: item.id,
	}));
	const batchOptions: DropdownOptionData[] = (center?.batches ?? []).map((item) => ({
		label: item.name,
		value: item.id,
	}));
	const planOptions: DropdownOptionData[] = (batch?.plans ?? []).map((item) => ({
		label: formatPlanLabel(item),
		value: item.id,
	}));
	const registrationOptions: DropdownOptionData[] = [
		{ label: "No registration", value: "" },
		...(batch?.registrationOptions ?? []).map((item) => ({
			label: `${item.name} - Rs ${item.price.toLocaleString("en-IN")}`,
			value: item.id,
		})),
	];

	const selectedCenterOption =
		centerOptions.find((option) => option.value === center?.id) ?? null;
	const selectedBatchOption =
		batchOptions.find((option) => option.value === batch?.id) ?? null;
	const selectedPlanOption =
		planOptions.find((option) => option.value === plan?.id) ?? null;
	const selectedRegistrationOption =
		registrationOptions.find(
			(option) => option.value === (registrationOption?.id ?? "")
		) ?? registrationOptions[0] ?? null;

	const batchWeekdays = batch ? getBatchWeekdays(batch) : [];
	const canPickDays =
		!!plan && plan.daysPerWeek > 0 && plan.daysPerWeek < batchWeekdays.length;

	return (
		<div className={styles.fieldStack}>
			<Select
				label="Center"
				placeholder="Select center"
				options={centerOptions}
				selectedOption={selectedCenterOption}
				isRequired
				onChange={(option) => onCenterChange(option.value)}
			/>

			<Select
				label="Batch"
				placeholder="Select batch"
				options={batchOptions}
				selectedOption={selectedBatchOption}
				caption={batch ? formatBatchTimings(batch) : ""}
				isRequired
				onChange={(option) => setBatchId(option.value)}
			/>

			{batch && (
				<div className={styles.inlineInfo}>
					<span className={styles.fieldLabel}>Schedule</span>
					<p className={styles.inlineInfoText}>{formatBatchTimings(batch)}</p>
				</div>
			)}

			<Select
				label="Plan"
				placeholder={batch ? "Select plan" : "Select batch first"}
				options={planOptions}
				selectedOption={selectedPlanOption}
				isRequired
				isDisabled={!batch || planOptions.length === 0}
				onChange={(option) => setPlanId(option.value)}
			/>

			<Select
				label="Registration"
				placeholder={batch ? "Select registration" : "Select batch first"}
				options={registrationOptions}
				selectedOption={selectedRegistrationOption}
				isDisabled={!batch}
				onChange={(option) => setRegistrationOptionId(option.value)}
			/>

			{canPickDays && (
				<div>
					<span className={styles.fieldLabel}>
						Which days? (pick {plan.daysPerWeek})
					</span>
					<div className={styles.dayChips}>
						{batchWeekdays.map((weekday) => (
							<button
								key={weekday}
								type="button"
								aria-pressed={billedWeekdays.includes(weekday)}
								className={`${styles.dayChip} ${
									billedWeekdays.includes(weekday) ? styles.dayChipActive : ""
								}`}
								onClick={() => toggleWeekday(weekday)}
							>
								{WEEKDAY_LABELS[weekday]}
							</button>
						))}
					</div>
				</div>
			)}

			<div className={styles.twoUp}>
				<InputBox
					id="fee-start-date"
					label="Start date"
					type={InputTextTypes.DATE}
					value={inputs.startDate}
					isError={false}
					errorMessage=""
					showClear={false}
					isRequired
					isDisabled={!plan}
					onChange={setStartDate}
					onClear={() => setStartDate("")}
				/>
				<InputBox
					id="fee-end-date"
					label="End date"
					type={InputTextTypes.DATE}
					value={inputs.endDate}
					isError={false}
					errorMessage=""
					showClear={false}
					isDisabled={!plan || isFixedTerm}
					caption={isFixedTerm ? "Fixed term" : "Auto-filled | editable"}
					onChange={setEndDate}
					onClear={() => setEndDate("")}
				/>
			</div>

			{center && !batch && (
				<p className={styles.notice}>
					Select a batch first. Plans, timings and registration are linked to the
					batch, not the center.
				</p>
			)}

			{batch && !plan && (
				<p className={styles.notice}>
					{batch.name} has no plans yet. Add plans on the batch to use this tool.
				</p>
			)}
		</div>
	);
};

export default FeeInputFields;
