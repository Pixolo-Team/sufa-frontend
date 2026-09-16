// EPL Score Predictor types. Backend mirrors these in apps/backend/src/db/types.ts.

/** The two predictors — matches the Abhay | Harsh tabs. */
export type PredictorId = "abhay" | "harsh";

/** One fixture from API-Football v3 (only the fields we use). */
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

/** One saved prediction: team names + scores snapshot per fixture. */
export interface PredictionPickData {
	fixtureId: number;
	homeTeam: string;
	awayTeam: string;
	homeTla: string;
	awayTla: string;
	homeScore: number;
	awayScore: number;
}

export interface PredictorPredictionsData {
	predictor: PredictorId;
	picks: PredictionPickData[];
}

export interface GameweekPredictionsData {
	season: number;
	gameweek: number;
	predictions: PredictorPredictionsData[];
}
