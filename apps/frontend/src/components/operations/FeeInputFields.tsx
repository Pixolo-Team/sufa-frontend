// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";
import type {
	OperationsCenterData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Select from "@/neevo/components/select/Select";
import Segmented from "./Segmented";

// HOOKS //
import { WEEKDAY_LABELS, type useFeeInputs } from "./use-fee-inputs";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import { formatBatchTimings } from "@/utils/operations.util";

interface FeeInputFieldsProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	onCenterChange: (centerId: string) => void;
	registrationOptions: OperationsRegistrationOptionData[];
	feeInputs: ReturnType<typeof useFeeInputs>;
}

/** The center / batch / plan / date inputs shared by the calculator and the QR */
const FeeInputFields: React.FC<FeeInputFieldsProps> = ({
	centers,
	center,
	onCenterChange,
	registrationOptions: globalRegistrationOptions,
	feeInputs,
}) => {
	const {
		inputs,
		batch,
		plan,
		registrationOption,
		isFixedTerm,
		batchWeekdays,
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
		label: `${item.name} (${item.ageGroup})`,
		value: item.id,
	}));
	const durationOptions: DropdownOptionData[] = Array.from(
		new Set((batch?.plans ?? []).map((item) => item.durationMonths))
	)
		.sort((left, right) => left - right)
		.map((months) => ({
			label: months === 1 ? "1 Month" : `${months} Months`,
			value: String(months),
		}));
	// Keyed by days-per-week, not plan id, so the options keep their identity when
	// the duration changes and the current choice can carry across.
	const daysOptions: DropdownOptionData[] = Array.from(
		new Set(
			(batch?.plans ?? [])
				.filter((item) => item.durationMonths === plan?.durationMonths)
				.map((item) => item.daysPerWeek)
		)
	)
		.sort((left, right) => left - right)
		.map((days) => ({
			label: `${days} Days a Week`,
			value: String(days),
		}));
	const registrationOptions = [
		{ label: "No registration", value: "" },
		...globalRegistrationOptions.map((item) => ({
			label: item.name,
			value: item.id,
		})),
	];

	const selectedCenterOption =
		centerOptions.find((option) => option.value === center?.id) ?? null;
	const selectedBatchOption =
		batchOptions.find((option) => option.value === batch?.id) ?? null;
	const selectedDurationOption =
		durationOptions.find(
			(option) => option.value === String(plan?.durationMonths)
		) ?? null;
	const selectedDaysOption =
		daysOptions.find((option) => option.value === String(plan?.daysPerWeek)) ??
		null;
	const selectedRegistrationOption =
		registrationOptions.find(
			(option) => option.value === (registrationOption?.id ?? "")
		) ?? registrationOptions[0] ?? null;

	/** Resolve a plan from the duration / days pair, keeping the other half fixed */
	const selectPlan = (months: number, daysPerWeek: number | undefined) => {
		const candidates = (batch?.plans ?? []).filter(
			(item) => item.durationMonths === months
		);
		const nextPlan =
			candidates.find((item) => item.daysPerWeek === daysPerWeek) ??
			candidates[0];

		if (nextPlan) setPlanId(nextPlan.id);
	};

	// Carry the current days-per-week across, so switching months does not
	// silently reset a 2-day student back to 3 days.
	const onDurationChange = (value: string) =>
		selectPlan(Number(value), plan?.daysPerWeek);

	const onDaysChange = (value: string) =>
		selectPlan(plan?.durationMonths ?? 0, Number(value));

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

			{batch && durationOptions.length > 0 && (
				<div>
					<span className={styles.fieldLabel}>
						Number of months<span style={{ color: "#de350b" }}>*</span>
					</span>
					<Segmented
						value={selectedDurationOption?.value ?? ""}
						onChange={onDurationChange}
						options={durationOptions}
						visibleCount={3}
					/>
				</div>
			)}

			{plan && daysOptions.length > 0 && (
				<div>
					<span className={styles.fieldLabel}>
						Days per week<span style={{ color: "#de350b" }}>*</span>
					</span>
					<Segmented
						value={selectedDaysOption?.value ?? ""}
						onChange={onDaysChange}
						options={daysOptions}
					/>
				</div>
			)}

			<div>
				<span className={styles.fieldLabel}>Registration</span>
				<Segmented
					value={selectedRegistrationOption?.value ?? ""}
					onChange={setRegistrationOptionId}
					options={registrationOptions}
					visibleCount={2}
				/>
				{registrationOption && (
					<p className={styles.qrHint}>
						{registrationOption.name} - {formatRupees(registrationOption.price)}
					</p>
				)}
			</div>

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
					Select a batch first. Plans and timings are linked to the batch, not the
					center.
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
