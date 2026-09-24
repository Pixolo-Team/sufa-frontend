// TYPES //
import type {
	SeniorFixtureData,
	SeniorStandingRow,
} from "@/types/senior-seasons";
import { SENIOR_TEAMS } from "@/types/senior-seasons";

const emptyRow = (team: string): SeniorStandingRow => ({
	team,
	played: 0,
	won: 0,
	drawn: 0,
	lost: 0,
	goalsFor: 0,
	goalsAgainst: 0,
	goalDifference: 0,
	points: 0,
});

const isPlayed = (fixture: SeniorFixtureData): boolean =>
	fixture.homeScore !== null && fixture.awayScore !== null;

const applyResult = (
	row: SeniorStandingRow,
	scored: number,
	conceded: number
): void => {
	row.played += 1;
	row.goalsFor += scored;
	row.goalsAgainst += conceded;
	row.goalDifference = row.goalsFor - row.goalsAgainst;

	if (scored > conceded) {
		row.won += 1;
		row.points += 3;
	} else if (scored === conceded) {
		row.drawn += 1;
		row.points += 1;
	} else {
		row.lost += 1;
	}
};

/**
 * Head-to-head: points earned in played matches where BOTH sides are inside
 * the tied group. A mini-league, so 3-way ties resolve fairly instead of
 * falling straight through to goal difference.
 */
const headToHeadPoints = (
	team: string,
	group: Set<string>,
	fixtures: SeniorFixtureData[]
): number => {
	let points = 0;

	for (const fixture of fixtures) {
		if (!isPlayed(fixture)) continue;
		if (!group.has(fixture.homeTeam) || !group.has(fixture.awayTeam)) continue;

		const home = fixture.homeScore as number;
		const away = fixture.awayScore as number;

		if (home === away) {
			if (fixture.homeTeam === team || fixture.awayTeam === team) points += 1;
		} else if (home > away && fixture.homeTeam === team) {
			points += 3;
		} else if (away > home && fixture.awayTeam === team) {
			points += 3;
		}
	}

	return points;
};

/**
 * Group standings from fixtures. Unplayed fixtures (missing scores) are
 * ignored. Every team in SENIOR_TEAMS appears, even on zero played.
 * Sort: points, head-to-head, goal difference, goals for, then name.
 */
export const computeSeniorStandings = (
	fixtures: SeniorFixtureData[]
): SeniorStandingRow[] => {
	const table = new Map<string, SeniorStandingRow>(
		SENIOR_TEAMS.map((team) => [team, emptyRow(team)])
	);

	for (const fixture of fixtures) {
		if (!isPlayed(fixture)) continue;

		const home = table.get(fixture.homeTeam);
		const away = table.get(fixture.awayTeam);

		// Unknown team names (typos from an older list) never crash the table.
		if (!home || !away) continue;

		applyResult(home, fixture.homeScore as number, fixture.awayScore as number);
		applyResult(away, fixture.awayScore as number, fixture.homeScore as number);
	}

	const rows = [...table.values()];

	// Points groups first, so head-to-head only ever compares true ties.
	const byPoints = new Map<number, SeniorStandingRow[]>();

	for (const row of rows) {
		const group = byPoints.get(row.points) ?? [];
		group.push(row);
		byPoints.set(row.points, group);
	}

	const sortedPoints = [...byPoints.keys()].sort((a, b) => b - a);

	return sortedPoints.flatMap((points) => {
		const group = byPoints.get(points) as SeniorStandingRow[];

		if (group.length === 1) return group;

		const names = new Set(group.map((row) => row.team));
		const h2h = new Map(
			group.map((row) => [row.team, headToHeadPoints(row.team, names, fixtures)])
		);

		return group.sort(
			(a, b) =>
				(h2h.get(b.team) as number) - (h2h.get(a.team) as number) ||
				b.goalDifference - a.goalDifference ||
				b.goalsFor - a.goalsFor ||
				a.team.localeCompare(b.team)
		);
	});
};
