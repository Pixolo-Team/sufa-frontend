// Score Predictor config — predictors, season and gameweek range.

import type { PredictorId } from "@/types/predictions";

export const PREDICTORS: { id: PredictorId; label: string; color: string }[] = [
	{ id: "abhay", label: "Abhay", color: "#16db93" },
	{ id: "harsh", label: "Harsh", color: "#ce6ee0" },
];

/** football-data.org season = starting year. 2026 → 2026/27 PL season. */
export const PREDICTIONS_SEASON = 2026;

export const TOTAL_GAMEWEEKS = 38;

export const gameweekNumbers = (): number[] =>
	Array.from({ length: TOTAL_GAMEWEEKS }, (_, index) => index + 1);
