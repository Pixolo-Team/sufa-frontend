// Predictions routes — EPL Score Predictor.
// GET  /predictions/:season/:gameweek  → saved picks for a gameweek
// POST /predictions/:season/:gameweek  → upsert one predictor's picks
// Body: { predictor: "abhay" | "harsh", picks: PredictionPick[] }
//
// 🟡 Scaffold: served from the in-memory store (same honesty as the operations
// seed). Swap for real DB queries against prediction_picks later. Response
// shapes stay identical so the frontend does not change.
import { Hono } from "hono";
import {
	getGameweekPredictions,
	savePredictorPredictions,
} from "../db/predictions.store";
import type { PredictionPick, PredictorId } from "../db/types";

export const predictionsRoute = new Hono();

const isPredictor = (value: unknown): value is PredictorId =>
	value === "abhay" || value === "harsh";

const isValidPick = (pick: unknown): pick is PredictionPick => {
	if (typeof pick !== "object" || pick === null) return false;
	const row = pick as Record<string, unknown>;
	return (
		typeof row.fixtureId === "number" &&
		typeof row.homeTeam === "string" &&
		typeof row.awayTeam === "string" &&
		typeof row.homeTla === "string" &&
		typeof row.awayTla === "string" &&
		typeof row.homeScore === "number" &&
		row.homeScore >= 0 &&
		row.homeScore <= 20 &&
		typeof row.awayScore === "number" &&
		row.awayScore >= 0 &&
		row.awayScore <= 20
	);
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

	if (!body || !isPredictor(body.predictor) || !Array.isArray(body.picks) || body.picks.length === 0) {
		return c.json({ error: "Body needs { predictor: 'abhay' | 'harsh', picks: [...] }" }, 400);
	}

	if (!body.picks.every(isValidPick)) {
		return c.json({ error: "Each pick needs fixtureId, team names + tla, scores 0-20" }, 400);
	}

	const saved = savePredictorPredictions(season, gameweek, body.predictor, body.picks);
	return c.json({ data: saved });
});
