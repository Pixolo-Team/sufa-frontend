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

// The backend host is often unreachable (cold/dev) — never hang the UI on it.
const api = axios.create({ timeout: 8000 });

/** Session flag: once the backend fails to answer, loads skip it entirely. */
let backendDown = false;

const isNetworkFailure = (error: unknown): boolean =>
	axios.isAxiosError(error) &&
	(error.code === "ECONNABORTED" || error.response === undefined);

/** Saved round snapshots for a gameweek (prefill + export screen). */
export const getGameweekPredictionsRequest = async (
	season: number,
	gameweek: number
): Promise<GameweekPredictionsData> => {
	if (backendDown) throw new Error("Backend offline");

	try {
		const response = await api.get<{ data: GameweekPredictionsData }>(
			baseUrl(season, gameweek)
		);
		backendDown = false;
		return response.data.data;
	} catch (error) {
		if (isNetworkFailure(error)) backendDown = true;
		throw error;
	}
};

/** Save one predictor's full matchday JSON (source rows + predicted scores). */
export const savePredictionsRequest = async (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	round: SavedRoundData
): Promise<PredictorRoundData> => {
	try {
		const response = await api.post<{ data: PredictorRoundData }>(
			baseUrl(season, gameweek),
			{ predictor, round }
		);
		backendDown = false;
		return response.data.data;
	} catch (error) {
		if (isNetworkFailure(error)) backendDown = true;
		throw error;
	}
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
