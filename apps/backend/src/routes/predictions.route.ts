// Predictions routes — EPL Score Predictor.
// GET  /predictions/:season/:gameweek  → saved round snapshots for a gameweek
// POST /predictions/:season/:gameweek  → upsert one predictor's matchday JSON
// Body: { predictor: "abhay" | "harsh", round: SavedRound }
//
// 🟡 Scaffold: served from the in-memory store (same honesty as the operations
// seed). Swap for real DB queries against gameweek_predictions later. Response
// shapes stay identical so the frontend does not change.
import { Hono } from "hono";
import {
	getGameweekPredictions,
	savePredictorPredictions,
} from "../db/predictions.store";
import type { PredictorId, SavedRound } from "../db/types";

export const predictionsRoute = new Hono();

const isPredictor = (value: unknown): value is PredictorId =>
	value === "abhay" || value === "harsh";

const isValidScore = (value: unknown): boolean =>
	value === null ||
	(typeof value === "number" &&
		Number.isInteger(value) &&
		value >= 0 &&
		value <= 20);

const isValidRound = (round: unknown): round is SavedRound => {
	if (typeof round !== "object" || round === null) return false;
	const row = round as Record<string, unknown>;
	if (typeof row.name !== "string" || !Array.isArray(row.matches)) return false;

	return (row.matches as unknown[]).every((match) => {
		if (typeof match !== "object" || match === null) return false;
		const item = match as Record<string, unknown>;
		return (
			typeof item.date === "string" &&
			(item.time === undefined || typeof item.time === "string") &&
			typeof item.team1 === "string" &&
			typeof item.team2 === "string" &&
			isValidScore(item.predictedHome) &&
			isValidScore(item.predictedAway)
		);
	});
};

predictionsRoute.get("/:season/:gameweek", (c) => {
	const season = Number(c.req.param("season"));
	const gameweek = Number(c.req.param("gameweek"));

	if (!Number.isInteger(season) || !Number.isInteger(gameweek) || gameweek < 1 || gameweek > 38) {
		return c.json({ error: "Invalid season or gameweek (1-38)" }, 400);
	}

	return c.json({ data: getGameweekPredictions(season, gameweek) });
});

predictionsRoute.post("/:season/:gameweek", async (c) => {
	const season = Number(c.req.param("season"));
	const gameweek = Number(c.req.param("gameweek"));

	if (!Number.isInteger(season) || !Number.isInteger(gameweek) || gameweek < 1 || gameweek > 38) {
		return c.json({ error: "Invalid season or gameweek (1-38)" }, 400);
	}

	const body = await c.req.json().catch(() => null);

	if (!body || !isPredictor(body.predictor) || !isValidRound(body.round)) {
		return c.json({ error: "Body needs { predictor: 'abhay' | 'harsh', round: { name, matches: [...] } }" }, 400);
	}

	const saved = savePredictorPredictions(season, gameweek, body.predictor, body.round);
	return c.json({ data: saved });
});
