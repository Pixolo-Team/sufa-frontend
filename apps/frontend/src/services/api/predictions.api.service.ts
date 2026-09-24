// TYPES //
import type {
	GameweekPredictionsData,
	GameweekScoreData,
	PredictionPickData,
	PredictorId,
	PredictorRoundData,
	SavedMatchData,
	SavedRoundData,
} from "@/types/predictions";
import type { Json } from "@/types/supabase";

// UTILS //
import { matchFixtureId, shortTeamName, toTla } from "./openfootball.api.service";

// Storage: Supabase `gameweek_predictions` (one row per season + gameweek,
// one snapshot column per predictor). Same DB the operations page reads.
// Falls back to device-local when Supabase is unreachable - the app catches
// and loads/saves locally instead.

// PostgREST builders are thenables, not real Promises - accept PromiseLike
// and normalize with Promise.resolve so the timeout race typechecks.
const withTimeout = <T>(work: PromiseLike<T>, ms: number): Promise<T> =>
	Promise.race([
		Promise.resolve(work),
		new Promise<T>((_, reject) =>
			window.setTimeout(() => reject(new Error("Supabase timeout")), ms)
		),
	]);

/** Rounds are plain JSON-serializable data, safe for JSONB columns. */
const roundToJson = (round: SavedRoundData): Json => round as unknown as Json;

/** Lazy import - the client module throws when env vars are missing. */
const getClient = async () =>
	(await import("@/services/supabase.client")).supabase;

const isValidRound = (value: unknown): value is SavedRoundData => {
	if (typeof value !== "object" || value === null) return false;
	const round = value as Record<string, unknown>;
	if (typeof round.name !== "string" || !Array.isArray(round.matches)) return false;

	return (round.matches as unknown[]).every((match) => {
		if (typeof match !== "object" || match === null) return false;
		const item = match as Record<string, unknown> & {
			predictedHome: unknown;
			predictedAway: unknown;
		};
		const validScore = (score: unknown) =>
			score === null ||
			(typeof score === "number" && Number.isInteger(score) && score >= 0 && score <= 20);

		return (
			typeof item.date === "string" &&
			typeof item.team1 === "string" &&
			typeof item.team2 === "string" &&
			validScore(item.predictedHome) &&
			validScore(item.predictedAway)
		);
	});
};

const toPredictionsData = (
	season: number,
	gameweek: number,
	row: {
		abhay_snapshot: unknown;
		harsh_snapshot: unknown;
		abhay_points?: unknown;
		harsh_points?: unknown;
	} | null
): GameweekPredictionsData => {
	const predictions: PredictorRoundData[] = [];

	if (row && isValidRound(row.abhay_snapshot)) {
		predictions.push({ predictor: "abhay", round: row.abhay_snapshot });
	}

	if (row && isValidRound(row.harsh_snapshot)) {
		predictions.push({ predictor: "harsh", round: row.harsh_snapshot });
	}

	return {
		season,
		gameweek,
		predictions,
		points: {
			abhay: typeof row?.abhay_points === "number" ? row.abhay_points : null,
			harsh: typeof row?.harsh_points === "number" ? row.harsh_points : null,
		},
	};
};

const SNAPSHOT_COLUMNS = "abhay_snapshot, harsh_snapshot, abhay_points, harsh_points";

/** Saved round snapshots for a gameweek (prefill + export screen). */
export const getGameweekPredictionsRequest = async (
	season: number,
	gameweek: number
): Promise<GameweekPredictionsData> => {
	const supabase = await getClient();

	const { data, error } = await withTimeout(
		supabase
			.from("gameweek_predictions")
			.select(SNAPSHOT_COLUMNS)
			.eq("season", season)
			.eq("gameweek", gameweek)
			.maybeSingle(),
		10000
	);

	if (error) throw error;

	return toPredictionsData(season, gameweek, data);
};

/** Save one predictor's full matchday JSON (source rows + predicted scores). */
export const savePredictionsRequest = async (
	season: number,
	gameweek: number,
	predictor: PredictorId,
	round: SavedRoundData
): Promise<PredictorRoundData> => {
	const supabase = await getClient();

	const { error: upsertError } = await withTimeout(
		supabase.from("gameweek_predictions").upsert(
			{
				season,
				gameweek,
				...(predictor === "abhay"
					? { abhay_snapshot: roundToJson(round) }
					: { harsh_snapshot: roundToJson(round) }),
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "season,gameweek" }
		),
		15000
	);

	if (upsertError) throw upsertError;

	const { data, error: readError } = await withTimeout(
		supabase
			.from("gameweek_predictions")
			.select(SNAPSHOT_COLUMNS)
			.eq("season", season)
			.eq("gameweek", gameweek)
			.maybeSingle(),
		10000
	);

	if (readError) throw readError;

	const saved = toPredictionsData(season, gameweek, data).predictions.find(
		(item) => item.predictor === predictor
	);

	if (!saved) throw new Error("Save did not persist");

	return saved;
};

/** Persist calculated points on the same gameweek row (snapshots untouched). */
export const saveGameweekPointsRequest = async (
	season: number,
	gameweek: number,
	points: { abhay: number; harsh: number }
): Promise<void> => {
	const supabase = await getClient();

	const { error } = await withTimeout(
		supabase.from("gameweek_predictions").upsert(
			{
				season,
				gameweek,
				abhay_points: points.abhay,
				harsh_points: points.harsh,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "season,gameweek" }
		),
		15000
	);

	if (error) throw error;
};

/** Every gameweek's points for the season, ordered - feeds /scores. */
export const getAllGameweekScoresRequest = async (
	season: number
): Promise<GameweekScoreData[]> => {
	const supabase = await getClient();

	const { data, error } = await withTimeout(
		supabase
			.from("gameweek_predictions")
			.select("gameweek, abhay_points, harsh_points")
			.eq("season", season)
			.order("gameweek", { ascending: true }),
		15000
	);

	if (error) throw error;

	return (data ?? []).map((row) => ({
		gameweek: row.gameweek,
		abhay: typeof row.abhay_points === "number" ? row.abhay_points : null,
		harsh: typeof row.harsh_points === "number" ? row.harsh_points : null,
	}));
};

/** Snapshot → UI picks (prefill edits, draw the IG export). Skips unpicked. */
export const roundToPicks = (
	round: SavedRoundData | undefined,
	gameweek: number
): PredictionPickData[] => {
	if (!round) return [];

	return round.matches.flatMap((match: SavedMatchData, index: number) => {
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
