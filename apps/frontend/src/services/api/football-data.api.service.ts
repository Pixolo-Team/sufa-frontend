// MODULES //
import axios from "axios";

// TYPES //
import type { FixtureData } from "@/types/predictions";

// Same-origin proxy — dev me Astro (astro.config.mjs), production me Vercel
// (vercel.json) forward karta hai. Direct browser calls CORS me block hote
// hai, isliye absolute football-data.org URL yaha use mat karo.
const FOOTBALL_DATA_BASE = "/api/football-data/v4";

interface FootballDataMatch {
	id: number;
	utcDate: string;
	homeTeam: { name: string; shortName: string; tla: string };
	awayTeam: { name: string; shortName: string; tla: string };
}

interface FootballDataResponse {
	matches: FootballDataMatch[];
}

/**
 * GW ke saare fixtures football-data.org se (same-origin proxy ke through).
 * Free tier: 10 requests/min. Key `PUBLIC_FOOTBALL_DATA_API_KEY` me rakho
 * (dekho apps/frontend/.env.example).
 */
export const getGameweekFixturesRequest = async (
	season: number,
	gameweek: number
): Promise<FixtureData[]> => {
	const apiKey = import.meta.env.PUBLIC_FOOTBALL_DATA_API_KEY as string | undefined;

	if (!apiKey) {
		throw new Error(
			"PUBLIC_FOOTBALL_DATA_API_KEY missing — .env me free football-data.org key daalo"
		);
	}

	let response;
	try {
		response = await axios.get<FootballDataResponse>(
			`${FOOTBALL_DATA_BASE}/competitions/PL/matches`,
			{
				params: { season, matchday: gameweek },
				headers: { "X-Auth-Token": apiKey },
			}
		);
	} catch (error) {
		// Free tier: 10 requests/min — Daniel (football-data.org) asks clients
		// to respect the throttling headers instead of hammering the limiter.
		if (axios.isAxiosError(error) && error.response?.status === 429) {
			const reset = error.response.headers?.["x-requestcounter-reset"];
			throw new Error(
				`Rate limit hit (10 req/min)${reset ? ` — ${reset}s me reset` : ""}. Thoda ruk ke Retry dabao`
			);
		}
		throw error;
	}

	// Automatic throttling: warn in console when the per-minute quota runs low.
	const remaining = Number(response.headers?.["x-requests-available-minute"]);
	if (Number.isFinite(remaining) && remaining <= 2) {
		console.warn(
			`[football-data] only ${remaining} requests left this minute — throttling`
		);
	}

	return (response.data.matches ?? [])
		.map((match) => ({
			id: match.id,
			homeTeam: match.homeTeam.shortName || match.homeTeam.name,
			homeTla: match.homeTeam.tla,
			awayTeam: match.awayTeam.shortName || match.awayTeam.name,
			awayTla: match.awayTeam.tla,
			utcDate: match.utcDate,
		}))
		.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
};
