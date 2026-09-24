// TYPES //
import type { SeniorStandingRow } from "@/types/senior-seasons";
import { HIGHLIGHT_TEAM } from "@/types/senior-seasons";

const WIDTH = 1080;
const HEIGHT = 1920;
const PADDING = 64;

const BG = "#0b2b1e";
const CARD = "#123a29";
const INK = "#ffffff";
const MUTED = "#9db8a9";
const ACCENT = "#16db93";
const HIGHLIGHT_INK = "#04140b";

const ZIZO_LOGO = "/images/zizo-logo.svg";
const PIXOLO_LOGO = "/images/pixolo-logo.svg";

type StandingsImageInput = {
	seasonLabel: string;
	rows: SeniorStandingRow[];
};

/** Same-origin SVGs rasterise clean, so the canvas never gets tainted. */
const loadImage = (src: string): Promise<HTMLImageElement | null> =>
	new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = src;
	});

const formatGd = (value: number): string =>
	value > 0 ? `+${value}` : String(value);

/**
 * Instagram story (1080x1920) PNG: GROUP STANDING over the computed rows,
 * Skorost United highlighted, Zizo + Pixolo lockup at the bottom.
 */
export const renderStandingsImage = async ({
	seasonLabel,
	rows,
}: StandingsImageInput): Promise<Blob | null> => {
	if (document.fonts?.ready) await document.fonts.ready;

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) return null;

	const body = '"Montserrat Variable", "Montserrat", system-ui, sans-serif';
	const scale = 2;
	canvas.width = WIDTH * scale;
	canvas.height = HEIGHT * scale;
	context.scale(scale, scale);

	const [zizo, pixolo] = await Promise.all([loadImage(ZIZO_LOGO), loadImage(PIXOLO_LOGO)]);

	// Background + top accent bar
	context.fillStyle = BG;
	context.fillRect(0, 0, WIDTH, HEIGHT);
	context.fillStyle = ACCENT;
	context.fillRect(0, 0, WIDTH, 10);

	let y = 150;

	// Eyebrow
	context.fillStyle = MUTED;
	context.font = `700 28px ${body}`;
	context.textAlign = "center";
	context.fillText("SKOROST UNITED", WIDTH / 2, y);
	y += 52;
	context.font = `600 26px ${body}`;
	context.fillText(seasonLabel.toUpperCase(), WIDTH / 2, y);
	y += 104;

	// Title
	context.fillStyle = INK;
	context.font = `800 92px ${body}`;
	context.fillText("GROUP", WIDTH / 2, y);
	y += 100;
	context.fillText("STANDING", WIDTH / 2, y);
	y += 90;

	// Table geometry: slim stat columns leave room for long club names.
	const tableW = WIDTH - PADDING * 2;
	const posW = 64;
	const statW = 62;
	const statCount = 8;
	const teamW = tableW - posW - statW * statCount;
	const headerH = 64;
	const rowH = 86;

	// Header
	context.fillStyle = CARD;
	context.beginPath();
	context.roundRect(PADDING, y, tableW, headerH, 16);
	context.fill();
	context.fillStyle = MUTED;
	context.font = `700 25px ${body}`;

	const stats: { key: keyof SeniorStandingRow; label: string }[] = [
		{ key: "played", label: "P" },
		{ key: "won", label: "W" },
		{ key: "drawn", label: "D" },
		{ key: "lost", label: "L" },
		{ key: "goalsFor", label: "GF" },
		{ key: "goalsAgainst", label: "GA" },
		{ key: "goalDifference", label: "GD" },
		{ key: "points", label: "PTS" },
	];

	context.textAlign = "center";
	context.fillText("#", PADDING + posW / 2, y + 42);
	stats.forEach((stat, index) => {
		context.fillText(
			stat.label,
			PADDING + posW + teamW + statW * index + statW / 2,
			y + 42
		);
	});

	y += headerH + 12;

	rows.forEach((row, index) => {
		const rowY = y + index * rowH;
		const isHighlight = row.team === HIGHLIGHT_TEAM;

		if (isHighlight) {
			context.fillStyle = ACCENT;
			context.beginPath();
			context.roundRect(PADDING, rowY, tableW, rowH - 10, 16);
			context.fill();
		} else if (index % 2 === 1) {
			context.fillStyle = "rgba(255, 255, 255, 0.03)";
			context.beginPath();
			context.roundRect(PADDING, rowY, tableW, rowH - 10, 16);
			context.fill();
		}

		const textColor = isHighlight ? HIGHLIGHT_INK : INK;
		const baseline = rowY + 53;

		context.fillStyle = isHighlight ? HIGHLIGHT_INK : MUTED;
		context.font = `700 26px ${body}`;
		context.textAlign = "center";
		context.fillText(String(index + 1), PADDING + posW / 2, baseline);

		// Shrink long club names until they fit their column.
		let teamSize = 32;
		context.font = `700 ${teamSize}px ${body}`;
		while (context.measureText(row.team.toUpperCase()).width > teamW - 24 && teamSize > 18) {
			teamSize -= 1;
			context.font = `700 ${teamSize}px ${body}`;
		}
		context.fillStyle = textColor;
		context.textAlign = "left";
		context.fillText(row.team.toUpperCase(), PADDING + posW + 12, baseline);

		context.font = `700 28px ${body}`;
		context.textAlign = "center";
		const values = [
			row.played,
			row.won,
			row.drawn,
			row.lost,
			row.goalsFor,
			row.goalsAgainst,
			formatGd(row.goalDifference),
			row.points,
		];
		values.forEach((value, statIndex) => {
			context.fillText(
				String(value),
				PADDING + posW + teamW + statW * statIndex + statW / 2,
				baseline
			);
		});
	});

	// Footer lockup: Zizo + Pixolo side by side, text fallback if a logo fails.
	const footerY = HEIGHT - 190;
	context.fillStyle = MUTED;
	context.font = `600 24px ${body}`;
	context.textAlign = "center";
	context.fillText("POWERED BY", WIDTH / 2, footerY);

	const logoH = 64;
	const gap = 72;
	const zizoW = zizo ? (logoH * zizo.width) / zizo.height : 0;
	const pixoloW = pixolo ? (logoH * pixolo.width) / pixolo.height : 0;

	if (zizoW === 0 && pixoloW === 0) {
		context.fillStyle = INK;
		context.font = `800 40px ${body}`;
		context.fillText("ZIZO  •  PIXOLO", WIDTH / 2, footerY + 72);
	} else {
		const totalW = zizoW + pixoloW + (zizoW > 0 && pixoloW > 0 ? gap : 0);
		let logoX = WIDTH / 2 - totalW / 2;
		const logoY = footerY + 28;

		if (zizo && zizoW > 0) {
			context.drawImage(zizo, logoX, logoY, zizoW, logoH);
			logoX += zizoW + gap;
		}
		if (pixolo && pixoloW > 0) {
			context.drawImage(pixolo, logoX, logoY, pixoloW, logoH);
		}
	}

	return new Promise((resolve) =>
		canvas.toBlob((blob) => resolve(blob), "image/png")
	);
};
