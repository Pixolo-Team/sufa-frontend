// REACT //
import { memo, useCallback, useEffect, useState } from "react";

// ENUMS //
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "../operations/operations.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";
import PinGate from "../operations/PinGate";
import InputBox from "@/neevo/components/input-box/InputBox";
import Button from "@/neevo/components/button/Button";
import Select from "@/neevo/components/select/Select";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";
import {
	fetchSeniorFixtures,
	saveSeniorFixtures,
} from "@/services/senior-fixtures.api.service";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";
import { SENIOR_SEASON, SENIOR_SEASON_LABEL, SENIOR_TEAMS } from "@/types/senior-seasons";

const STAFF_PIN = import.meta.env.PUBLIC_STAFF_PIN ?? "";

const UNLOCK_STORAGE_KEY = "skorost-senior-unlocked";
const UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;

const TEAM_OPTIONS: DropdownOptionData[] = SENIOR_TEAMS.map((team) => ({
	label: team,
	value: team,
}));

const optionFor = (team: string): DropdownOptionData | null =>
	TEAM_OPTIONS.find((option) => option.value === team) ?? null;

type FixtureRow = {
	key: string;
	id?: string;
	home: DropdownOptionData | null;
	away: DropdownOptionData | null;
	homeScore: string;
	awayScore: string;
};

const emptyRow = (): FixtureRow => ({
	key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
	home: null,
	away: null,
	homeScore: "",
	awayScore: "",
});

/** Blank means unplayed. Anything else must be a whole number 0 or more. */
const parseScore = (value: string): number | null | "invalid" => {
	const trimmed = value.trim();

	if (trimmed === "") return null;

	if (!/^\d+$/.test(trimmed)) return "invalid";

	return Number(trimmed);
};

/** Static top bar - memoised so grid keystrokes never re-render it. */
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

TopBar.displayName = "SeniorTopBar";

/** Static side menu - mounts once, never re-renders on grid edits. */
const SideMenu: React.FC<{ active: "fixtures" | "table" }> = memo(({ active }) => {
	return (
		<nav className={styles.rail} aria-label="Senior season">
			<a
				href="/senior-seasons/26-27/fixtures"
				className={`${styles.railItem} ${active === "fixtures" ? styles.railItemActive : ""}`}
				aria-current={active === "fixtures" ? "page" : undefined}
			>
				<OperationsIcon name="calendar-check" size={18} />
				Fixtures
			</a>
			<a
				href="/senior-seasons/26-27/points-table"
				className={`${styles.railItem} ${active === "table" ? styles.railItemActive : ""}`}
				aria-current={active === "table" ? "page" : undefined}
			>
				<OperationsIcon name="whistle" size={18} />
				Points Table
			</a>
		</nav>
	);
});

SideMenu.displayName = "SeniorSideMenu";

/** Staff-only fixtures grid. Same soft PIN gate as /operations. */
const FixturesApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		const storedValue = window.sessionStorage.getItem(UNLOCK_STORAGE_KEY);
		const expiresAt = storedValue ? Number(storedValue) : 0;

		if (expiresAt > Date.now()) return true;

		window.sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
		return false;
	});
	const [rows, setRows] = useState<FixtureRow[]>([emptyRow()]);
	const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [deletedIds, setDeletedIds] = useState<string[]>([]);

	const unlock = useCallback(() => {
		window.sessionStorage.setItem(
			UNLOCK_STORAGE_KEY,
			String(Date.now() + UNLOCK_TTL_MS)
		);
		setIsUnlocked(true);
	}, []);

	useEffect(() => {
		if (!isUnlocked) return;

		let isActive = true;
		setIsLoading(true);

		fetchSeniorFixtures(SENIOR_SEASON)
			.then((fixtures) => {
				if (!isActive) return;

				setRows(
					fixtures.length > 0
						? fixtures.map((fixture) => ({
								key: fixture.id,
								id: fixture.id,
								home: optionFor(fixture.homeTeam),
								away: optionFor(fixture.awayTeam),
								homeScore: fixture.homeScore === null ? "" : String(fixture.homeScore),
								awayScore: fixture.awayScore === null ? "" : String(fixture.awayScore),
							}))
						: [emptyRow()]
				);
				setDeletedIds([]);
				setIsLoading(false);
			})
			.catch(() => {
				if (!isActive) return;
				setIsLoading(false);
				showToast("Could not load fixtures. Try again.", ToastTypes.ERROR);
			});

		return () => {
			isActive = false;
		};
	}, [isUnlocked]);

	const updateRow = useCallback((key: string, patch: Partial<FixtureRow>) => {
		setRows((previous) =>
			previous.map((row) => (row.key === key ? { ...row, ...patch } : row))
		);
	}, []);

	const addRow = useCallback(() => {
		setRows((previous) => [...previous, emptyRow()]);
	}, []);

	const removeRow = useCallback(
		(key: string) => {
			setRows((previous) => {
				const target = previous.find((row) => row.key === key);

				if (target?.id) {
					setDeletedIds((ids) => [...ids, target.id as string]);
				}

				const next = previous.filter((row) => row.key !== key);

				return next.length > 0 ? next : [emptyRow()];
			});
			setRowErrors((previous) => {
				const next = { ...previous };
				delete next[key];
				return next;
			});
		},
		[]
	);

	const handleSave = useCallback(() => {
		if (isSaving) return;

		const errors: Record<string, string> = {};
		const seenPairs = new Map<string, string>();

		rows.forEach((row, index) => {
			const label = `Row ${index + 1}`;

			if (!row.home || !row.away) {
				errors[row.key] = `${label}: pick both teams.`;
				return;
			}

			if (row.home.value === row.away.value) {
				errors[row.key] = `${label}: home and away cannot be the same team.`;
				return;
			}

			const pairKey = `${row.home.value}|||${row.away.value}`;
			const firstSeen = seenPairs.get(pairKey);

			if (firstSeen) {
				errors[row.key] =
					`${label}: this match is already entered in ${firstSeen}.`;
				return;
			}
			seenPairs.set(pairKey, label);

			const homeScore = parseScore(row.homeScore);
			const awayScore = parseScore(row.awayScore);
			const hasBlank = homeScore === null || awayScore === null;
			const hasInvalid = homeScore === "invalid" || awayScore === "invalid";

			if (hasInvalid || (hasBlank && (row.homeScore.trim() !== "" || row.awayScore.trim() !== ""))) {
				errors[row.key] =
					`${label}: scores must be whole numbers 0 or more, or both left blank.`;
				return;
			}
		});

		setRowErrors(errors);

		if (Object.keys(errors).length > 0) {
			showToast("Fix the highlighted rows first.", ToastTypes.ERROR);
			return;
		}

		setIsSaving(true);

		// Validation above guarantees these are numbers or null by now.
		const toScore = (value: string): number | null =>
			(parseScore(value) ?? null) as number | null;

		saveSeniorFixtures(
			SENIOR_SEASON,
			rows.map((row) => ({
				id: row.id,
				homeTeam: (row.home as DropdownOptionData).value,
				awayTeam: (row.away as DropdownOptionData).value,
				homeScore: toScore(row.homeScore),
				awayScore: toScore(row.awayScore),
			})),
			deletedIds
		)
			.then(() => {
				showToast("Fixtures saved", ToastTypes.SUCCESS);
				return fetchSeniorFixtures(SENIOR_SEASON);
			})
			.then((fixtures) => {
				setRows(
					fixtures.map((fixture) => ({
						key: fixture.id,
						id: fixture.id,
						home: optionFor(fixture.homeTeam),
						away: optionFor(fixture.awayTeam),
						homeScore: fixture.homeScore === null ? "" : String(fixture.homeScore),
						awayScore: fixture.awayScore === null ? "" : String(fixture.awayScore),
					}))
				);
				setDeletedIds([]);
				setRowErrors({});
			})
			.catch((error: unknown) => {
				const message = error instanceof Error ? error.message : "";

				if (message.includes("23505") || message.includes("unique")) {
					showToast(
						"A match is already saved twice. Remove the duplicate row.",
						ToastTypes.ERROR
					);
				} else {
					console.error("Failed to save fixtures:", error);
					showToast("Could not save. Try again.", ToastTypes.ERROR);
				}
			})
			.finally(() => setIsSaving(false));
	}, [rows, deletedIds, isSaving]);

	if (!isUnlocked) {
		return (
			<div className={`${styles.operations} ${styles.operationsGate}`}>
				<PinGate expectedPin={STAFF_PIN} onUnlock={unlock} />
			</div>
		);
	}

	return (
		<div className={styles.operations}>
			<div className={styles.shell}>
				<TopBar />
				<SideMenu active="fixtures" />

				<div className={`${styles.panel} ${styles.panelHome}`}>
					<section className={styles.card}>
						<div className={styles.centerHeader}>
							<div>
								<b>Fixtures - {SENIOR_SEASON_LABEL}</b>
								<p className={styles.centerAddress}>
									Home Team | Home Score | Away Score | Away Team
								</p>
							</div>
						</div>
					</section>

					{isLoading ? (
						<p className={styles.notice}>Loading...</p>
					) : (
						<div className={styles.seniorFixtureList}>
							{rows.map((row, index) => (
								<section
									key={row.key}
									className={`${styles.seniorFixtureRow} ${
										rowErrors[row.key] ? styles.seniorFixtureRowError : ""
									}`}
								>
									<div className={styles.seniorRowHead}>
										<b>Match {index + 1}</b>
										<button
											type="button"
											className={styles.seniorDelete}
											onClick={() => removeRow(row.key)}
											aria-label={`Remove match ${index + 1}`}
										>
											Remove
										</button>
									</div>

									<div className={styles.seniorFieldWide}>
										<Select
											label="Home Team"
											placeholder="Select home team"
											options={TEAM_OPTIONS}
											selectedOption={row.home}
											onChange={(option) =>
												updateRow(row.key, { home: option })
											}
											isRequired
										/>
									</div>

									<div className={styles.inputBox}>
										<InputBox
											label="Home Score"
											placeholder="0"
											value={row.homeScore}
											type={InputTextTypes.NUMBER}
											isError={false}
											errorMessage=""
											onChange={(value) =>
												updateRow(row.key, { homeScore: value })
											}
											onClear={() => updateRow(row.key, { homeScore: "" })}
											id={`senior-home-score-${row.key}`}
										/>
									</div>

									<div className={styles.inputBox}>
										<InputBox
											label="Away Score"
											placeholder="0"
											value={row.awayScore}
											type={InputTextTypes.NUMBER}
											isError={false}
											errorMessage=""
											onChange={(value) =>
												updateRow(row.key, { awayScore: value })
											}
											onClear={() => updateRow(row.key, { awayScore: "" })}
											id={`senior-away-score-${row.key}`}
										/>
									</div>

									<div className={styles.seniorFieldWide}>
										<Select
											label="Away Team"
											placeholder="Select away team"
											options={TEAM_OPTIONS}
											selectedOption={row.away}
											onChange={(option) =>
												updateRow(row.key, { away: option })
											}
											isRequired
										/>
									</div>

									{rowErrors[row.key] && (
										<p className={styles.seniorRowError}>{rowErrors[row.key]}</p>
									)}
								</section>
							))}

							<button
								type="button"
								className={styles.seniorAddRow}
								onClick={addRow}
							>
								+ Add match
							</button>
						</div>
					)}

					<div className={styles.stickySaveBar}>
						<Button
							onClick={handleSave}
							text={isSaving ? "Saving..." : `Save ${rows.length} ${rows.length === 1 ? "match" : "matches"}`}
							color={Colors.PRIMARY}
							shape={Shapes.ROUNDED}
							size={ButtonSizes.LARGE}
							isDisabled={isSaving || isLoading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FixturesApp;
