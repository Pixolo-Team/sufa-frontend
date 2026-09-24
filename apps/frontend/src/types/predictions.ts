// EPL Score Predictor types. Backend mirrors these in apps/backend/src/db/types.ts.
// Fixtures come from the openfootball JSON; each predictor's full matchday
// JSON (with predicted scores) is stored as one snapshot per gameweek.

/** The two predictors - matches the Abhay | Harsh tabs. */
export type PredictorId = "abhay" | "harsh";

/** One fixture from the openfootball season file (only the fields we use). */
export interface FixtureData {
	id: number;
	homeTeam: string;
	homeTla: string;
	homeLogo: string;
	awayTeam: string;
	awayTla: string;
	awayLogo: string;
	/** ISO kickoff, for display ordering */
	utcDate: string;
}

/** One match inside a saved round snapshot, with this predictor's scores. */
export interface SavedMatchData {
	date: string;
	time?: string;
	team1: string;
	team2: string;
	predictedHome: number | null;
	predictedAway: number | null;
}

/** One predictor's full matchday JSON for a gameweek. */
export interface SavedRoundData {
	name: string;
	matches: SavedMatchData[];
}

export interface PredictorRoundData {
	predictor: PredictorId;
	round: SavedRoundData;
}

export interface GameweekPredictionsData {
	season: number;
	gameweek: number;
	predictions: PredictorRoundData[];
	/** Calculated points per predictor (null = not calculated yet) */
	points?: { abhay: number | null; harsh: number | null };
}

/** One row of the /scores table */
export interface GameweekScoreData {
	gameweek: number;
	abhay: number | null;
	harsh: number | null;
}

/** UI-internal pick derived from a snapshot - feeds prefill + IG export. */
export interface PredictionPickData {
	fixtureId: number;
	homeTeam: string;
	awayTeam: string;
	homeTla: string;
	awayTla: string;
	homeScore: number;
	awayScore: number;
}
