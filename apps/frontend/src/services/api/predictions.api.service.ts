// MODULES //
import axios from "axios";

// TYPES //
import type {
	GameweekPredictionsData,
	PredictionPickData,
	PredictorId,
	PredictorPredictionsData,
} from "@/types/predictions";

// CONSTANTS //
import { CONSTANTS } from "@/infrastructure/constants";

const baseUrl = (season: number, gameweek: number) =>
	`${CONSTANTS.API_URL}/predictions/${season}/${gameweek}`;

/** Saved predictions for a gameweek (prefill + export screen). */
export const getGameweekPredictionsRequest = async (
	season: number,
	gameweek: number
): Promise<GameweekPredictionsData> => {
	const response = await axios.get<{ data: GameweekPredictionsData }>(
		baseUrl(season, gameweek)
	);
	return response.data.data;
};

/** Save one predictor's picks — team names + scores snapshot. */
export const savePredictionsRequest = async (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	picks: PredictionPickData[]
): Promise<PredictorPredictionsData> => {
	const response = await axios.post<{ data: PredictorPredictionsData }>(
		baseUrl(season, gameweek),
		{ predictor, picks }
	);
	return response.data.data;
};
