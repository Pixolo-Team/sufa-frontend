// TYPES //
import type {
	OperationsBatchData,
	OperationsPlanData,
} from "@/types/operations";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Turn a `HH:mm` database time into `5:00 PM` */
export const formatTime = (value: string): string => {
	const [hours, minutes] = value.split(":").map(Number);

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

	const suffix = hours >= 12 ? "PM" : "AM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;

	return `${hour12}:${`${minutes}`.padStart(2, "0")} ${suffix}`;
};

/** `Mon / Wed / Fri` from JS day numbers */
export const formatWeekdays = (days: number[]): string =>
	days
		.slice()
		.sort((a, b) => a - b)
		.map((day) => WEEKDAY_SHORT[day])
		.join(" / ");

/**
 * The timings line for a batch, e.g. `Mon / Wed / Fri · 5:00 PM - 6:30 PM`.
 * Timings live on the batch because one center can run several.
 */
export const formatBatchTimings = (batch: OperationsBatchData): string =>
	`${formatWeekdays(batch.days)} · ${formatTime(batch.startTime)} - ${formatTime(
		batch.endTime
	)}`;

/** Standard plans show only the duration; 2-day plans keep the exception visible. */
export const formatPlanLabel = (plan: OperationsPlanData): string => {
	const durationLabel =
		plan.durationMonths === 1
			? "1 Month"
			: `${plan.durationMonths} Months`;

	return plan.daysPerWeek === 2
		? `${durationLabel} · ${plan.daysPerWeek} Days`
		: durationLabel;
};
