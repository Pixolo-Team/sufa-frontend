// TYPES //
import type {
	OperationsBatchData,
	OperationsBatchTimingData,
	OperationsPlanData,
} from "@/types/operations";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LONG = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

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
	Array.from(new Set(days))
		.sort((a, b) => a - b)
		.map((day) => WEEKDAY_SHORT[day])
		.join(" / ");

/** One readable slot, e.g. `Monday 6:00 PM - 7:00 PM`. */
export const formatTimingSlot = (
	slot: OperationsBatchTimingData,
	useShortDay = false
): string =>
	`${useShortDay ? WEEKDAY_SHORT[slot.day] : WEEKDAY_LONG[slot.day]} ${formatTime(
		slot.startTime
	)} - ${formatTime(slot.endTime)}`;

/**
 * The timings line for a batch, e.g. `Mon 6:00 PM - 7:00 PM | Wed 7:00 PM - 8:00 PM`.
 * Timings live on the batch because one center can run several.
 */
export const formatBatchTimings = (batch: OperationsBatchData): string =>
	batch.schedule
		.slice()
		.sort((left, right) => left.day - right.day)
		.map((slot) => formatTimingSlot(slot, true))
		.join(" | ");

/** Long-form schedule lines for cards, previews and messages. */
export const formatBatchTimingLines = (batch: OperationsBatchData): string[] =>
	batch.schedule
		.slice()
		.sort((left, right) => left.day - right.day)
		.map((slot) => formatTimingSlot(slot));

/** Unique weekdays available in a batch. */
export const getBatchWeekdays = (batch: OperationsBatchData): number[] =>
	Array.from(new Set(batch.schedule.map((slot) => slot.day))).sort(
		(left, right) => left - right
	);

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
