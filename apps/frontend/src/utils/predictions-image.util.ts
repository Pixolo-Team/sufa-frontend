// TYPES //
import type {
	FixtureData,
	PredictionPickData,
	PredictorId,
} from "@/types/predictions";

// DATA //
import { PREDICTORS } from "@/data/predictions.data";

const WIDTH = 1080;
const HEIGHT = 1350;
const PADDING = 64;

const BG = "#101c33";
const CARD = "#1a2c4e";
const INK = "#ffffff";
const MUTED = "#93a1bd";

type PredictionsImageInput = {
	season: number;
	gameweek: number;
	/** Kickoff-sorted fixtures - defines row order */
	fixtures: FixtureData[];
	predictions: { predictor: PredictorId; picks: PredictionPickData[] }[];
};

const scoreText = (pick: PredictionPickData | undefined): string =>
	pick ? `${pick.homeScore} - ${pick.awayScore}` : "- : -";

/** Same-origin badges load clean - a failed one resolves null (TLA fallback). */
const loadImage = (src: string): Promise<HTMLImageElement | null> =>
	new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = src;
	});

/**
 * Instagram-ready 4:5 portrait (1080x1350) PNG: GW header + two columns
 * (Abhay | Harsh) with every fixture's predicted score. Text-only - no
 * remote crests, so the canvas never gets tainted.
 */
export const renderPredictionsImage = async ({
	season,
	gameweek,
	fixtures,
	predictions,
}: PredictionsImageInput): Promise<Blob | null> => {
	if (document.fonts?.ready) await document.fonts.ready;

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) return null;

	const body = '"Montserrat Variable", "Montserrat", system-ui, sans-serif';
	const scale = 2;
	canvas.width = WIDTH * scale;
	canvas.height = HEIGHT * scale;
	context.scale(scale, scale);

	const byPredictor = new Map(
		predictions.map((item) => [item.predictor, new Map(item.picks.map((pick) => [pick.fixtureId, pick]))])
	);

	// Preload each club badge once - local files, so the canvas never taints.
	const badgeUrls = [...new Set(fixtures.flatMap((f) => [f.homeLogo, f.awayLogo]))];
	const badgeEntries = await Promise.all(
		badgeUrls.map(async (url) => [url, await loadImage(url)] as const)
	);
	const badges = new Map<string, HTMLImageElement | null>(badgeEntries);

	// Background
	context.fillStyle = BG;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	// Top accent bar
	context.fillStyle = "#16db93";
	context.fillRect(0, 0, WIDTH, 10);

	let y = 108;

	// Eyebrow
	context.fillStyle = MUTED;
	context.font = `700 26px ${body}`;
	context.textAlign = "center";
	context.fillText(`PREMIER LEAGUE  •  ${season}/${String(season + 1).slice(2)}`, WIDTH / 2, y);
	y += 84;

	// Title
	context.fillStyle = INK;
	context.font = `800 88px ${body}`;
	context.fillText(`GAMEWEEK ${gameweek}`, WIDTH / 2, y);
	y += 52;

	context.fillStyle = MUTED;
	context.font = `500 30px ${body}`;
	context.fillText("Score Predictions", WIDTH / 2, y);
	y += 62;

	// Predictor column headers
	const gutter = 24;
	const columnWidth = (WIDTH - PADDING * 2 - gutter) / 2;
	const leftX = PADDING;
	const rightX = PADDING + columnWidth + gutter;

	PREDICTORS.forEach((predictor, index) => {
		const x = index === 0 ? leftX : rightX;
		context.fillStyle = CARD;
		context.strokeStyle = predictor.color;
		context.lineWidth = 3;
		const headerY = y;
		const headerH = 76;
		context.beginPath();
		context.roundRect(x, headerY, columnWidth, headerH, 18);
		context.fill();
		context.stroke();
		context.fillStyle = predictor.color;
		context.font = `800 34px ${body}`;
		context.fillText(predictor.label.toUpperCase(), x + columnWidth / 2, headerY + 49);
	});

	y += 76 + 20;

	// Fixture rows - both columns share the same row rhythm
	const rowH = 78;
	const rowsHeight = fixtures.length * rowH;

	// Card behind rows
	context.fillStyle = CARD;
	context.beginPath();
	context.roundRect(PADDING, y - 14, WIDTH - PADDING * 2, rowsHeight + 28, 22);
	context.fill();

	PREDICTORS.forEach((predictor, index) => {
		const x = index === 0 ? leftX : rightX;
		const picks = byPredictor.get(predictor.id);

		fixtures.forEach((fixture, row) => {
			const rowY = y + row * rowH + 50;
			const centerX = x + columnWidth / 2;

			// Subtle zebra stripe behind even rows
			if (row % 2 === 1) {
				context.fillStyle = "rgba(255, 255, 255, 0.03)";
				context.beginPath();
				context.roundRect(x + 10, y + row * rowH + 4, columnWidth - 20, rowH - 8, 12);
				context.fill();
			}
			const badgeSize = 32;
			const gapScore = 12;
			const gapBadge = 8;

			// Score centered, names outside-in: Arsenal [badge] 2 - 1 [badge] Chelsea.
			// Unpicked rows render dimmed so saved scores stand out.
			const pick = picks?.get(fixture.id);
			const score = scoreText(pick);
			context.font = `800 28px ${body}`;
			const scoreHalf = Math.max(context.measureText(score).width / 2, 44);

			context.fillStyle = pick ? INK : MUTED;
			context.textAlign = "center";
			context.fillText(score, centerX, rowY);

			// Exact room for names, derived from the real geometry - nothing
			// may cross the card edges.
			const nameBudget =
				columnWidth / 2 - (scoreHalf + gapScore + badgeSize + gapBadge) - 12;

			const drawSide = (name: string, logo: string, side: -1 | 1) => {
				let size = 21;
				context.font = `600 ${size}px ${body}`;
				while (context.measureText(name).width > nameBudget && size > 13) {
					size -= 1;
					context.font = `600 ${size}px ${body}`;
				}

				const badgeX =
					side === -1
						? centerX - scoreHalf - gapScore - badgeSize
						: centerX + scoreHalf + gapScore;
				const badge = badges.get(logo);

				if (badge) {
					context.drawImage(badge, badgeX, rowY - 26, badgeSize, badgeSize);
				}

				context.fillStyle = INK;
				context.textAlign = side === -1 ? "right" : "left";
				context.fillText(
					name,
					side === -1 ? badgeX - gapBadge : badgeX + badgeSize + gapBadge,
					rowY
				);
			};

			drawSide(fixture.homeTeam, fixture.homeLogo, -1);
			drawSide(fixture.awayTeam, fixture.awayLogo, 1);
		});
	});

	y += rowsHeight + 14 + 56;

	// Footer
	context.fillStyle = MUTED;
	context.font = `600 26px ${body}`;
	context.textAlign = "center";
	context.fillText("EXTRA TOUCHES", WIDTH / 2, y);

	return new Promise((resolve) =>
		canvas.toBlob((blob) => resolve(blob), "image/png")
	);
};
