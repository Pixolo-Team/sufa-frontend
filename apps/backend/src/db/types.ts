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
// Score Predictor (EPL) — fixtures come from the openfootball JSON; each
// predictor's full matchday JSON is stored as one snapshot column per
// gameweek (see gameweek_predictions in docs/operations/schema.sql).
// ---------------------------------------------------------------------------

/** The two predictors. Fixed for now — matches the Abhay | Harsh tabs. */
export type PredictorId = "abhay" | "harsh";

export interface SavedMatch {
	date: string;
	time?: string;
	team1: string;
	team2: string;
	predictedHome: number | null;
	predictedAway: number | null;
}

export interface SavedRound {
	name: string;
	matches: SavedMatch[];
}

export interface PredictorRound {
	predictor: PredictorId;
	round: SavedRound;
}

export interface GameweekPredictions {
	season: number;
	gameweek: number;
	predictions: PredictorRound[];
}
