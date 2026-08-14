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
import type { useFeeInputs } from "./use-fee-inputs";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import { formatBatchTimings, formatWeekdayShort } from "@/utils/operations.util";

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
		batchWeekdays,
		setBatchId,
		setPlanId,
		setRegistrationOptionId,
		setDaysPerWeek,
		toggleSelectedWeekday,
		setStartDate,
		setEndDate,
	} = feeInputs;

	const centerOptions: DropdownOptionData[] = centers.map((item) => ({
		label: item.name,
		value: item.id,
	}));
	const batchOptions: DropdownOptionData[] = (center?.batches ?? []).map((item) => ({
		label: `${item.name} (${item.ageGroup})`,
		value: item.id,
	}));
	// 2-day is only an alternate to 3-day - a batch with just a 2-day plan
	// (e.g. Focus Batch) must keep it as the default, or it becomes unselectable.
	const hasThreeDayPlans = (batch?.plans ?? []).some(
		(item) => item.daysPerWeek === 3
	);
	const defaultPlans = hasThreeDayPlans
		? (batch?.plans ?? []).filter((item) => item.daysPerWeek !== 2)
		: (batch?.plans ?? []);
	const durationOptions: DropdownOptionData[] = Array.from(
		new Set(defaultPlans.map((item) => item.durationMonths))
	)
		.sort((left, right) => left - right)
		.map((months) => ({
			label: String(months),
			value: String(months),
		}));
	const daysOptions: DropdownOptionData[] = Array.from(
		new Set(
			(batch?.plans ?? [])
				.filter((item) => item.durationMonths === plan?.durationMonths)
				.map((item) => item.daysPerWeek)
		)
	)
		.sort((left, right) => left - right)
		.map((days) => ({
			label: String(days),
			value: String(days),
		}));
	const registrationOptions = [
		{ label: "None", value: "" },
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
	const selectedRegistrationOption =
		registrationOptions.find(
			(option) => option.value === (registrationOption?.id ?? "")
		) ?? registrationOptions[0] ?? null;
	const selectedDaysOption =
		daysOptions.find((option) => option.value === String(plan?.daysPerWeek)) ??
		null;

	/** Resolve a plan from the duration / days pair, keeping the other half fixed */
	const selectPlan = (months: number) => {
		const candidates = (batch?.plans ?? []).filter(
			(item) =>
				item.durationMonths === months &&
				(!hasThreeDayPlans || item.daysPerWeek !== 2)
		);
		const nextPlan = candidates[0];

		if (nextPlan) setPlanId(nextPlan.id);
	};

	const onDurationChange = (value: string) => selectPlan(Number(value));
	const showScheduleTabs = !!plan && plan.daysPerWeek === 2 && batchWeekdays.length > 0;

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
					/>
				</div>
			)}

			{plan && daysOptions.length > 0 && (
				<div>
					<span className={styles.fieldLabel}>
						Number of days a week<span style={{ color: "#de350b" }}>*</span>
					</span>
					<Segmented
						value={selectedDaysOption?.value ?? ""}
						onChange={(value) => setDaysPerWeek(Number(value))}
						options={daysOptions}
					/>

					{showScheduleTabs && (
						<div className={styles.daySelector}>
							<span className={styles.daySelectorLabel}>
								Which days? (pick {plan.daysPerWeek})
							</span>
							<div className={styles.scheduleTabs}>
								{batchWeekdays.map((day) => (
									<button
										key={day}
										type="button"
										className={`${styles.scheduleTab} ${
											inputs.selectedWeekdays.includes(day)
												? styles.scheduleTabActive
												: ""
										}`}
										onClick={() => toggleSelectedWeekday(day)}
									>
										{formatWeekdayShort(day)}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			<div>
				<Select
					label="Registration Package"
					placeholder="None"
					options={registrationOptions}
					selectedOption={selectedRegistrationOption}
					onChange={(option) => setRegistrationOptionId(option.value)}
				/>
				{registrationOption && (
					<p className={styles.qrHint}>
						{registrationOption.name} - {formatRupees(registrationOption.price)}
					</p>
				)}
			</div>

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
					min={inputs.startDate}
					isError={false}
					errorMessage=""
					showClear={false}
					isDisabled={!plan}
					caption="Auto-filled | editable"
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
