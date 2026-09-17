// MODULES //
import axios from "axios";

// TYPES //
import type { FixtureData } from "@/types/predictions";

// openfootball JSON — free, no key, no rate limit, CORS open (*).
// File updates after every matchday:
// https://github.com/openfootball/football.json (2026-27/en.1.json)

const seasonFile = (season: number): string =>
	`https://raw.githubusercontent.com/openfootball/football.json/master/${season}-${String(
		season + 1
	).slice(2)}/en.1.json`;

/** 3-letter codes — openfootball only ships full names ("Arsenal FC"). */
const TLA_BY_TEAM_NAME: Record<string, string> = {
	"AFC Bournemouth": "BOU",
	"Arsenal FC": "ARS",
	"Aston Villa FC": "AVL",
	"Brentford FC": "BRE",
	"Brighton & Hove Albion FC": "BHA",
	"Chelsea FC": "CHE",
	"Coventry City FC": "COV",
	"Crystal Palace FC": "CRY",
	"Everton FC": "EVE",
	"Fulham FC": "FUL",
	"Hull City AFC": "HUL",
	"Ipswich Town FC": "IPS",
	"Leeds United FC": "LEE",
	"Liverpool FC": "LIV",
	"Manchester City FC": "MCI",
	"Manchester United FC": "MUN",
	"Newcastle United FC": "NEW",
	"Nottingham Forest FC": "NFO",
	"Sunderland AFC": "SUN",
	"Tottenham Hotspur FC": "TOT",
};

export const toTla = (name: string): string =>
	TLA_BY_TEAM_NAME[name] ?? name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();

/** Local badge path for an openfootball team name (same-origin, canvas-safe). */
export const teamLogo = (name: string): string => `/images/clubs/${toTla(name)}.png`;

/** Short display names, LiveScore style ("Tottenham Hotspur FC" → "Tottenham"). */
const SHORT_NAME_BY_TEAM: Record<string, string> = {
	"AFC Bournemouth": "Bournemouth",
	"Arsenal FC": "Arsenal",
	"Aston Villa FC": "Aston Villa",
	"Brentford FC": "Brentford",
	"Brighton & Hove Albion FC": "Brighton",
	"Chelsea FC": "Chelsea",
	"Coventry City FC": "Coventry",
	"Crystal Palace FC": "Crystal Palace",
	"Everton FC": "Everton",
	"Fulham FC": "Fulham",
	"Hull City AFC": "Hull",
	"Ipswich Town FC": "Ipswich",
	"Leeds United FC": "Leeds",
	"Liverpool FC": "Liverpool",
	"Manchester City FC": "Man City",
	"Manchester United FC": "Man United",
	"Newcastle United FC": "Newcastle",
	"Nottingham Forest FC": "Nottm Forest",
	"Sunderland AFC": "Sunderland",
	"Tottenham Hotspur FC": "Tottenham",
};

export const shortTeamName = (name: string): string =>
	SHORT_NAME_BY_TEAM[name] ?? name.replace(/\s+(FC|AFC)$/, "");

interface OpenFootballMatch {
	round: string;
	date: string;
	time?: string;
	team1: string;
	team2: string;
}

interface OpenFootballFile {
	name: string;
	matches: OpenFootballMatch[];
}

/** One season file cached in memory — GW switching never refetches. */
const seasonCache = new Map<number, OpenFootballMatch[]>();

const loadSeasonMatches = async (season: number): Promise<OpenFootballMatch[]> => {
	const cached = seasonCache.get(season);
	if (cached) return cached;

	const response = await axios.get<OpenFootballFile>(seasonFile(season), {
		timeout: 15000,
	});
	const matches = response.data.matches ?? [];
	seasonCache.set(season, matches);
	return matches;
};

export interface MatchdayData {
	/** e.g. "Matchday 5" */
	roundName: string;
	fixtures: FixtureData[];
	/** Raw source rows — saved verbatim into the round snapshot */
	sourceMatches: OpenFootballMatch[];
}

/** Stable per-match id: GW * 100 + index inside the round. */
export const matchFixtureId = (gameweek: number, index: number): number =>
	gameweek * 100 + index;

/**
 * Warm the season cache (fire-and-forget from the GW grid) so the first
 * GW open renders instantly while the user is still browsing gameweeks.
 */
export const prefetchSeasonMatches = (season: number): void => {
	loadSeasonMatches(season).catch(() => {
		// Real errors surface when the GW actually opens.
	});
};

/**
 * One matchday's fixtures, filtered from the season JSON.
 * Unplayed matches simply carry no `score` — every listed match is predictable.
 */
export const getMatchdayFixturesRequest = async (
	season: number,
	gameweek: number
): Promise<MatchdayData> => {
	const roundName = `Matchday ${gameweek}`;
	const allMatches = await loadSeasonMatches(season);

	const sourceMatches = allMatches
		.filter((match) => match.round?.trim().toLowerCase() === roundName.toLowerCase())
		.sort((a, b) =>
			`${a.date}T${a.time ?? "00:00"}`.localeCompare(`${b.date}T${b.time ?? "00:00"}`)
		);

	// Ids are assigned after sorting, so they stay stable across loads.
	const fixtures = sourceMatches.map((match, index) => {
		const time = match.time ? `${match.time}:00`.slice(0, 8) : "00:00:00";
		return {
			id: matchFixtureId(gameweek, index),
			homeTeam: shortTeamName(match.team1),
			homeTla: toTla(match.team1),
			homeLogo: teamLogo(match.team1),
			awayTeam: shortTeamName(match.team2),
			awayTla: toTla(match.team2),
			awayLogo: teamLogo(match.team2),
			utcDate: `${match.date}T${time}`,
		};
	});

	return { roundName, fixtures, sourceMatches };
};
