/** Senior season (26-27) group competition. Points are never stored,
 *  they are derived in the browser from fixtures (see points-table.util). */

export const SENIOR_SEASON = "26-27";
export const SENIOR_SEASON_LABEL = "Senior Season 26-27";

export const HIGHLIGHT_TEAM = "Skorost United";

/**
 * Club crests by team name. Teams missing here render text-only until
 * their logo arrives in `public/images/senior-seasons/` - then add one line.
 * The footer artwork is white, so each crest gets its chip colour below.
 */
export const SENIOR_TEAM_LOGOS: Record<string, string> = {};

/** Badge background per team - defaults to white for future dark artwork. */
export const SENIOR_TEAM_LOGO_CHIP: Record<string, string> = {
	"Skorost United": "#0F9563",
};

/** The 12 group teams, in fixture-dropdown order. */
export const SENIOR_TEAMS = [
	"Skorost United",
	"Charkop FC",
	"Somaiya",
	"Offshots",
	"Brothers",
	"KSA",
	"Tarun Sporting",
	"Radhaswami SC",
	"Mumbai Rebels FC",
	"FSI",
	"Mumbai Strikers",
	"ICL Youngstar FC",
] as const;

export type SeniorTeam = (typeof SENIOR_TEAMS)[number];

/** One row of `senior_fixtures`. Scores are null until the match is played. */
export type SeniorFixtureData = {
	id: string;
	homeTeam: string;
	awayTeam: string;
	homeScore: number | null;
	awayScore: number | null;
};

/** One row of the computed group standings. */
export type SeniorStandingRow = {
	team: string;
	played: number;
	won: number;
	drawn: number;
	lost: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
	points: number;
};
