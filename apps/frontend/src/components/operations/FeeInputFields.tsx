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
import Segmented from "./Segmented";

// HOOKS //
import { WEEKDAY_LABELS, type useFeeInputs } from "./use-fee-inputs";

// UTILS //
import { formatBatchTimings } from "@/utils/operations.util";

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
		isFixedTerm,
		billedWeekdays,
		setBatchId,
		setStartDate,
		setEndDate,
		setDurationMonths,
		setDaysPerWeek,
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

	const selectedCenterOption =
		centerOptions.find((option) => option.value === center?.id) ?? null;
	const selectedBatchOption =
		batchOptions.find((option) => option.value === batch?.id) ?? null;

	const canPickDays = !!batch && inputs.daysPerWeek < batch.days.length;
	const hasBatchChoice = batchOptions.length > 1;

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

			{hasBatchChoice ? (
				<Select
					label="Batch"
					placeholder="Select batch"
					options={batchOptions}
					selectedOption={selectedBatchOption}
					caption={batch ? formatBatchTimings(batch) : ""}
					isRequired
					onChange={(option) => setBatchId(option.value)}
				/>
			) : (
				batch && (
					<div className={styles.inlineInfo}>
						<span className={styles.fieldLabel}>Timing</span>
						<p className={styles.inlineInfoText}>{formatBatchTimings(batch)}</p>
					</div>
				)
			)}

			<Segmented
				label="Plan"
				value={inputs.durationMonths}
				onChange={setDurationMonths}
				options={[
					{ label: "1 Month", value: 1 },
					{ label: "3 Months", value: 3 },
				]}
			/>

			<Segmented
				label="Days / week"
				value={inputs.daysPerWeek}
				onChange={setDaysPerWeek}
				options={[
					{ label: "3 days", value: 3 },
					{ label: "2 days", value: 2 },
				]}
			/>

			{canPickDays && (
				<div>
					<span className={styles.fieldLabel}>
						Which days? (pick {inputs.daysPerWeek})
					</span>
					<div className={styles.dayChips}>
						{batch.days.map((weekday) => (
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
					isDisabled={isFixedTerm}
					caption={isFixedTerm ? "Fixed term" : "Auto-filled · editable"}
					onChange={setEndDate}
					onClear={() => setEndDate("")}
				/>
			</div>

			{center && !plan && (
				<p className={styles.notice}>
					{center.name} has no {inputs.durationMonths} month · {inputs.daysPerWeek} day
					plan. Pick another combination.
				</p>
			)}
		</div>
	);
};

export default FeeInputFields;
