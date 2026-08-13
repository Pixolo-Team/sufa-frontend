// REACT //
import { useCallback, useEffect, useState } from "react";

// TYPES //
import type {
	OperationsBatchData,
	OperationsCenterData,
	OperationsConfigData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import Segmented from "./Segmented";
import OperationsIcon from "./OperationsIcon";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import {
	buildShareFooterLines,
	buildShareLetterheadLines,
	formatBatchScheduleGrid,
	formatBatchTimingLines,
	formatPlanLabel,
	SHARE_DIVIDER,
} from "@/utils/operations.util";

type ShareFormat = "text" | "copy-image";
type ShareSections = {
	plans?: boolean;
	registration?: boolean;
	schedule?: boolean;
};
type PendingShare = {
	batch: OperationsBatchData;
	sections: ShareSections;
	title: string;
} | null;

interface BatchesListProps {
	centers: OperationsCenterData[];
	config: OperationsConfigData;
	registrationOptions: OperationsRegistrationOptionData[];
}

const buildHeaderLines = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	academyName: string
): string[] => [
	...buildShareLetterheadLines(academyName),
	"",
	`${center.name} Centre`,
	`*${batch.name}* · ${batch.ageGroup}`,
];

const buildFeeLines = (
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[]
): string[] => {
	// 2-day is only an alternate to 3-day - a batch with just a 2-day plan
	// (e.g. Focus Batch) must show it, not hide it behind an "on request" line.
	const hasThreeDayPlans = batch.plans.some((plan) => plan.daysPerWeek === 3);
	const visiblePlans = hasThreeDayPlans
		? batch.plans.filter((plan) => plan.daysPerWeek !== 2)
		: batch.plans;

	return [
		"💰 *FEE STRUCTURE*",
		"",
		...visiblePlans.map(
			(plan) => `- ${formatPlanLabel(plan)} — *${formatRupees(plan.price)}*`
		),
		hasThreeDayPlans && batch.plans.some((plan) => plan.daysPerWeek === 2)
			? "\n2 Days per Week pricing is available for the 12-month plan on request."
			: null,
		registrationOptions.length > 0 ? "\n🎽 *REGISTRATION PACKAGES*\n" : null,
		...registrationOptions.map(
			(item) => `- ${item.name} — ${formatRupees(item.price)}`
		),
	].filter((line): line is string => line !== null);
};

const buildTimingsLines = (batch: OperationsBatchData): string[] => [
	"🗓️ *TRAINING TIMINGS*",
	"",
	...formatBatchTimingLines(batch),
];

const buildVenueLines = (center: OperationsCenterData): string[] => [
	"📌 *TRAINING VENUE*",
	center.address,
];

const buildScheduleText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	academyName: string
): string =>
	[
		...buildHeaderLines(center, batch, academyName),
		"",
		SHARE_DIVIDER,
		"",
		...buildTimingsLines(batch),
		"",
		SHARE_DIVIDER,
		"",
		...buildVenueLines(center),
		"",
		...buildShareFooterLines(),
	].join("\n");

const buildFeeStructureText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[],
	academyName: string
): string =>
	[
		...buildHeaderLines(center, batch, academyName),
		"",
		SHARE_DIVIDER,
		"",
		...buildFeeLines(batch, registrationOptions),
		"",
		SHARE_DIVIDER,
		"",
		...buildVenueLines(center),
		"",
		...buildShareFooterLines(),
	].join("\n");

const buildBothText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[],
	academyName: string
): string =>
	[
		...buildHeaderLines(center, batch, academyName),
		"",
		SHARE_DIVIDER,
		"",
		...buildFeeLines(batch, registrationOptions),
		"",
		SHARE_DIVIDER,
		"",
		...buildTimingsLines(batch),
		"",
		SHARE_DIVIDER,
		"",
		...buildVenueLines(center),
		"",
		...buildShareFooterLines(),
	].join("\n");

const buildShareText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[],
	academyName: string,
	sections: ShareSections
): string =>
	sections.plans && sections.schedule
		? buildBothText(center, batch, registrationOptions, academyName)
		: sections.plans
			? buildFeeStructureText(center, batch, registrationOptions, academyName)
			: buildScheduleText(center, batch, academyName);

/** All batches, timings and plans - grouped by center tabs */
const BatchesList: React.FC<BatchesListProps> = ({
	centers,
	config,
	registrationOptions,
}) => {
	const [centerId, setCenterId] = useState(centers[0]?.id ?? "");
	const [pendingShare, setPendingShare] = useState<PendingShare>(null);
	const [openBatchId, setOpenBatchId] = useState(centers[0]?.batches[0]?.id ?? "");
	const [showTwoDayFees, setShowTwoDayFees] = useState<Record<string, boolean>>({});

	const center = centers.find((item) => item.id === centerId) ?? centers[0];

	useEffect(() => {
		setOpenBatchId(center?.batches[0]?.id ?? "");
		setShowTwoDayFees({});
	}, [center?.id, center?.batches]);

	// No number to open a DM with here (unlike Payments, this share is not tied
	// to one parent) - with no phone param this opens WhatsApp's own contact
	// picker. api.whatsapp.com, not wa.me - the wa.me short-link redirect
	// strips 4-byte UTF-8 (i.e. every emoji) on desktop before WhatsApp gets it.
	const shareText = useCallback((text: string) => {
		window.open(
			`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
			"_blank",
			"noopener"
		);
	}, []);

	// Just puts the image on the clipboard - staff paste it wherever they want
	// (WhatsApp or otherwise) by hand. No auto-share, no auto-download.
	const copyImage = useCallback(async (batch: OperationsBatchData) => {
		const imageSrc = batch.imageSrc;

		if (!imageSrc) {
			showToast("No batch image found.", ToastTypes.WARNING);
			return;
		}

		try {
			const response = await fetch(imageSrc);
			const blob = await response.blob();

			await navigator.clipboard.write([
				new ClipboardItem({ [blob.type || "image/png"]: blob }),
			]);
			showToast("Image Copied", ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy the image", ToastTypes.ERROR);
		}
	}, []);

	useEffect(() => {
		if (!pendingShare) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setPendingShare(null);
		};

		window.addEventListener("keydown", onKeyDown);

		return () => window.removeEventListener("keydown", onKeyDown);
	}, [pendingShare]);

	/** One handler for both formats, so the modal buttons stay identical */
	const onShare = useCallback(
		(
			batch: OperationsBatchData,
			sections: ShareSections,
			nextFormat: ShareFormat
		) => {
			setPendingShare(null);

			if (nextFormat === "copy-image") {
				void copyImage(batch);
				return;
			}

			const text = buildShareText(
				center!,
				batch,
				registrationOptions,
				config.academyName,
				sections
			);

			shareText(text);
		},
		[copyImage, shareText, center, registrationOptions, config.academyName]
	);

	const openSharePicker = useCallback(
		(
			batch: OperationsBatchData,
			sections: ShareSections,
			title: string
		) => {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}

			setPendingShare({ batch, sections, title });
		},
		[]
	);

	return (
		<div className={styles.cardStack}>
			{centers.length > 1 && (
				<Segmented
					value={center?.id ?? ""}
					onChange={setCenterId}
					options={centers.map((item) => ({
						label: item.name,
						value: item.id,
					}))}
				/>
			)}

			{center && (
				<div className={styles.centersList}>
					<section className={styles.centerItem}>
						<div className={styles.centerHeader}>
							<div>
								<b>{center.name}</b>
								<p className={styles.centerAddress}>{center.address}</p>
							</div>
						</div>

						<div className={styles.centerSections}>
							{center.batches.length === 0 ? (
								<div className={styles.emptyState}>
									<span className={styles.emptyStateIcon}>
										<OperationsIcon name="pin" size={42} />
									</span>
									<h3>No batches yet</h3>
									<p>
										Batches for this center will appear here once they are
										added in the academy data.
									</p>
								</div>
							) : (
								center.batches.map((batch) => {
									const isOpen = openBatchId === batch.id;
									const scheduleGrid = formatBatchScheduleGrid(batch);
									const hasThreeDayFees = batch.plans.some(
										(plan) => plan.daysPerWeek === 3
									);
									// A checkbox-gated toggle only makes sense when 2-day is an
									// alternate to a 3-day plan - a batch with only a 2-day plan
									// (e.g. Focus Batch) must always show it.
									const hasTwoDayFees =
										hasThreeDayFees &&
										batch.plans.some((plan) => plan.daysPerWeek === 2);
									const shouldShowTwoDayFees = showTwoDayFees[batch.id] ?? false;

									return (
										<div key={batch.id} className={styles.centerBatch}>
											<button
												type="button"
												className={styles.batchAccordionTrigger}
												aria-expanded={isOpen}
												onClick={() =>
													setOpenBatchId((previous) =>
														previous === batch.id ? "" : batch.id
													)
												}
											>
												<span>
													<strong>{batch.name}</strong>
													<small className={styles.centerBatchMeta}>
														{batch.ageGroup}
													</small>
												</span>
												<OperationsIcon
													name="chevron"
													size={18}
													className={`${styles.batchAccordionArrow} ${
														isOpen ? styles.batchAccordionArrowOpen : ""
													}`}
												/>
											</button>

											<div
												className={`${styles.batchAccordionPanelWrap} ${
													isOpen ? styles.batchAccordionPanelWrapOpen : ""
												}`}
											>
												<div className={styles.batchAccordionPanelInner}>
												<div className={styles.batchAccordionPanel}>
													<div className={styles.centerScheduleBlock}>
														<span className={styles.centerBlockLabel}>
															Timings
														</span>
														<div
															className={styles.timingGrid}
															style={
																{
																	"--timing-cols": scheduleGrid.length,
																} as React.CSSProperties
															}
														>
															{scheduleGrid.map((slot) => (
																<div
																	key={`${batch.id}-${slot.day}-${slot.time}`}
																	className={styles.timingCell}
																>
																	<strong>{slot.day}</strong>
																	<span>{slot.time}</span>
																</div>
															))}
														</div>
													</div>

													<div className={styles.centerBlock}>
														<span className={styles.centerBlockLabel}>
															Fee structure
														</span>
														<table className={styles.plansTable}>
															<thead>
																<tr>
																	<th>Duration</th>
																	<th>Price</th>
																</tr>
															</thead>
															<tbody>
																{batch.plans
																	.filter(
																		(plan) =>
																			plan.daysPerWeek !== 2 ||
																			!hasThreeDayFees ||
																			shouldShowTwoDayFees
																	)
																	.map((plan) => (
																		<tr key={plan.id}>
																			<td>{formatPlanLabel(plan)}</td>
																			<td>{formatRupees(plan.price)}</td>
																		</tr>
																	))}
															</tbody>
														</table>
														{hasTwoDayFees && (
															<label className={styles.checkboxRow}>
																<input
																	type="checkbox"
																	checked={shouldShowTwoDayFees}
																	onChange={(event) =>
																		setShowTwoDayFees((previous) => ({
																			...previous,
																			[batch.id]: event.currentTarget.checked,
																		}))
																	}
																/>
																<span>Show 2 Days per Week Pricing</span>
															</label>
														)}
													</div>

													<div className={styles.shareBlock}>
														<span className={styles.centerBlockLabel}>
															Share
														</span>

														<div className={styles.buttonRow}>
															<Button
																text="Timings"
																variant={Variants.OUTLINE}
																color={Colors.NEUTRAL_DARK}
																shape={Shapes.ROUNDED}
																size={ButtonSizes.LARGE}
																extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
																onClick={() =>
																	openSharePicker(
																		batch,
																		{ plans: false, schedule: true },
																		"Timings"
																	)
																}
															/>
															<Button
																text="Fees"
																variant={Variants.OUTLINE}
																color={Colors.NEUTRAL_DARK}
																shape={Shapes.ROUNDED}
																size={ButtonSizes.LARGE}
																extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
																onClick={() =>
																	openSharePicker(
																		batch,
																		{ plans: true, schedule: false },
																		"Fees"
																	)
																}
															/>
															<Button
																text="Fees + timings"
																color={Colors.PRIMARY}
																shape={Shapes.ROUNDED}
																size={ButtonSizes.LARGE}
																extraClass={styles.opsButtonOverride}
																onClick={() =>
																	openSharePicker(
																		batch,
																		{ plans: true, schedule: true },
																		"Fees + timings"
																	)
																}
															/>
														</div>
													</div>
												</div>
												</div>
											</div>
											</div>
									);
								})
							)}
						</div>
					</section>
				</div>
			)}

			{pendingShare && (
				<div
					className={styles.modalOverlay}
					role="presentation"
					onClick={() => setPendingShare(null)}
				>
					<section
						className={styles.shareModal}
						role="dialog"
						aria-modal="true"
						aria-labelledby="share-format-title"
						onClick={(event) => event.stopPropagation()}
					>
						<div className={styles.shareModalHeader}>
							<div>
								<span className={styles.sectionLabel}>Share as</span>
								<h2 id="share-format-title">{pendingShare.title}</h2>
								<p>
									{pendingShare.batch.name} - {center?.name}
								</p>
							</div>
							<button
								type="button"
								className={styles.modalClose}
								aria-label="Close"
								onClick={() => setPendingShare(null)}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M18 6 6 18M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className={styles.shareFormatGrid}>
							<button
								type="button"
								className={styles.shareFormatButton}
								onClick={() =>
									onShare(pendingShare.batch, pendingShare.sections, "text")
								}
							>
								Text
							</button>
							<button
								type="button"
								className={styles.shareFormatButton}
								onClick={() =>
									onShare(
										pendingShare.batch,
										pendingShare.sections,
										"copy-image"
									)
								}
							>
								Copy Image
							</button>
						</div>
					</section>
				</div>
			)}
		</div>
	);
};

export default BatchesList;
