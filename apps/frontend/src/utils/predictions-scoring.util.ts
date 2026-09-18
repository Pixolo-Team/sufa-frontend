// TYPES //
import type { SavedRoundData } from "@/types/predictions";

/**
 * Points rules (93110/25):
 * - Exact score  = 5 points
 * - Right outcome (Win / Draw / Loss) = 3 points
 * - Anything else (or unplayed) = 0 points
 */

export type MatchOutcome = "home" | "draw" | "away";

export interface MatchResult {
	home: number;
	away: number;
}

export interface ScoredMatch {
	team1: string;
	team2: string;
	actual: MatchResult | null;
	predicted: MatchResult | null;
	points: number;
}

export interface PredictorScore {
	points: number;
	played: number;
	pending: number;
	matches: ScoredMatch[];
}

const outcomeOf = (home: number, away: number): MatchOutcome =>
	home > away ? "home" : home < away ? "away" : "draw";

const pointsFor = (
	actual: MatchResult | null,
	predicted: MatchResult | null
): number => {
	if (!actual || !predicted) return 0;
	if (actual.home === predicted.home && actual.away === predicted.away) return 5;
	return outcomeOf(actual.home, actual.away) ===
		outcomeOf(predicted.home, predicted.away)
		? 3
		: 0;
};

export interface SourceResult {
	team1: string;
	team2: string;
	/** Final-time score from the openfootball JSON (null = not played yet) */
	ft: MatchResult | null;
}

/**
 * Score one predictor's saved round against actual results. Matching is by
 * team names (robust to ordering), index is the fallback.
 */
export const calculatePredictorPoints = (
	round: SavedRoundData | undefined,
	results: SourceResult[]
): PredictorScore => {
	const empty: PredictorScore = { points: 0, played: 0, pending: 0, matches: [] };

	if (!round) return empty;

	const findResult = (team1: string, team2: string, index: number): MatchResult | null => {
		const byName = results.find((item) => item.team1 === team1 && item.team2 === team2);
		if (byName) return byName.ft;
		return results[index]?.ft ?? null;
	};

	return round.matches.reduce<PredictorScore>(
		(total, match, index) => {
			const actual = findResult(match.team1, match.team2, index);
			const predicted: MatchResult | null =
				match.predictedHome === null || match.predictedAway === null
					? null
					: { home: match.predictedHome, away: match.predictedAway };
			const points = pointsFor(actual, predicted);

			return {
				points: total.points + points,
				played: total.played + (actual ? 1 : 0),
				pending: total.pending + (actual ? 0 : 1),
				matches: [
					...total.matches,
					{ team1: match.team1, team2: match.team2, actual, predicted, points },
				],
			};
		},
		{ ...empty, matches: [] }
	);
};
