// TYPES //
import type {
	OperationsBatchData,
	OperationsCenterData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import {
	formatBatchTimingLines,
	formatPlanLabel,
} from "@/utils/operations.util";

const WIDTH = 1080;
const PADDING = 72;
const LOGO_SRC = "/images/skorost.svg";

const INK = "#172b4d";
const MUTED = "#6b7a90";
const LINE = "#e5e9f0";
const ACCENT = "#16db93";

/** Which blocks to draw - staff share fees, timings, or both */
export type FeeStructureImageSections = {
	plans?: boolean;
	registration?: boolean;
	schedule?: boolean;
};

type FeeStructureImageInput = {
	academyName: string;
	center: OperationsCenterData;
	batch: OperationsBatchData;
	registrationOptions: OperationsRegistrationOptionData[];
	sections?: FeeStructureImageSections;
};

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
	new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = src;
	});

const wrapText = (
	context: CanvasRenderingContext2D,
	text: string,
	maxWidth: number
): string[] => {
	const lines: string[] = [];
	let line = "";

	for (const word of text.split(" ")) {
		const candidate = line ? `${line} ${word}` : word;

		if (context.measureText(candidate).width > maxWidth && line) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}

	if (line) lines.push(line);

	return lines;
};

export const renderFeeStructureImage = async ({
	academyName,
	center,
	batch,
	registrationOptions,
	sections,
}: FeeStructureImageInput): Promise<Blob | null> => {
	const showPlans = sections?.plans ?? true;
	const showSchedule = sections?.schedule ?? true;
	const showRegistration = sections?.registration ?? true;

	if (document.fonts?.ready) await document.fonts.ready;

	const logo = await loadImage(LOGO_SRC);
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) return null;

	const body = '"Montserrat Variable", "Montserrat", system-ui, sans-serif';
	const contentWidth = WIDTH - PADDING * 2;

	context.font = `400 26px ${body}`;
	const addressLines = wrapText(context, center.address, contentWidth - 150);
	const scheduleLines = formatBatchTimingLines(batch);
	const registrationLines = showRegistration
		? registrationOptions.map(
				(item) => `${item.name}: ${formatRupees(item.price)}`
			)
		: [];

	// Mirrors the draw order below: each omitted block gives back its heading
	// allowance too, so a schedule-only card is not mostly whitespace.
	const height =
		620 +
		(showPlans ? batch.plans.length * 86 : -62) +
		(registrationLines.length > 0 ? registrationLines.length * 46 : -62) +
		addressLines.length * 38 +
		(showSchedule ? scheduleLines.length * 38 : -38) +
		190;

	const scale = 2;
	canvas.width = WIDTH * scale;
	canvas.height = height * scale;
	context.scale(scale, scale);

	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, WIDTH, height);

	context.fillStyle = ACCENT;
	context.fillRect(0, 0, WIDTH, 10);

	let y = 96;

	if (logo) {
		const logoHeight = 62;
		const logoWidth = (logo.width / logo.height) * logoHeight;

		context.drawImage(logo, PADDING, y, logoWidth, logoHeight);
		y += logoHeight + 46;
	} else {
		context.fillStyle = INK;
		context.font = `700 40px ${body}`;
		context.fillText(academyName, PADDING, y + 40);
		y += 96;
	}

	context.fillStyle = MUTED;
	context.font = `700 22px ${body}`;
	context.fillText(
		showPlans ? (showSchedule ? "FEES & SCHEDULE" : "FEE STRUCTURE") : "SCHEDULE",
		PADDING,
		y
	);
	y += 56;

	context.fillStyle = INK;
	context.font = `800 54px ${body}`;
	context.fillText(center.name, PADDING, y);
	y += 48;

	context.font = `600 30px ${body}`;
	context.fillText(`${batch.name} (${batch.ageGroup})`, PADDING, y);
	y += 40;

	context.strokeStyle = LINE;
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(PADDING, y);
	context.lineTo(WIDTH - PADDING, y);
	context.stroke();
	y += 62;

	if (showPlans) {
		for (const plan of batch.plans) {
			context.fillStyle = INK;
			context.font = `500 30px ${body}`;
			context.fillText(formatPlanLabel(plan), PADDING, y);

			const price = formatRupees(plan.price);

			context.font = `800 34px ${body}`;
			context.textAlign = "right";
			context.fillText(price, WIDTH - PADDING, y);
			context.textAlign = "left";

			y += 30;
			context.strokeStyle = LINE;
			context.beginPath();
			context.moveTo(PADDING, y);
			context.lineTo(WIDTH - PADDING, y);
			context.stroke();
			y += 56;
		}
	}

	if (registrationLines.length > 0) {
		context.fillStyle = MUTED;
		context.font = `700 22px ${body}`;
		context.fillText("REGISTRATION", PADDING, y);
		y += 42;

		for (const line of registrationLines) {
			context.fillStyle = INK;
			context.font = `400 26px ${body}`;
			context.fillText(line, PADDING, y);
			y += 38;
		}

		y += 20;
	}

	context.fillStyle = MUTED;
	context.font = `700 22px ${body}`;
	context.fillText("ADDRESS", PADDING, y);

	context.fillStyle = INK;
	context.font = `400 26px ${body}`;

	for (const line of addressLines) {
		y += 38;
		context.fillText(line, PADDING, y);
	}

	y += 58;

	if (showSchedule) {
		context.fillStyle = MUTED;
		context.font = `700 22px ${body}`;
		context.fillText("SCHEDULE", PADDING, y);

		for (const line of scheduleLines) {
			y += 38;
			context.fillStyle = INK;
			context.font = `400 26px ${body}`;
			context.fillText(line, PADDING, y);
		}
	}

	const footerHeight = 96;
	context.fillStyle = "#f4f6f9";
	context.fillRect(0, height - footerHeight, WIDTH, footerHeight);

	context.fillStyle = MUTED;
	context.font = `500 24px ${body}`;
	context.fillText(academyName, PADDING, height - footerHeight / 2 + 9);

	return new Promise((resolve) =>
		canvas.toBlob((blob) => resolve(blob), "image/png")
	);
};
