// Shared operations types. Mirrors the batch-linked payload returned by
// GET /operations/centers. Frontend imports an equivalent shape locally.

export interface OpsConfig {
	academyName: string;
	upiId: string;
	payeeName: string;
	staffPin: string;
}

export interface OpsCoach {
	id: string;
	name: string;
	phone?: string;
}

export interface OpsBatchTiming {
	day: number;
	startTime: string;
	endTime: string;
}

export interface OpsPlan {
	id: string;
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	price: number;
	perSessionPrice: number;
}

export interface OpsRegistrationOption {
	id: string;
	name: string;
	price: number;
}

export interface OpsBatch {
	id: string;
	name: string;
	schedule: OpsBatchTiming[];
	plans: OpsPlan[];
	registrationOptions: OpsRegistrationOption[];
}

export interface OpsCenter {
	id: string;
	name: string;
	address: string;
	coaches: OpsCoach[];
	batches: OpsBatch[];
}

export interface OperationsData {
	config: OpsConfig;
	centers: OpsCenter[];
}

// ---------------------------------------------------------------------------
// Score Predictor (EPL) — same DB pattern as operations: tables in schema.sql,
// scaffold store until Postgres is wired.
// ---------------------------------------------------------------------------

/** The two predictors. Fixed for now — matches the Abhay | Harsh tabs. */
export type PredictorId = "abhay" | "harsh";

export interface PredictionPick {
	/** football-data.org fixture id, stable across fetches */
	fixtureId: number;
	homeTeam: string;
	awayTeam: string;
	/** 3-letter codes (e.g. ARS, LIV) for the export image */
	homeTla: string;
	awayTla: string;
	homeScore: number;
	awayScore: number;
}

export interface PredictorPredictions {
	predictor: PredictorId;
	picks: PredictionPick[];
}

export interface GameweekPredictions {
	season: number;
	gameweek: number;
	predictions: PredictorPredictions[];
}
