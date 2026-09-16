// TYPES //
import type {
	GameweekPredictionsData,
	PredictorPredictionsData,
	PredictorId,
	PredictionPickData,
} from "@/types/predictions";

/**
 * Device-local fallback jab backend unreachable ho (jaise abhi
 * api.skorostunited.com reset ho raha hai). Backend up hote hi Save backend
 * pe jayega — shapes identical hai, Export dono se chalta hai.
 */

const storageKey = (season: number, gameweek: number) =>
	`skorost-predictions-${season}-${gameweek}`;

export const getLocalPredictions = (
	season: number,
	gameweek: number
): GameweekPredictionsData => {
	try {
		const raw = window.localStorage.getItem(storageKey(season, gameweek));
		if (raw) {
			const parsed = JSON.parse(raw) as GameweekPredictionsData;
			if (parsed && Array.isArray(parsed.predictions)) return parsed;
		}
	} catch {
		// Corrupt entry — fall through to empty.
	}

	return { season, gameweek, predictions: [] };
};

export const saveLocalPredictions = (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	picks: PredictionPickData[]
): PredictorPredictionsData => {
	const current = getLocalPredictions(season, gameweek);
	const saved: PredictorPredictionsData = {
		predictor,
		picks: [...picks].sort((a, b) => a.fixtureId - b.fixtureId),
	};

	const next: GameweekPredictionsData = {
		season,
		gameweek,
		predictions: [
			...current.predictions.filter((item) => item.predictor !== predictor),
			saved,
		].sort((a, b) => a.predictor.localeCompare(b.predictor)),
	};

	try {
		window.localStorage.setItem(storageKey(season, gameweek), JSON.stringify(next));
	} catch {
		// Storage full/blocked — caller already toasted.
	}

	return saved;
};
