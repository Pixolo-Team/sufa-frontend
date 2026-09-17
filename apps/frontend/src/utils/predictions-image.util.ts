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
const LINE = "#2b3f66";

type PredictionsImageInput = {
	season: number;
	gameweek: number;
	/** Kickoff-sorted fixtures — defines row order */
	fixtures: FixtureData[];
	predictions: { predictor: PredictorId; picks: PredictionPickData[] }[];
};

const scoreText = (pick: PredictionPickData | undefined): string =>
	pick ? `${pick.homeScore} - ${pick.awayScore}` : "- : -";

/**
 * Instagram-ready 4:5 portrait (1080x1350) PNG: GW header + two columns
 * (Abhay | Harsh) with every fixture's predicted score. Text-only — no
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

	// Fixture rows — both columns share the same row rhythm
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

			context.font = `700 28px ${body}`;
			context.fillStyle = MUTED;
			// Home TLA right-aligned, away TLA left-aligned around the score
			context.textAlign = "right";
			context.fillText(fixture.homeTla, centerX - 78, rowY);
			context.textAlign = "left";
			context.fillText(fixture.awayTla, centerX + 78, rowY);

			context.fillStyle = INK;
			context.font = `800 32px ${body}`;
			context.textAlign = "center";
			context.fillText(scoreText(picks?.get(fixture.id)), centerX, rowY);

			// Divider between rows
			if (row < fixtures.length - 1) {
				context.strokeStyle = LINE;
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(x + 28, y + (row + 1) * rowH);
				context.lineTo(x + columnWidth - 28, y + (row + 1) * rowH);
				context.stroke();
			}
		});
	});

	y += rowsHeight + 14 + 56;

	// Footer
	context.fillStyle = MUTED;
	context.font = `600 26px ${body}`;
	context.textAlign = "center";
	context.fillText("SKOROST UNITED  •  SCORE PREDICTOR", WIDTH / 2, y);

	return new Promise((resolve) =>
		canvas.toBlob((blob) => resolve(blob), "image/png")
	);
};
