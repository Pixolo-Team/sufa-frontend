// TYPES //
import type { FeeBreakdownRowData, FeeQuoteData } from "@/types/operations";

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/** Inputs the month-by-month walk needs */
type FeeQuoteInput = {
	/** `yyyy-mm-dd` */
	startDate: string;
	/** `yyyy-mm-dd` */
	endDate: string;
	/** JS day numbers the batch runs sessions on (0 = Sunday) */
	sessionWeekdays: number[];
	/** Flat price of one full calendar month at this center for this plan */
	monthlyPrice: number;
	/** Stored per-session price for this center plan - never derived */
	perSessionPrice: number;
};

/**
 * Parse a `yyyy-mm-dd` string as a *local* date.
 * `new Date("2025-07-26")` parses as UTC and shifts a day behind IST, which
 * would drop or add a session at the month boundary.
 */
export const parseDateInput = (value: string): Date | null => {
	const [year, month, day] = value.split("-").map(Number);

	if (!year || !month || !day) return null;

	return new Date(year, month - 1, day);
};

/** Format a Date back into the `yyyy-mm-dd` an `<input type="date">` expects */
export const toDateInputValue = (date: Date): string => {
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${date.getFullYear()}-${month}-${day}`;
};

/** Human readable date for the UI, e.g. `26 Jul 2025` */
export const formatDisplayDate = (value: string): string => {
	const date = parseDateInput(value);

	if (!date) return "";

	return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

/** Last day of the month that `date` falls in */
const getLastDayOfMonth = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth() + 1, 0);

/**
 * Default end date (editable by staff) - docs/operations/02-fee-calculation.md
 * - Start on the 1st  → last day of that month.
 * - Start mid-month   → last day of the *next* month (partial joining month
 *   bundled with one full month).
 */
export const getDefaultEndDate = (startDate: string): string => {
	const start = parseDateInput(startDate);

	if (!start) return "";

	const monthOffset = start.getDate() === 1 ? 0 : 1;

	return toDateInputValue(
		new Date(start.getFullYear(), start.getMonth() + monthOffset + 1, 0)
	);
};

/** End date of a fixed multi-month plan that always starts on the 1st */
export const getFixedTermEndDate = (
	startDate: string,
	durationMonths: number
): string => {
	const start = parseDateInput(startDate);

	if (!start) return "";

	return toDateInputValue(
		new Date(start.getFullYear(), start.getMonth() + durationMonths, 0)
	);
};

/** Count the batch's session weekdays falling inside an inclusive date range */
const countSessionDays = (
	rangeStart: Date,
	rangeEnd: Date,
	sessionWeekdays: number[]
): number => {
	let count = 0;

	const cursor = new Date(rangeStart);

	while (cursor <= rangeEnd) {
		if (sessionWeekdays.includes(cursor.getDay())) count += 1;

		cursor.setDate(cursor.getDate() + 1);
	}

	return count;
};

/**
 * Walk every calendar month overlapping [start, end].
 * A month fully inside the range bills the flat price; a partial month bills
 * `session days in range × the stored per-session price`. No holiday
 * adjustment, and no rounding - both prices come from the database.
 */
export const calculateFeeQuote = ({
	startDate,
	endDate,
	sessionWeekdays,
	monthlyPrice,
	perSessionPrice,
}: FeeQuoteInput): FeeQuoteData | null => {
	const start = parseDateInput(startDate);
	const end = parseDateInput(endDate);

	// Nothing to bill for an incomplete or backwards range
	if (!start || !end || end < start) return null;

	const rows: FeeBreakdownRowData[] = [];
	let total = 0;
	let sessionCount = 0;

	// Start at the 1st of the starting month and step one month at a time
	const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

	while (cursor <= end) {
		const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
		const monthEnd = getLastDayOfMonth(cursor);

		// Clip the calendar month to the billed range
		const rangeStart = monthStart < start ? start : monthStart;
		const rangeEnd = monthEnd > end ? end : monthEnd;

		const monthLabel = `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;
		const isFullMonth =
			rangeStart.getTime() === monthStart.getTime() &&
			rangeEnd.getTime() === monthEnd.getTime();

		if (isFullMonth) {
			total += monthlyPrice;

			rows.push({
				id: monthLabel,
				label: monthLabel,
				detail: "Full month · flat price",
				amount: monthlyPrice,
				isFullMonth: true,
			});
		} else {
			const sessions = countSessionDays(rangeStart, rangeEnd, sessionWeekdays);
			const amount = sessions * perSessionPrice;

			total += amount;
			sessionCount += sessions;

			rows.push({
				id: monthLabel,
				label: `${rangeStart.getDate()}-${rangeEnd.getDate()} ${MONTH_NAMES[cursor.getMonth()]}`,
				detail: `${sessions} × ₹${perSessionPrice} · part month`,
				amount,
				isFullMonth: false,
			});
		}

		cursor.setMonth(cursor.getMonth() + 1);
	}

	return { rows, total, sessionCount };
};

/** Format an amount the way staff read it out, e.g. `₹3,970` */
export const formatRupees = (amount: number): string =>
	`₹${amount.toLocaleString("en-IN")}`;
