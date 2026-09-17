// DUMMY predictions store — same pattern as operations seed data.
// The scaffold route keeps one round snapshot per predictor in memory until
// Postgres is wired (see gameweek_predictions in docs/operations/schema.sql).
// Replace with real DB queries later.

import type {
	GameweekPredictions,
	PredictorId,
	PredictorRound,
	SavedRound,
} from "./types";

const store = new Map<string, PredictorRound[]>();

const key = (season: number, gameweek: number) => `${season}:${gameweek}`;

export const getGameweekPredictions = (
	season: number,
	gameweek: number
): GameweekPredictions => ({
	season,
	gameweek,
	predictions: store.get(key(season, gameweek)) ?? [],
});

/** Upsert one predictor's full matchday JSON for a gameweek. */
export const savePredictorPredictions = (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	round: SavedRound
): PredictorRound => {
	const existing = store.get(key(season, gameweek)) ?? [];
	const saved: PredictorRound = { predictor, round };

	store.set(
		key(season, gameweek),
		[...existing.filter((item) => item.predictor !== predictor), saved].sort((a, b) =>
			a.predictor.localeCompare(b.predictor)
		)
	);

	return saved;
};
