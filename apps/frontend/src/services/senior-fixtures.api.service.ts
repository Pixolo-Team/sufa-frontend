// SUPABASE //
import { supabase } from "./supabase.client";

// TYPES //
import type { SeniorFixtureData } from "@/types/senior-seasons";
import type { Database } from "@/types/supabase";

type SeniorFixtureRow = Pick<
	Database["public"]["Tables"]["senior_fixtures"]["Row"],
	"id" | "home_team" | "away_team" | "home_score" | "away_score"
>;

const toSeniorFixture = (row: SeniorFixtureRow): SeniorFixtureData => ({
	id: row.id,
	homeTeam: row.home_team,
	awayTeam: row.away_team,
	homeScore: row.home_score,
	awayScore: row.away_score,
});

/** All fixtures for a season, oldest first. Powers fixtures + points table. */
export const fetchSeniorFixtures = async (
	season: string
): Promise<SeniorFixtureData[]> => {
	const { data, error } = await supabase
		.from("senior_fixtures")
		.select("id, home_team, away_team, home_score, away_score")
		.eq("season", season)
		.order("created_at", { ascending: true });

	if (error) throw error;

	return (data ?? []).map(toSeniorFixture);
};

export type SeniorFixtureInput = {
	homeTeam: string;
	awayTeam: string;
	homeScore: number | null;
	awayScore: number | null;
};

/**
 * Persist the whole editor grid: insert rows without id, update the rest,
 * delete rows the staffer removed. The UNIQUE(season, home, away) constraint
 * is the backstop for the no-duplicate validation.
 */
export const saveSeniorFixtures = async (
	season: string,
	rows: ({ id?: string } & SeniorFixtureInput)[],
	deletedIds: string[]
): Promise<void> => {
	if (deletedIds.length > 0) {
		const { error } = await supabase
			.from("senior_fixtures")
			.delete()
			.in("id", deletedIds);

		if (error) throw error;
	}

	const toInsert = rows
		.filter((row) => !row.id)
		.map((row) => ({
			season,
			home_team: row.homeTeam,
			away_team: row.awayTeam,
			home_score: row.homeScore,
			away_score: row.awayScore,
		}));

	if (toInsert.length > 0) {
		const { error } = await supabase.from("senior_fixtures").insert(toInsert);

		if (error) throw error;
	}

	for (const row of rows.filter((row) => row.id)) {
		const { error } = await supabase
			.from("senior_fixtures")
			.update({
				home_team: row.homeTeam,
				away_team: row.awayTeam,
				home_score: row.homeScore,
				away_score: row.awayScore,
				updated_at: new Date().toISOString(),
			})
			.eq("id", row.id as string);

		if (error) throw error;
	}
};
