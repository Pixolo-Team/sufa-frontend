// REACT //
import { useCallback, useEffect, useState } from "react";

// TYPES //
import type { GameweekScoreData } from "@/types/predictions";

// STYLES //
import opsStyles from "../operations/operations.module.scss";
import styles from "./predictions.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";
import PinGate from "../operations/PinGate";
import Button from "@/neevo/components/button/Button";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";

// DATA //
import { PREDICTIONS_SEASON, TOTAL_GAMEWEEKS } from "@/data/predictions.data";

// SERVICES //
import { getAllGameweekScoresRequest } from "@/services/api/predictions.api.service";

// Same device key + PIN source as the other staff tools.
const UNLOCK_STORAGE_KEY = "skorost-ops-unlocked";
const STAFF_PIN = import.meta.env.PUBLIC_STAFF_PIN ?? "";

const formatCell = (value: number | null): string =>
	value === null ? "–" : String(value);

/** Season scoreboard — Total row first, then GW1 to GW38. */
const ScoresApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(
		() => window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true"
	);
	const [rows, setRows] = useState<GameweekScoreData[]>([]);
	const [state, setState] = useState<"loading" | "error" | "ready">("loading");
	const [errorMessage, setErrorMessage] = useState("");

	const unlock = useCallback(() => {
		window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
		setIsUnlocked(true);
	}, []);

	const loadScores = useCallback(async () => {
		setState("loading");
		setErrorMessage("");

		try {
			setRows(await getAllGameweekScoresRequest(PREDICTIONS_SEASON));
			setState("ready");
		} catch (error) {
			setState("error");
			setErrorMessage(
				error instanceof Error ? error.message : "Could not load scores"
			);
		}
	}, []);

	useEffect(() => {
		if (isUnlocked) void loadScores();
	}, [isUnlocked, loadScores]);

	if (!isUnlocked) {
		return (
			<div className={`${opsStyles.operations} ${opsStyles.operationsGate}`}>
				<PinGate expectedPin={STAFF_PIN} onUnlock={unlock} />
			</div>
		);
	}

	const byGameweek = new Map(rows.map((row) => [row.gameweek, row]));
	const tableRows: GameweekScoreData[] = Array.from(
		{ length: TOTAL_GAMEWEEKS },
		(_, index) => {
			const gameweek = index + 1;
			return byGameweek.get(gameweek) ?? { gameweek, abhay: null, harsh: null };
		}
	);
	const totalAbhay = tableRows.reduce((sum, row) => sum + (row.abhay ?? 0), 0);
	const totalHarsh = tableRows.reduce((sum, row) => sum + (row.harsh ?? 0), 0);

	return (
		<div className={opsStyles.operations}>
			<div className={styles.pageShell}>
				<div className={opsStyles.topBar}>
					<button
						type="button"
						aria-label="Back"
						className={opsStyles.backButton}
						onClick={() => {
							window.location.href = "/predictions";
						}}
					>
						<OperationsIcon name="back" size={20} />
					</button>
					<div className={opsStyles.topBarTitle}>
						<b>Total Scores</b>
						<small>
							Premier League {PREDICTIONS_SEASON}/
							{String(PREDICTIONS_SEASON + 1).slice(2)}
						</small>
					</div>
				</div>

				<div className={opsStyles.cardStack}>
					<div className={opsStyles.card}>
						<span className={opsStyles.sectionLabel}>Abhay vs Harsh</span>

						{state === "loading" && (
							<p className={opsStyles.notice}>Loading scores…</p>
						)}

						{state === "error" && (
							<>
								<p className={opsStyles.notice}>{errorMessage}</p>
								<div className={opsStyles.buttonRow}>
									<Button
										text="Retry"
										variant={Variants.OUTLINE}
										color={Colors.NEUTRAL_DARK}
										shape={Shapes.ROUNDED}
										size={ButtonSizes.LARGE}
										onClick={() => void loadScores()}
									/>
								</div>
							</>
						)}

						{state === "ready" && (
							<div className={styles.scoresTableWrap}>
								<table className={styles.scoresTable}>
									<thead>
										<tr>
											<th>Gameweek</th>
											<th>Abhay</th>
											<th>Harsh</th>
										</tr>
									</thead>
									<tbody>
										<tr className={styles.scoresTotalRow}>
											<td>Total</td>
											<td>{totalAbhay}</td>
											<td>{totalHarsh}</td>
										</tr>
										{tableRows.map((row) => (
											<tr key={row.gameweek}>
												<td>GW{row.gameweek}</td>
												<td>{formatCell(row.abhay)}</td>
												<td>{formatCell(row.harsh)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{state === "ready" &&
						!tableRows.some((row) => row.abhay !== null || row.harsh !== null) && (
							<p className={opsStyles.notice}>
								No points calculated yet — open a gameweek and press Calculate.
							</p>
						)}
				</div>
			</div>
		</div>
	);
};

export default ScoresApp;
