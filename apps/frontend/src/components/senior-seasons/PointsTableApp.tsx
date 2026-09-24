// REACT //
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "../operations/operations.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";
import Button from "@/neevo/components/button/Button";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";
import { fetchSeniorFixtures } from "@/services/senior-fixtures.api.service";

// TYPES //
import type { SeniorFixtureData } from "@/types/senior-seasons";
import {
	HIGHLIGHT_TEAM,
	SENIOR_SEASON,
	SENIOR_SEASON_LABEL,
	SENIOR_TEAM_LOGOS,
	SENIOR_TEAM_LOGO_CHIP,
} from "@/types/senior-seasons";

// UTILS //
import { computeSeniorStandings } from "@/utils/points-table.util";
import { renderStandingsImage } from "@/utils/points-table-image.util";

/** Static top bar - memoised so table state never re-renders it. */
const TopBar: React.FC = memo(() => {
	return (
		<div className={styles.topBar}>
			<span className={styles.brand}>
				<img
					className={styles.brandLogo}
					src="/images/skorost.svg"
					alt="Skorost United Football Academy"
					width="71"
					height="34"
				/>
			</span>

			<a href="https://zizoapp.in" target="_blank" rel="noopener noreferrer">
				<img
					className={styles.topBarLogo}
					src="/images/brand/zizo.svg"
					alt="Zizo"
					width="34"
					height="34"
				/>
			</a>
		</div>
	);
});

TopBar.displayName = "SeniorTableTopBar";

/** Static side menu - mounts once, never re-renders on data load. */
const SideMenu: React.FC = memo(() => {
	return (
		<nav className={styles.rail} aria-label="Senior season">
			<a href="/senior-seasons/26-27/fixtures" className={styles.railItem}>
				<OperationsIcon name="calendar-check" size={18} />
				Fixtures
			</a>
			<a
				href="/senior-seasons/26-27/points-table"
				className={`${styles.railItem} ${styles.railItemActive}`}
				aria-current="page"
			>
				<OperationsIcon name="whistle" size={18} />
				Points Table
			</a>
		</nav>
	);
});

SideMenu.displayName = "SeniorTableSideMenu";

const formatGd = (value: number): string =>
	value > 0 ? `+${value}` : String(value);

/**
 * Public group standings. Fetches fixtures, derives everything in the
 * browser, and exports a 9:16 story image on demand.
 */
const PointsTableApp: React.FC = () => {
	const [fixtures, setFixtures] = useState<SeniorFixtureData[] | null>(null);
	const [loadError, setLoadError] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	useEffect(() => {
		let isActive = true;

		fetchSeniorFixtures(SENIOR_SEASON)
			.then((result) => {
				if (isActive) setFixtures(result);
			})
			.catch(() => {
				if (isActive) setLoadError(true);
			});

		return () => {
			isActive = false;
		};
	}, []);

	const standings = useMemo(
		() => (fixtures ? computeSeniorStandings(fixtures) : []),
		[fixtures]
	);

	const playedFixtures = useMemo(
		() =>
			(fixtures ?? []).filter(
				(fixture) => fixture.homeScore !== null && fixture.awayScore !== null
			),
		[fixtures]
	);

	const handleDownload = useCallback(() => {
		if (isExporting || standings.length === 0) return;

		setIsExporting(true);

		renderStandingsImage({ seasonLabel: SENIOR_SEASON_LABEL, rows: standings })
			.then((blob) => {
				if (!blob) {
					showToast("Could not build the image. Try again.", ToastTypes.ERROR);
					return;
				}

				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = "skorost-group-standing-26-27.png";
				link.click();
				window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
				showToast("Image downloaded", ToastTypes.SUCCESS);
			})
			.catch(() => {
				showToast("Could not build the image. Try again.", ToastTypes.ERROR);
			})
			.finally(() => setIsExporting(false));
	}, [standings, isExporting]);

	const renderBody = () => {
		if (loadError) {
			return (
				<p className={styles.notice}>
					Could not load the points table. Check your connection and reload.
				</p>
			);
		}

		if (!fixtures) {
			return <p className={styles.notice}>Loading...</p>;
		}

		if (playedFixtures.length === 0) {
			return (
				<div className={styles.emptyState}>
					<span className={styles.emptyStateIcon}>
						<OperationsIcon name="whistle" size={42} />
					</span>
					<h3>No results yet</h3>
					<p>The table fills in as soon as the first scores are saved.</p>
				</div>
			);
		}

		return (
			<div className={styles.cardStack}>
				<section className={styles.card}>
					<div className={styles.seniorTitleRow}>
						<div>
							<b>Group Standing</b>
							<p className={styles.centerAddress}>
								{SENIOR_SEASON_LABEL} - {playedFixtures.length}{" "}
								{playedFixtures.length === 1 ? "match" : "matches"} played
							</p>
						</div>
						<Button
							onClick={handleDownload}
							text={isExporting ? "Building..." : "Download Image"}
							color={Colors.PRIMARY}
							shape={Shapes.ROUNDED}
							size={ButtonSizes.SMALL}
							isDisabled={isExporting}
							extraClass={styles.seniorCompactButton}
						/>
					</div>

					<div className={styles.standingsWrap}>
						<table className={styles.standingsTable}>
							<thead>
								<tr>
									<th>#</th>
									<th>Team</th>
									<th>P</th>
									<th>W</th>
									<th>D</th>
									<th>L</th>
									<th>GF</th>
									<th>GA</th>
									<th>GD</th>
									<th>Pts</th>
								</tr>
							</thead>
							<tbody>
								{standings.map((row, index) => (
									<tr
										key={row.team}
										className={
											row.team === HIGHLIGHT_TEAM
												? styles.standingsSkorost
												: undefined
										}
									>
										<td>{index + 1}</td>
										<td>
											<span className={styles.seniorTeamCell}>
												{SENIOR_TEAM_LOGOS[row.team] && (
													<span
														className={styles.seniorTeamLogoChip}
														style={{
															backgroundColor:
																SENIOR_TEAM_LOGO_CHIP[row.team] ?? "#ffffff",
														}}
													>
														<img
															className={styles.seniorTeamLogo}
															src={SENIOR_TEAM_LOGOS[row.team]}
															alt=""
															width="28"
															height="28"
															loading="lazy"
														/>
													</span>
												)}
												<b>{row.team}</b>
											</span>
										</td>
										<td>{row.played}</td>
										<td>{row.won}</td>
										<td>{row.drawn}</td>
										<td>{row.lost}</td>
										<td>{row.goalsFor}</td>
										<td>{row.goalsAgainst}</td>
										<td>{formatGd(row.goalDifference)}</td>
										<td>
											<b>{row.points}</b>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section className={styles.card}>
					<div className={styles.centerHeader}>
						<div>
							<b>Results</b>
							<p className={styles.centerAddress}>Newest first</p>
						</div>
					</div>

					<ul className={styles.donorList}>
						{[...playedFixtures].reverse().map((fixture) => (
							<li key={fixture.id} className={styles.donorRow}>
								<div className={styles.donorInfo}>
									<b>
										{fixture.homeTeam} {fixture.homeScore} - {fixture.awayScore}{" "}
										{fixture.awayTeam}
									</b>
								</div>
							</li>
						))}
					</ul>
				</section>
			</div>
		);
	};

	return (
		<div className={styles.operations}>
			<div className={styles.shell}>
				<TopBar />
				<SideMenu />

				<div className={`${styles.panel} ${styles.panelHome}`}>{renderBody()}</div>
			</div>
		</div>
	);
};

export default PointsTableApp;
