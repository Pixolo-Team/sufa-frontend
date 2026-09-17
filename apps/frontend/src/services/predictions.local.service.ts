// TYPES //
import type {
	GameweekPredictionsData,
	PredictorId,
	PredictorRoundData,
	SavedRoundData,
} from "@/types/predictions";

/**
 * Device-local fallback for when the backend is unreachable. Once the
 * backend is up, saving goes to the server again — shapes are identical,
 * and Export works from either source.
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
	round: SavedRoundData
): PredictorRoundData => {
	const current = getLocalPredictions(season, gameweek);
	const saved: PredictorRoundData = { predictor, round };

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
