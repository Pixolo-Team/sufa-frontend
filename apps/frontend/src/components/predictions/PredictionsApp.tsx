// REACT //
import { useCallback, useEffect, useRef, useState } from "react";

// TYPES //
import type {
	GameweekPredictionsData,
	PredictionPickData,
	PredictorId,
	SavedRoundData,
} from "@/types/predictions";
import type { MatchdayData } from "@/services/api/openfootball.api.service";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import opsStyles from "../operations/operations.module.scss";
import styles from "./predictions.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";
import PinGate from "../operations/PinGate";
import Button from "@/neevo/components/button/Button";

// DATA //
import {
	PREDICTORS,
	PREDICTIONS_SEASON,
	gameweekNumbers,
} from "@/data/predictions.data";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";
import {
	getMatchdayFixturesRequest,
	prefetchSeasonMatches,
	shortTeamName,
} from "@/services/api/openfootball.api.service";
import {
	getGameweekPredictionsRequest,
	roundToPicks,
	saveGameweekPointsRequest,
	savePredictionsRequest,
} from "@/services/api/predictions.api.service";
import {
	getLocalPredictions,
	saveLocalPoints,
	saveLocalPredictions,
} from "@/services/predictions.local.service";

// UTILS //
import { renderPredictionsImage } from "@/utils/predictions-image.util";
import {
	calculatePredictorPoints,
	type PredictorScore,
	type SourceResult,
} from "@/utils/predictions-scoring.util";

// Same device key + PIN source as operations — one unlock opens both staff tools.
const UNLOCK_STORAGE_KEY = "skorost-ops-unlocked";
const STAFF_PIN = import.meta.env.PUBLIC_STAFF_PIN ?? "";

type Screen = "gameweeks" | "predict" | "export";

type ScoreDraft = { h: string; a: string };
type EditsByPredictor = Record<PredictorId, Record<number, ScoreDraft>>;

const emptyEdits = (): EditsByPredictor => ({ abhay: {}, harsh: {} });

const picksToEdits = (
	picks: PredictionPickData[] | undefined
): Record<number, ScoreDraft> => {
	const edits: Record<number, ScoreDraft> = {};
	for (const pick of picks ?? []) {
		edits[pick.fixtureId] = { h: String(pick.homeScore), a: String(pick.awayScore) };
	}
	return edits;
};

const predictorLabel = (id: PredictorId) =>
	PREDICTORS.find((item) => item.id === id)?.label ?? id;

/** "2026-08-22T17:30:00" → "Sat 22 Aug · 5:30 PM" (parts-parsed, no TZ shift). */
const formatKickoff = (utcDate: string): string => {
	const [datePart = "", timePart = ""] = utcDate.split("T");
	const [year, month, day] = datePart.split("-").map(Number);
	const [hour = 0, minute = 0] = timePart.split(":").map(Number);

	if (!year || !month || !day) return "";

	const weekday = new Date(year, month - 1, day).toLocaleDateString("en-GB", {
		weekday: "short",
	});
	const monthName = new Date(year, month - 1, day).toLocaleDateString("en-GB", {
		month: "short",
	});
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;
	const period = hour < 12 ? "AM" : "PM";

	return `${weekday} ${day} ${monthName} · ${hour12}:${String(minute).padStart(2, "0")} ${period}`;
};

/** EPL Score Predictor — GW grid → predictions (Abhay | Harsh) → IG export. */
const PredictionsApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(
		() => window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true"
	);
	const [screen, setScreen] = useState<Screen>("gameweeks");
	const [gameweek, setGameweek] = useState<number | null>(null);
	const [predictor, setPredictor] = useState<PredictorId>("abhay");

	const [matchday, setMatchday] = useState<MatchdayData | null>(null);
	const [fixturesState, setFixturesState] = useState<"idle" | "loading" | "error" | "ready">("idle");
	const [fixturesError, setFixturesError] = useState("");

	const fixtures = matchday?.fixtures ?? [];

	const [saved, setSaved] = useState<GameweekPredictionsData | null>(null);
	const [edits, setEdits] = useState<EditsByPredictor>(emptyEdits);
	const [isSaving, setIsSaving] = useState(false);
	const [isCalculating, setIsCalculating] = useState(false);
	const [calcResult, setCalcResult] = useState<{
		abhay: PredictorScore;
		harsh: PredictorScore;
	} | null>(null);

	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [isDrawing, setIsDrawing] = useState(false);

	const unlock = useCallback(() => {
		window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
		setIsUnlocked(true);
	}, []);

	// Warm the fixtures cache while the user browses gameweeks.
	useEffect(() => {
		if (isUnlocked) prefetchSeasonMatches(PREDICTIONS_SEASON);
	}, [isUnlocked]);

	// Guards stale loads when the user jumps between gameweeks quickly.
	const loadSeq = useRef(0);

	/** Final scores from the source JSON (null = not played yet) */
	const toSourceResults = useCallback((md: MatchdayData): SourceResult[] => {
		return md.sourceMatches.map((match) => {
			const ft = match.score?.ft;
			return {
				team1: match.team1,
				team2: match.team2,
				ft:
					Array.isArray(ft) &&
					typeof ft[0] === "number" &&
					typeof ft[1] === "number"
						? { home: ft[0], away: ft[1] }
						: null,
			};
		});
	}, []);

	/**
	 * Results for a finished week with saved picks — null otherwise, so
	 * nothing auto-shows for live/future gameweeks.
	 */
	const buildCalcResult = useCallback(
		(md: MatchdayData | null, data: GameweekPredictionsData | null) => {
			if (!md || !data) return null;
			const results = toSourceResults(md);
			if (results.length === 0 || !results.every((item) => item.ft !== null)) {
				return null;
			}
			if (!data.predictions.some((item) => item.round.matches.length > 0)) {
				return null;
			}
			return {
				abhay: calculatePredictorPoints(
					data.predictions.find((item) => item.predictor === "abhay")?.round,
					results
				),
				harsh: calculatePredictorPoints(
					data.predictions.find((item) => item.predictor === "harsh")?.round,
					results
				),
			};
		},
		[toSourceResults]
	);

	/** Prefill score boxes from a saved snapshot */
	const applySaved = useCallback(
		(fetchedSaved: GameweekPredictionsData, gw: number) => {
			setSaved(fetchedSaved);
			setEdits({
				abhay: picksToEdits(
					roundToPicks(
						fetchedSaved.predictions.find((item) => item.predictor === "abhay")
							?.round,
						gw
					)
				),
				harsh: picksToEdits(
					roundToPicks(
						fetchedSaved.predictions.find((item) => item.predictor === "harsh")
							?.round,
						gw
					)
				),
			});
		},
		[]
	);

	/**
	 * Fixtures render the moment the season JSON arrives — saved snapshots
	 * load in the background and never block the UI (waiting on the cloud
	 * stalled every GW open when the network is slow).
	 */
	const loadGameweek = useCallback(
		async (gw: number) => {
			const seq = ++loadSeq.current;
			setFixturesState("loading");
			setFixturesError("");
			setMatchday(null);
			setSaved(null);
			setEdits(emptyEdits());
			setCalcResult(null);
			setImageBlob(null);
			setImageUrl("");

			let fetchedMatchday: MatchdayData | null = null;

			try {
				fetchedMatchday = await getMatchdayFixturesRequest(PREDICTIONS_SEASON, gw);
			} catch (error) {
				if (seq !== loadSeq.current) return;
				setFixturesState("error");
				setFixturesError(
					error instanceof Error ? error.message : "Could not load fixtures"
				);
				return;
			}

			if (seq !== loadSeq.current) return;
			setMatchday(fetchedMatchday);
			setFixturesState("ready");

			if (fetchedMatchday.fixtures.length === 0) {
				showToast("No fixtures published for this gameweek yet", ToastTypes.WARNING);
			}

			// Saved snapshots arrive whenever — prefill silently when they do.
			// Finished weeks with saved picks show their results right away.
			const showAutoResults = (fetchedSaved: GameweekPredictionsData) => {
				applySaved(fetchedSaved, gw);
				const auto = buildCalcResult(fetchedMatchday, fetchedSaved);
				if (auto) setCalcResult(auto);
			};

			try {
				const fetchedSaved = await getGameweekPredictionsRequest(
					PREDICTIONS_SEASON,
					gw
				);
				if (seq !== loadSeq.current) return;
				showAutoResults(fetchedSaved);
			} catch {
				if (seq !== loadSeq.current) return;
				showAutoResults(getLocalPredictions(PREDICTIONS_SEASON, gw));
			}
		},
		[applySaved, buildCalcResult]
	);

	const openGameweek = (gw: number, target: Screen = "predict") => {
		setGameweek(gw);
		setPredictor("abhay");
		setScreen(target);
		void loadGameweek(gw);
	};

	const goHome = () => {
		setScreen("gameweeks");
		setGameweek(null);
	};

	/** One score box edited */
	const setScore = (fixtureId: number, side: "h" | "a", value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 2);
		setEdits((previous) => ({
			...previous,
			[predictor]: {
				...previous[predictor],
				[fixtureId]: { ...previous[predictor][fixtureId], [side]: digits } as ScoreDraft,
			},
		}));
	};

	/** Save active predictor's full matchday JSON — source rows + scores */
	const savePredictions = useCallback(async () => {
		if (gameweek === null || isSaving || !matchday) return;

		const drafts = edits[predictor];
		const missing = fixtures.filter(
			(fixture) =>
				drafts[fixture.id]?.h === undefined ||
				drafts[fixture.id]?.h === "" ||
				drafts[fixture.id]?.a === undefined ||
				drafts[fixture.id]?.a === ""
		);

		if (missing.length > 0) {
			showToast(
				`${missing.length} match${missing.length > 1 ? "es" : ""} still missing scores`,
				ToastTypes.WARNING
			);
			return;
		}

		const round: SavedRoundData = {
			name: matchday.roundName,
			matches: matchday.sourceMatches.map((match, index) => {
				const fixtureId = fixtures[index]?.id ?? gameweek * 100 + index;
				return {
					date: match.date,
					...(match.time ? { time: match.time } : {}),
					team1: match.team1,
					team2: match.team2,
					predictedHome: Number(drafts[fixtureId].h),
					predictedAway: Number(drafts[fixtureId].a),
				};
			}),
		};

		if (
			round.matches.some(
				(match) =>
					(match.predictedHome ?? 0) > 20 || (match.predictedAway ?? 0) > 20
			)
		) {
			showToast("Scores must be 0 - 20", ToastTypes.WARNING);
			return;
		}

		setIsSaving(true);

		try {
			await savePredictionsRequest(PREDICTIONS_SEASON, gameweek, predictor, round);
			const refreshed = await getGameweekPredictionsRequest(PREDICTIONS_SEASON, gameweek);
			setSaved(refreshed);
			showToast(`${predictorLabel(predictor)}'s predictions saved`, ToastTypes.SUCCESS);
		} catch (error) {
			// Cloud sync failed — save on this device so Export keeps working.
			// Pressing Save again once the network is back syncs to Supabase.
			// The exact reason goes into the toast + console so setup issues
			// (missing env, table/RLS not run) are visible instead of silent.
			const detail = error instanceof Error ? error.message : "unknown error";
		console.error("[predictions] save failed:", error);
		saveLocalPredictions(PREDICTIONS_SEASON, gameweek, predictor, round);
		setSaved(getLocalPredictions(PREDICTIONS_SEASON, gameweek));
		showToast(`Sync failed (${detail}) — saved on this device`, ToastTypes.WARNING);
		} finally {
			setIsSaving(false);
		}
	}, [edits, fixtures, gameweek, isSaving, matchday, predictor]);

	/**
	 * CALCULATE — compare saved predictions against the final scores in the
	 * same openfootball JSON (exact = 5, outcome = 3), show the gameweek
	 * points and persist them on the gameweek row.
	 */
	const calculateScores = useCallback(async () => {
		if (gameweek === null || isCalculating || !matchday) return;

		const results = toSourceResults(matchday);

		if (!results.some((item) => item.ft !== null)) {
			showToast("Results not published yet — check back after the matchday", ToastTypes.WARNING);
			return;
		}

		setIsCalculating(true);

		try {
			const abhay = calculatePredictorPoints(
				saved?.predictions.find((item) => item.predictor === "abhay")?.round,
				results
			);
			const harsh = calculatePredictorPoints(
				saved?.predictions.find((item) => item.predictor === "harsh")?.round,
				results
			);
			setCalcResult({ abhay, harsh });

			const points = { abhay: abhay.points, harsh: harsh.points };

			try {
				await saveGameweekPointsRequest(PREDICTIONS_SEASON, gameweek, points);
				const refreshed = await getGameweekPredictionsRequest(
					PREDICTIONS_SEASON,
					gameweek
				);
				setSaved(refreshed);
				showToast(
					`Points saved — Abhay ${points.abhay} · Harsh ${points.harsh}`,
					ToastTypes.SUCCESS
				);
			} catch (error) {
				const detail = error instanceof Error ? error.message : "unknown error";
				console.error("[predictions] points save failed:", error);
				saveLocalPoints(PREDICTIONS_SEASON, gameweek, points);
				setSaved(getLocalPredictions(PREDICTIONS_SEASON, gameweek));
				showToast(`Sync failed (${detail}) — points saved on this device`, ToastTypes.WARNING);
			}
		} finally {
			setIsCalculating(false);
		}
	}, [gameweek, isCalculating, matchday, saved, toSourceResults]);

	// Draw the 4:5 export image whenever the export screen has data
	useEffect(() => {
		if (screen !== "export" || gameweek === null) return;
		if (fixturesState !== "ready" || fixtures.length === 0) return;

		let isActive = true;
		setIsDrawing(true);

		renderPredictionsImage({
			season: PREDICTIONS_SEASON,
			gameweek,
			fixtures,
			predictions: (saved?.predictions ?? []).map((item) => ({
				predictor: item.predictor,
				picks: roundToPicks(item.round, gameweek),
			})),
		}).then((blob) => {
			if (!isActive) return;
			setIsDrawing(false);
			if (!blob) {
				showToast("Could not draw the image", ToastTypes.ERROR);
				return;
			}
			setImageBlob(blob);
			setImageUrl((previous) => {
				if (previous) URL.revokeObjectURL(previous);
				return URL.createObjectURL(blob);
			});
		});

		return () => {
			isActive = false;
		};
	}, [screen, gameweek, fixtures, fixturesState, saved]);

	useEffect(
		() => () => {
			if (imageUrl) URL.revokeObjectURL(imageUrl);
		},
		[imageUrl]
	);

	const imageFileName = `skorost-predictions-gw${gameweek ?? "x"}.png`;

	const downloadImage = useCallback(() => {
		if (!imageUrl) return;
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = imageFileName;
		link.click();
	}, [imageUrl, imageFileName]);

	const shareImage = useCallback(async () => {
		if (!imageBlob) return;
		const file = new File([imageBlob], imageFileName, { type: "image/png" });

		if (!navigator.canShare?.({ files: [file] })) {
			downloadImage();
			showToast("Sharing unavailable. Image downloaded.", ToastTypes.WARNING);
			return;
		}

		try {
			await navigator.share({
				files: [file],
				text: `Gameweek ${gameweek} predictions`,
			});
		} catch {
			// User cancel lands here too.
		}
	}, [imageBlob, imageFileName, gameweek, downloadImage]);

	const copyImage = useCallback(async () => {
		if (!imageBlob) return;
		try {
			await navigator.clipboard.write([new ClipboardItem({ "image/png": imageBlob })]);
			showToast("Image copied", ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy the image. Try Download.", ToastTypes.ERROR);
		}
	}, [imageBlob]);

	if (!isUnlocked) {
		return (
			<div className={`${opsStyles.operations} ${opsStyles.operationsGate}`}>
				<PinGate expectedPin={STAFF_PIN} onUnlock={unlock} />
			</div>
		);
	}

	const activeColor = PREDICTORS.find((item) => item.id === predictor)?.color;
	const savedPickCount = (id: PredictorId): number =>
		saved?.predictions
			.find((item) => item.predictor === id)
			?.round.matches.filter(
				(match) => match.predictedHome !== null && match.predictedAway !== null
			).length ?? 0;
	const abhayCount = savedPickCount("abhay");
	const harshCount = savedPickCount("harsh");

	return (
		<div className={opsStyles.operations}>
			<div className={styles.pageShell}>
				<div className={opsStyles.topBar}>
					{screen === "gameweeks" ? (
						<span className={opsStyles.brand}>
							<img
								className={opsStyles.brandLogo}
								src="/images/skorost.svg"
								alt="Skorost United Football Academy"
								width="71"
								height="34"
							/>
							<span className={opsStyles.brandDivider} aria-hidden="true" />
							<span className={opsStyles.brandLabel}>Predictor</span>
						</span>
					) : (
						<>
							<button
								type="button"
								aria-label="Back"
								className={opsStyles.backButton}
								onClick={goHome}
							>
								<OperationsIcon name="back" size={20} />
							</button>
							<div className={opsStyles.topBarTitle}>
								<b>
									Gameweek {gameweek} · {screen === "predict" ? "Predict" : "Export"}
								</b>
								<small>Premier League {PREDICTIONS_SEASON}/{String(PREDICTIONS_SEASON + 1).slice(2)}</small>
							</div>
						</>
					)}

				</div>

				{/* ---------- Screen 1: GW grid ---------- */}
				{screen === "gameweeks" && (
					<div className={opsStyles.cardStack}>
						<div className={opsStyles.card}>
							<span className={opsStyles.sectionLabel}>Game week</span>
							<div className={styles.gwGrid}>
								{gameweekNumbers().map((gw) => (
									<button
										key={gw}
										type="button"
										className={styles.gwButton}
										onClick={() => openGameweek(gw)}
									>
										GW{gw}
										<small>Predict</small>
									</button>
								))}
							</div>
							<div className={styles.actionStack}>
								<Button
									text="See score"
									variant={Variants.OUTLINE}
									color={Colors.NEUTRAL_DARK}
									shape={Shapes.ROUNDED}
									size={ButtonSizes.LARGE}
									onClick={() => {
										window.location.href = "/scores";
									}}
								/>
							</div>
						</div>
						<p className={opsStyles.notice}>Staff tool. Not linked from the public site.</p>
					</div>
				)}

				{/* ---------- Screen 2: predict ---------- */}
				{screen === "predict" && gameweek !== null && (
					<div className={opsStyles.cardStack}>
						<div className={styles.predictLayout}>
							<div className={`${opsStyles.card} ${styles.predictSide}`}>
								<span className={opsStyles.sectionLabel}>Predicting as</span>
								<div
									className={styles.predictorTabs}
									style={{ ["--tab-color" as string]: activeColor }}
								>
									{PREDICTORS.map((item) => (
										<button
											key={item.id}
											type="button"
											className={`${styles.predictorTab} ${
												predictor === item.id ? styles.predictorTabActive : ""
											}`}
											style={{ ["--tab-color" as string]: item.color }}
											onClick={() => setPredictor(item.id)}
										>
											<span
												className={styles.predictorDot}
												style={{ backgroundColor: item.color }}
											/>
											{item.label}
										</button>
									))}
								</div>
								{/* Status lines removed — tabs lead straight into actions */}

								{fixturesState === "ready" && fixtures.length > 0 && (
									<div className={styles.actionStack}>
										<Button
											text="Export"
											variant={Variants.OUTLINE}
											color={Colors.NEUTRAL_DARK}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											onClick={() => setScreen("export")}
										/>
										<Button
											text={isSaving ? "Saving…" : "Save"}
											color={Colors.PRIMARY}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											isDisabled={isSaving}
											extraClass="pred-solid-btn"
											onClick={() => {
												void savePredictions();
											}}
										/>
										{/* Only once the week is over — every match has a final score */}
										{(matchday?.sourceMatches ?? []).length > 0 &&
											(matchday?.sourceMatches ?? []).every((match) =>
												Array.isArray(match.score?.ft)
											) && (
												<Button
													text={isCalculating ? "Calculating…" : "Calculate"}
													variant={Variants.OUTLINE}
													color={Colors.NEUTRAL_DARK}
													shape={Shapes.ROUNDED}
													size={ButtonSizes.LARGE}
													isDisabled={isCalculating}
													onClick={() => {
														void calculateScores();
													}}
												/>
											)}
									</div>
								)}
							</div>

							<div className={opsStyles.card}>
							<span className={opsStyles.sectionLabel}>
								Gameweek {gameweek} fixtures
							</span>

							{fixturesState === "loading" && (
								<p className={opsStyles.notice}>Loading fixtures…</p>
							)}

							{fixturesState === "error" && (
								<>
									<p className={opsStyles.notice}>{fixturesError}</p>
									<div className={opsStyles.buttonRow}>
										<Button
											text="Retry"
											variant={Variants.OUTLINE}
											color={Colors.NEUTRAL_DARK}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											onClick={() => void loadGameweek(gameweek)}
										/>
									</div>
								</>
							)}

							{fixturesState === "ready" && fixtures.length === 0 && (
								<p className={opsStyles.notice}>
									No fixtures published for this gameweek yet — check back later.
								</p>
							)}

							{fixturesState === "ready" && fixtures.length > 0 && (
								<div
									className={styles.fixtureList}
									style={{ ["--tab-color" as string]: activeColor }}
								>
									{fixtures.map((fixture) => {
										const draft = edits[predictor][fixture.id] ?? { h: "", a: "" };
										return (
											<div key={fixture.id} className={styles.fixtureRow}>
												<p className={styles.fixtureKickoff}>
													{formatKickoff(fixture.utcDate)}
												</p>
												<div className={styles.fixtureMatch}>
													<span className={styles.fixtureHome}>
														{fixture.homeTeam}
														<img
															src={fixture.homeLogo}
															alt=""
															width="26"
															height="26"
															loading="lazy"
														/>
													</span>
													<div className={styles.scoreInputs}>
														<input
															className={styles.scoreInput}
															type="number"
															min={0}
															max={20}
															inputMode="numeric"
															aria-label={`${fixture.homeTeam} score`}
															value={draft.h}
															onChange={(event) =>
																setScore(fixture.id, "h", event.target.value)
															}
														/>
														<span className={styles.scoreDash}>–</span>
														<input
															className={styles.scoreInput}
															type="number"
															min={0}
															max={20}
															inputMode="numeric"
															aria-label={`${fixture.awayTeam} score`}
															value={draft.a}
															onChange={(event) =>
																setScore(fixture.id, "a", event.target.value)
															}
														/>
													</div>
													<span className={styles.fixtureAway}>
														<img
															src={fixture.awayLogo}
															alt=""
															width="26"
															height="26"
															loading="lazy"
														/>
														{fixture.awayTeam}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}

							</div>
						</div>

						{/* Calculated points for this gameweek */}
						{calcResult && gameweek !== null && (
							<div className={opsStyles.card}>
								<span className={opsStyles.sectionLabel}>
									Gameweek {gameweek} results
								</span>
								<div className={styles.resultsTotals}>
									{PREDICTORS.map((item) => {
										const score =
											item.id === "abhay" ? calcResult.abhay : calcResult.harsh;
										return (
											<div key={item.id} className={styles.resultsTotal}>
												<span
													className={styles.predictorDot}
													style={{ backgroundColor: item.color }}
												/>
												<b>{item.label}</b>
												<span className={styles.resultsPoints}>
													{score.points} pts
												</span>
												<small>
													{score.played} played
													{score.pending > 0 ? ` · ${score.pending} pending` : ""}
												</small>
											</div>
										);
									})}
								</div>
								<div className={styles.resultsList}>
									{calcResult.abhay.matches.map((match, index) => {
										const harshMatch = calcResult.harsh.matches[index];
										return (
											<div key={index} className={styles.resultsRow}>
												<p className={styles.resultsFixture}>
													{shortTeamName(match.team1)}{" "}
													{match.actual
														? `${match.actual.home}–${match.actual.away}`
														: "vs"}{" "}
													{shortTeamName(match.team2)}
												</p>
												<div className={styles.resultsPicks}>
													<span>
														Abhay{" "}
														{match.predicted
															? `${match.predicted.home}–${match.predicted.away}`
															: "–"}{" "}
														· +{match.points}
													</span>
													<span>
														Harsh{" "}
														{harshMatch?.predicted
															? `${harshMatch.predicted.home}–${harshMatch.predicted.away}`
															: "–"}{" "}
														· +{harshMatch?.points ?? 0}
													</span>
												</div>
											</div>
										);
									})}
								</div>
								<p className={opsStyles.qrHint}>
									Exact score = 5 pts · Right outcome = 3 pts
								</p>
							</div>
						)}
					</div>
				)}

				{/* ---------- Screen 3: export ---------- */}
				{screen === "export" && gameweek !== null && (
					<div className={opsStyles.cardStack}>
						<div className={opsStyles.card}>
							<span className={opsStyles.sectionLabel}>Instagram post · 4:5</span>

							{fixturesState === "loading" && (
								<p className={opsStyles.notice}>Loading predictions…</p>
							)}

							{fixturesState === "error" && (
								<>
									<p className={opsStyles.notice}>{fixturesError}</p>
									<div className={opsStyles.buttonRow}>
										<Button
											text="Retry"
											variant={Variants.OUTLINE}
											color={Colors.NEUTRAL_DARK}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											onClick={() => void loadGameweek(gameweek)}
										/>
									</div>
								</>
							)}

							{fixturesState === "ready" && (
								<div className={styles.exportLayout}>
									<div className={opsStyles.previewBody}>
										{isDrawing || !imageUrl ? (
											<p className={opsStyles.qrHint}>Drawing image…</p>
										) : (
											<img
												className={styles.exportPreview}
												src={imageUrl}
												alt={`Gameweek ${gameweek} predictions — Abhay vs Harsh`}
											/>
										)}
										{(abhayCount === 0 || harshCount === 0) && (
											<p className={opsStyles.qrHint}>
												{abhayCount === 0 && harshCount === 0
													? "No predictions saved yet — empty rows show as – : –."
													: `Only ${abhayCount === 0 ? "Harsh" : "Abhay"} saved so far — the other column shows – : –.`}
											</p>
										)}
									</div>

									<div className={styles.exportSide}>
										<div className={opsStyles.buttonRow}>
											<Button
												text="Back to Predict"
												variant={Variants.OUTLINE}
												color={Colors.NEUTRAL_DARK}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												onClick={() => setScreen("predict")}
											/>
											<Button
												text="Download"
												color={Colors.PRIMARY}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												isDisabled={!imageBlob}
												extraClass="pred-solid-btn"
												onClick={downloadImage}
											/>
										</div>
										<div className={opsStyles.buttonRow}>
											<Button
												text="Copy image"
												variant={Variants.OUTLINE}
												color={Colors.NEUTRAL_DARK}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												isDisabled={!imageBlob}
												onClick={() => {
													void copyImage();
												}}
											/>
											<Button
												text="Send image"
												color={Colors.PRIMARY}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												isDisabled={!imageBlob}
												extraClass="pred-solid-btn"
												onClick={() => {
													void shareImage();
												}}
											/>
										</div>
										<p className={opsStyles.qrHint}>
											Send image opens the phone's share sheet — post it straight to Instagram.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PredictionsApp;
