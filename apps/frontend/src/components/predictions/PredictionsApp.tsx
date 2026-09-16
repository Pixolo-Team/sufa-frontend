// REACT //
import { useCallback, useEffect, useState } from "react";

// TYPES //
import type {
	FixtureData,
	GameweekPredictionsData,
	PredictionPickData,
	PredictorId,
} from "@/types/predictions";

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
import { getGameweekFixturesRequest } from "@/services/api/football-data.api.service";
import {
	getGameweekPredictionsRequest,
	savePredictionsRequest,
} from "@/services/api/predictions.api.service";
import {
	getLocalPredictions,
	saveLocalPredictions,
} from "@/services/predictions.local.service";

// UTILS //
import { renderPredictionsImage } from "@/utils/predictions-image.util";

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

/** EPL Score Predictor — GW grid → predictions (Abhay | Harsh) → IG export. */
const PredictionsApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(
		() => window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true"
	);
	const [screen, setScreen] = useState<Screen>("gameweeks");
	const [gameweek, setGameweek] = useState<number | null>(null);
	const [predictor, setPredictor] = useState<PredictorId>("abhay");

	const [fixtures, setFixtures] = useState<FixtureData[]>([]);
	const [fixturesState, setFixturesState] = useState<"idle" | "loading" | "error" | "ready">("idle");
	const [fixturesError, setFixturesError] = useState("");

	const [saved, setSaved] = useState<GameweekPredictionsData | null>(null);
	const [edits, setEdits] = useState<EditsByPredictor>(emptyEdits);
	const [isSaving, setIsSaving] = useState(false);

	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [isDrawing, setIsDrawing] = useState(false);

	const unlock = useCallback(() => {
		window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
		setIsUnlocked(true);
	}, []);

	/** Fixtures + saved picks for the open gameweek */
	const loadGameweek = useCallback(async (gw: number) => {
		setFixturesState("loading");
		setFixturesError("");
		setFixtures([]);
		setSaved(null);
		setEdits(emptyEdits());
		setImageBlob(null);
		setImageUrl("");

		try {
			const [fetchedFixtures, fetchedSaved] = await Promise.all([
				getGameweekFixturesRequest(PREDICTIONS_SEASON, gw),
				// Backend down ho to device-local picks dikhao — Export dono se chalta hai.
				getGameweekPredictionsRequest(PREDICTIONS_SEASON, gw).catch(() =>
					getLocalPredictions(PREDICTIONS_SEASON, gw)
				),
			]);

			setFixtures(fetchedFixtures);
			setFixturesState("ready");

			if (fetchedSaved) {
				setSaved(fetchedSaved);
				setEdits({
					abhay: picksToEdits(
						fetchedSaved.predictions.find((item) => item.predictor === "abhay")?.picks
					),
					harsh: picksToEdits(
						fetchedSaved.predictions.find((item) => item.predictor === "harsh")?.picks
					),
				});
			}

			if (fetchedFixtures.length === 0) {
				showToast("No fixtures published for this gameweek yet", ToastTypes.WARNING);
			}
		} catch (error) {
			setFixturesState("error");
			setFixturesError(
				error instanceof Error ? error.message : "Could not load fixtures"
			);
		}
	}, []);

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

	/** Save active predictor's picks — team names + scores snapshot */
	const savePredictions = useCallback(async () => {
		if (gameweek === null || isSaving) return;

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

		const picks: PredictionPickData[] = fixtures.map((fixture) => ({
			fixtureId: fixture.id,
			homeTeam: fixture.homeTeam,
			awayTeam: fixture.awayTeam,
			homeTla: fixture.homeTla,
			awayTla: fixture.awayTla,
			homeScore: Number(drafts[fixture.id].h),
			awayScore: Number(drafts[fixture.id].a),
		}));

		if (picks.some((pick) => pick.homeScore > 20 || pick.awayScore > 20)) {
			showToast("Scores must be 0 - 20", ToastTypes.WARNING);
			return;
		}

		setIsSaving(true);

		try {
			await savePredictionsRequest(PREDICTIONS_SEASON, gameweek, predictor, picks);
			const refreshed = await getGameweekPredictionsRequest(PREDICTIONS_SEASON, gameweek);
			setSaved(refreshed);
			showToast(`${predictorLabel(predictor)}'s predictions saved`, ToastTypes.SUCCESS);
		} catch {
			// Backend unreachable (jaise abhi api.skorostunited.com) — is device
			// pe save karo taaki Export na ruke. Backend up hote hi dobara Save
			// dabane pe server pe sync ho jayega.
			saveLocalPredictions(PREDICTIONS_SEASON, gameweek, predictor, picks);
			setSaved(getLocalPredictions(PREDICTIONS_SEASON, gameweek));
			showToast("Backend offline — is device pe save hua", ToastTypes.WARNING);
		} finally {
			setIsSaving(false);
		}
	}, [edits, fixtures, gameweek, isSaving, predictor]);

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
			predictions: saved?.predictions ?? [],
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
	const abhayCount =
		saved?.predictions.find((item) => item.predictor === "abhay")?.picks.length ?? 0;
	const harshCount =
		saved?.predictions.find((item) => item.predictor === "harsh")?.picks.length ?? 0;

	return (
		<div className={opsStyles.operations}>
			<div className={`${opsStyles.shell} ${styles.wideShell}`}>
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

					<span className={opsStyles.lockChip}>
						<OperationsIcon name="lock" size={12} />
						Unlocked
					</span>
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
						</div>
						<p className={opsStyles.notice}>Staff tool. Not linked from the public site.</p>
					</div>
				)}

				{/* ---------- Screen 2: predict ---------- */}
				{screen === "predict" && gameweek !== null && (
					<div className={opsStyles.cardStack}>
						<div className={opsStyles.card}>
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
							<p className={opsStyles.qrHint}>
								Saved: Abhay {abhayCount} · Harsh {harshCount} picks
							</p>
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
												<div className={styles.fixtureTeams}>
													<span>{fixture.homeTeam}</span>
													<span>{fixture.awayTeam}</span>
												</div>
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
											</div>
										);
									})}
								</div>
							)}

							{fixturesState === "ready" && fixtures.length > 0 && (
								<div className={opsStyles.buttonRow}>
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
										onClick={() => {
											void savePredictions();
										}}
									/>
								</div>
							)}
						</div>
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
							)}

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
	);
};

export default PredictionsApp;
