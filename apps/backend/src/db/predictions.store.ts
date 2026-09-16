// DUMMY predictions store — same pattern as operations seed data.
// The scaffold route keeps picks in memory until Postgres is wired
// (see prediction_picks in schema.sql). Replace with real DB queries later.

import type {
	GameweekPredictions,
	PredictionPick,
	PredictorId,
	PredictorPredictions,
} from "./types";

const store = new Map<string, PredictorPredictions[]>();

const key = (season: number, gameweek: number) => `${season}:${gameweek}`;

export const getGameweekPredictions = (
	season: number,
	gameweek: number
): GameweekPredictions => ({
	season,
	gameweek,
	predictions: store.get(key(season, gameweek)) ?? [],
});

/** Upsert one predictor's picks for a gameweek. Returns the saved picks. */
export const savePredictorPredictions = (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	picks: PredictionPick[]
): PredictorPredictions => {
	const existing = store.get(key(season, gameweek)) ?? [];
	const byFixture = new Map<number, PredictionPick>();

	for (const row of existing.find((item) => item.predictor === predictor)?.picks ?? []) {
		byFixture.set(row.fixtureId, row);
	}

	for (const pick of picks) {
		byFixture.set(pick.fixtureId, pick);
	}

	const saved: PredictorPredictions = {
		predictor,
		picks: [...byFixture.values()].sort((a, b) => a.fixtureId - b.fixtureId),
	};

	store.set(
		key(season, gameweek),
		[...existing.filter((item) => item.predictor !== predictor), saved].sort((a, b) =>
			a.predictor.localeCompare(b.predictor)
		)
	);

	return saved;
};
