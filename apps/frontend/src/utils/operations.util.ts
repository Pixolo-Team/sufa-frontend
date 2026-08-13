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
const STATIC_BATCH_IMAGES = [
	"/images/operations/ghatkopar-east-foundation.png",
	"/images/operations/ghatkopar-east-grassroot.png",
	"/images/operations/ghatkopar-west-performance.png",
];

/** Turn a `HH:mm` database time into `5:00 PM` */
const formatTime = (value: string): string => {
	const [hours, minutes] = value.split(":").map(Number);

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

	const suffix = hours >= 12 ? "PM" : "AM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;

	return `${hour12}:${`${minutes}`.padStart(2, "0")} ${suffix}`;
};

/** One readable slot, e.g. `Monday 6:00 PM - 7:00 PM`. */
const formatTimingSlot = (
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

/** WhatsApp share line for one slot, e.g. `MON 🕕 6:00 PM – 7:00 PM`. */
const formatTimingShareLine = (slot: OperationsBatchTimingData): string =>
	`${WEEKDAY_SHORT[slot.day].toUpperCase()} 🕕 ${formatTime(
		slot.startTime
	)} – ${formatTime(slot.endTime)}`;

/** Schedule lines for the WhatsApp share text. */
export const formatBatchTimingLines = (batch: OperationsBatchData): string[] =>
	batch.schedule
		.slice()
		.sort((left, right) => left.day - right.day)
		.map((slot) => formatTimingShareLine(slot));

export const formatBatchScheduleGrid = (batch: OperationsBatchData) =>
	batch.schedule
		.slice()
		.sort((left, right) => left.day - right.day)
		.map((slot) => ({
			day: WEEKDAY_SHORT[slot.day],
			time: formatTime(slot.startTime),
			endTime: formatTime(slot.endTime),
		}));

/** Unique weekdays available in a batch. */
export const getBatchWeekdays = (batch: OperationsBatchData): number[] =>
	Array.from(new Set(batch.schedule.map((slot) => slot.day))).sort(
		(left, right) => left - right
	);

export const formatWeekdayShort = (day: number): string =>
	WEEKDAY_SHORT[day] ?? String(day);

export const getStaticBatchImageSrc = (batchIndex: number): string =>
	STATIC_BATCH_IMAGES[batchIndex % STATIC_BATCH_IMAGES.length];

const DIGIT_KEYCAPS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

/** WhatsApp share bullet for a plan duration - keycap digit, 🔟, or 📅 beyond that. */
export const formatDurationEmoji = (months: number): string => {
	if (months >= 0 && months <= 9) return DIGIT_KEYCAPS[months];
	if (months === 10) return "🔟";

	return "📅";
};

/** Standard plans show only the duration; 2-day plans keep the exception visible. */
export const formatPlanLabel = (plan: OperationsPlanData): string => {
	const durationLabel =
		plan.durationMonths === 1
			? "1 Month"
			: `${plan.durationMonths} Months`;

	return plan.daysPerWeek === 2
		? `${durationLabel} · ${plan.daysPerWeek} Days a Week`
		: durationLabel;
};
