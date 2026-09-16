// MODULES //
import axios from "axios";

// TYPES //
import type { FixtureData } from "@/types/predictions";

// API-Football v3 — Premier League `league=39`. Round names look like
// "Regular Season - 5". Free plan: 100 requests/day.
const LEAGUE_ID = 39;

// Same-origin proxy — dev me Astro (astro.config.mjs), production me Vercel
// (vercel.json) forward karta hai. Sirf `x-apisports-key` header allowed hai;
// direct browser calls preflight me fail hote hai, isliye proxy use karo.
const API_BASE = "/api/football";

/** API-Football short codes nahi deta — PL clubs ka manual map + fallback. */
const TLA_BY_TEAM_NAME: Record<string, string> = {
	Arsenal: "ARS",
	"Aston Villa": "AVL",
	Bournemouth: "BOU",
	Brentford: "BRE",
	Brighton: "BHA",
	"Birmingham City": "BIR",
	Burnley: "BUR",
	Chelsea: "CHE",
	"Crystal Palace": "CRY",
	Everton: "EVE",
	Fulham: "FUL",
	"Wrexham": "WRE",
	Ipswich: "IPS",
	Leeds: "LEE",
	Leicester: "LEI",
	Liverpool: "LIV",
	Luton: "LUT",
	"Manchester City": "MCI",
	"Manchester United": "MUN",
	Middlesbrough: "MID",
	Millwall: "MIL",
	Newcastle: "NEW",
	Norwich: "NOR",
	"Nottingham Forest": "NFO",
	Preston: "PRE",
	QPR: "QPR",
	"Sheffield United": "SHU",
	Southampton: "SOU",
	Stoke: "STK",
	Sunderland: "SUN",
	Swansea: "SWA",
	Tottenham: "TOT",
	Watford: "WAT",
	"West Brom": "WBA",
	"West Ham": "WHU",
	Wolves: "WOL",
};

const toTla = (name: string): string =>
	TLA_BY_TEAM_NAME[name] ?? name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();

interface ApiFootballTeam {
	name: string;
	logo: string;
}

interface ApiFootballFixture {
	fixture: { id: number; date: string };
	teams: { home: ApiFootballTeam; away: ApiFootballTeam };
}

interface ApiFootballResponse {
	errors: unknown;
	results: number;
	response: ApiFootballFixture[];
}

/**
 * GW ke saare fixtures API-Football v3 se (same-origin proxy ke through).
 * Key goes in `PUBLIC_API_FOOTBALL_KEY` (see apps/frontend/.env.example).
 */
export const getGameweekFixturesRequest = async (
	season: number,
	gameweek: number
): Promise<FixtureData[]> => {
	const apiKey = import.meta.env.PUBLIC_API_FOOTBALL_KEY as string | undefined;

	if (!apiKey) {
		throw new Error(
			"PUBLIC_API_FOOTBALL_KEY missing — add your api-football.com key to .env"
		);
	}

	let response;
	try {
		response = await axios.get<ApiFootballResponse>(`${API_BASE}/fixtures`, {
			params: {
				league: LEAGUE_ID,
				season,
				round: `Regular Season - ${gameweek}`,
			},
			headers: { "x-apisports-key": apiKey },
		});
	} catch (error) {
		// Free plan: 100 requests/day. Quota khatam hone pe API 403/429 deta hai.
		if (axios.isAxiosError(error) && error.response?.status !== undefined && error.response.status >= 400) {
			const apiErrors = (error.response.data as ApiFootballResponse | undefined)?.errors;
			const detail =
				typeof apiErrors === "object" && apiErrors !== null
					? Object.values(apiErrors).flat().join(" ")
					: "";
			throw new Error(
				`API-Football error ${error.response.status}${detail ? ` — ${detail}` : ""}. Check the quota (100/day), then press Retry`
			);
		}
		throw error;
	}

	if (response.data.errors && Object.keys(response.data.errors as object).length > 0) {
		throw new Error(
			`API-Football error — ${JSON.stringify(response.data.errors)}. Check league/season/round`
		);
	}

	return (response.data.response ?? [])
		.map((item) => ({
			id: item.fixture.id,
			homeTeam: item.teams.home.name,
			homeTla: toTla(item.teams.home.name),
			homeLogo: item.teams.home.logo,
			awayTeam: item.teams.away.name,
			awayTla: toTla(item.teams.away.name),
			awayLogo: item.teams.away.logo,
			utcDate: item.fixture.date,
		}))
		.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
};
