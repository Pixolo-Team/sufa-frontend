// MODULES //
import axios from "axios";

// TYPES //
import type {
	GameweekPredictionsData,
	PredictionPickData,
	PredictorId,
	PredictorRoundData,
	SavedRoundData,
} from "@/types/predictions";

// CONSTANTS //
import { CONSTANTS } from "@/infrastructure/constants";

// UTILS //
import { matchFixtureId, shortTeamName, toTla } from "./openfootball.api.service";

const baseUrl = (season: number, gameweek: number) =>
	`${CONSTANTS.API_URL}/predictions/${season}/${gameweek}`;

/** Saved round snapshots for a gameweek (prefill + export screen). */
export const getGameweekPredictionsRequest = async (
	season: number,
	gameweek: number
): Promise<GameweekPredictionsData> => {
	const response = await axios.get<{ data: GameweekPredictionsData }>(
		baseUrl(season, gameweek)
	);
	return response.data.data;
};

/** Save one predictor's full matchday JSON (source rows + predicted scores). */
export const savePredictionsRequest = async (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	round: SavedRoundData
): Promise<PredictorRoundData> => {
	const response = await axios.post<{ data: PredictorRoundData }>(
		baseUrl(season, gameweek),
		{ predictor, round }
	);
	return response.data.data;
};

/** Snapshot → UI picks (prefill edits, draw the IG export). Skips unpicked. */
export const roundToPicks = (
	round: SavedRoundData | undefined,
	gameweek: number
): PredictionPickData[] => {
	if (!round) return [];

	return round.matches.flatMap((match, index) => {
		if (match.predictedHome === null || match.predictedAway === null) return [];

		return [
			{
				fixtureId: matchFixtureId(gameweek, index),
				homeTeam: shortTeamName(match.team1),
				awayTeam: shortTeamName(match.team2),
				homeTla: toTla(match.team1),
				awayTla: toTla(match.team2),
				homeScore: match.predictedHome,
				awayScore: match.predictedAway,
			},
		];
	});
};
