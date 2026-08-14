// TYPES //
import type {
	OperationsBatchData,
	OperationsBatchTimingData,
	OperationsPlanData,
} from "@/types/operations";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const STATIC_BATCH_IMAGES_BY_BATCH: Record<string, string> = {
	foundation: "/images/operations/foundation-ghatkopar-east.png",
	grassroot: "/images/operations/grassroot-ghatkopar-east.png",
	youth: "/images/operations/youth-ghatkopar-east.png",
	performance: "/images/operations/performance-ghatkopar-east.png",
};

/** Turn a `HH:mm` database time into `5:00 PM` */
const formatTime = (value: string): string => {
	const [hours, minutes] = value.split(":").map(Number);

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

	const suffix = hours >= 12 ? "PM" : "AM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;

	return `${hour12}:${`${minutes}`.padStart(2, "0")} ${suffix}`;
};

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

/** `HH:mm` to minutes-since-midnight. */
const parseTimeToMinutes = (value: string): number => {
	const [hours, minutes] = value.split(":").map(Number);

	return hours * 60 + minutes;
};

/** Session length between two `HH:mm` times, e.g. `60 min` or `1.5 hr`. */
export const formatSessionDuration = (startTime: string, endTime: string): string => {
	const minutes = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);

	if (minutes <= 0) return "";
	if (minutes % 60 === 0) return `${minutes / 60} hr`;

	return `${minutes} min`;
};

export const formatBatchScheduleGrid = (batch: OperationsBatchData) =>
	batch.schedule
		.slice()
		.sort((left, right) => left.day - right.day)
		.map((slot) => ({
			day: WEEKDAY_SHORT[slot.day],
			time: formatTime(slot.startTime),
			duration: formatSessionDuration(slot.startTime, slot.endTime),
		}));

/** Unique weekdays available in a batch. */
export const getBatchWeekdays = (batch: OperationsBatchData): number[] =>
	Array.from(new Set(batch.schedule.map((slot) => slot.day))).sort(
		(left, right) => left - right
	);

export const formatWeekdayShort = (day: number): string =>
	WEEKDAY_SHORT[day] ?? String(day);

export const getStaticBatchImageSrc = (batchName: string): string | undefined => {
	const normalizedBatchName = batchName.toLowerCase();
	const batchImageKey = Object.keys(STATIC_BATCH_IMAGES_BY_BATCH).find((key) =>
		normalizedBatchName.includes(key)
	);

	return batchImageKey ? STATIC_BATCH_IMAGES_BY_BATCH[batchImageKey] : undefined;
};

const DIGIT_KEYCAPS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

/** WhatsApp share bullet for a plan duration - keycap digit, 🔟, or 📅 beyond that. */
export const formatDurationEmoji = (months: number): string => {
	if (months >= 0 && months <= 9) return DIGIT_KEYCAPS[months];
	if (months === 10) return "🔟";

	return "📅";
};

export const SHARE_DIVIDER = "─".repeat(20);
// Shorter than SHARE_DIVIDER so WhatsApp renders it as one solid bar instead
// of wrapping onto a second line with a gap.
const SHARE_HEAVY_RULE = "━".repeat(20);

/** Letterhead framing the academy name at the top of every WhatsApp share. */
export const buildShareLetterheadLines = (academyName: string): string[] => [
	`⚽ *${academyName.toUpperCase()}*`,
	SHARE_HEAVY_RULE,
];

/** Closing sign-off shown at the bottom of every WhatsApp share. */
export const buildShareFooterLines = (): string[] => [
	SHARE_DIVIDER,
	"✨ _For queries, just reply to this message!_ ✨",
];

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
