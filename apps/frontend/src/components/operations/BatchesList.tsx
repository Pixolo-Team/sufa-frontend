// REACT //
import { useCallback, useState } from "react";

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

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import {
	renderFeeStructureImage,
	type FeeStructureImageSections,
} from "@/utils/fee-structure-image.util";
import {
	formatBatchTimingLines,
	formatPlanLabel,
} from "@/utils/operations.util";

type ShareFormat = "text" | "image";

interface BatchesListProps {
	centers: OperationsCenterData[];
	config: OperationsConfigData;
	registrationOptions: OperationsRegistrationOptionData[];
}

const buildScheduleText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	academyName: string
): string =>
	[
		`${academyName} - ${center.name}`,
		`${batch.name} (${batch.ageGroup})`,
		"",
		"Schedule:",
		...formatBatchTimingLines(batch).map((line) => `- ${line}`),
		"",
		`Address: ${center.address}`,
	].join("\n");

const buildFeeStructureText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[],
	academyName: string
): string =>
	[
		`${academyName} - ${center.name}`,
		`Batch: ${batch.name} (${batch.ageGroup})`,
		"",
		"Plans:",
		...batch.plans.map(
			(plan) => `- ${formatPlanLabel(plan)}: ${formatRupees(plan.price)}`
		),
		registrationOptions.length > 0 ? "" : null,
		registrationOptions.length > 0 ? "Registration:" : null,
		...registrationOptions.map(
			(item) => `- ${item.name}: ${formatRupees(item.price)}`
		),
		"",
		`Address: ${center.address}`,
	]
		.filter((line): line is string => line !== null)
		.join("\n");

const buildBothText = (
	center: OperationsCenterData,
	batch: OperationsBatchData,
	registrationOptions: OperationsRegistrationOptionData[],
	academyName: string
): string =>
	[
		buildFeeStructureText(center, batch, registrationOptions, academyName),
		"",
		"Schedule:",
		...formatBatchTimingLines(batch).map((line) => `- ${line}`),
	].join("\n");

/** All batches, timings and plans - grouped by center tabs */
const BatchesList: React.FC<BatchesListProps> = ({
	centers,
	config,
	registrationOptions,
}) => {
	const [centerId, setCenterId] = useState(centers[0]?.id ?? "");
	const [format, setFormat] = useState<ShareFormat>("text");

	const center = centers.find((item) => item.id === centerId) ?? centers[0];

	const shareText = useCallback(async (text: string) => {
		try {
			if (navigator.share) {
				await navigator.share({ text });
				return;
			}

			await navigator.clipboard.writeText(text);
			showToast("Sharing unavailable | text copied", ToastTypes.SUCCESS);
		} catch {
			// A cancelled share sheet lands here too, so stay quiet about it
		}
	}, []);

	const shareImage = useCallback(
		async (batch: OperationsBatchData, sections: FeeStructureImageSections) => {
			if (!center) return;

			const blob = await renderFeeStructureImage({
				academyName: config.academyName,
				center,
				batch,
				registrationOptions,
				sections,
			});

			if (!blob) {
				showToast("Could not draw the image", ToastTypes.ERROR);
				return;
			}

			const fileName = `skorost-${batch.id}.png`;
			const file = new File([blob], fileName, { type: "image/png" });

			if (navigator.canShare?.({ files: [file] })) {
				try {
					await navigator.share({ files: [file] });
				} catch {
					// A cancelled share sheet lands here too
				}
				return;
			}

			// No share sheet for files - fall back to a download so it is still sendable
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");

			link.href = url;
			link.download = fileName;
			link.click();
			URL.revokeObjectURL(url);

			showToast("Sharing unavailable. Image downloaded.", ToastTypes.WARNING);
		},
		[center, config.academyName, registrationOptions]
	);

	/** One handler for both formats, so the buttons stay identical */
	const onShare = useCallback(
		(batch: OperationsBatchData, sections: FeeStructureImageSections) => {
			if (format === "image") {
				// Registration is a fee, so it rides along with the plans, never with
				// a timings-only card.
				void shareImage(batch, { ...sections, registration: sections.plans });
				return;
			}

			const text =
				sections.plans && sections.schedule
					? buildBothText(center!, batch, registrationOptions, config.academyName)
					: sections.plans
						? buildFeeStructureText(
								center!,
								batch,
								registrationOptions,
								config.academyName
							)
						: buildScheduleText(center!, batch, config.academyName);

			void shareText(text);
		},
		[
			format,
			shareImage,
			shareText,
			center,
			registrationOptions,
			config.academyName,
		]
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

			<div className={styles.card}>
				<span className={styles.sectionLabel}>Share as</span>
				<Segmented
					value={format}
					onChange={setFormat}
					options={[
						{ label: "Text", value: "text" },
						{ label: "Image", value: "image" },
					]}
				/>
			</div>

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
							{center.batches.map((batch) => (
								<div key={batch.id} className={styles.centerBatch}>
									<div className={styles.centerBatchHeader}>
										<strong>{batch.name}</strong>
										<span className={styles.centerBatchMeta}>{batch.ageGroup}</span>
									</div>

									<div className={styles.centerScheduleList}>
										{formatBatchTimingLines(batch).map((line) => (
											<span
												key={`${batch.id}-${line}`}
												className={styles.centerSchedulePill}
											>
												{line}
											</span>
										))}
									</div>

									<div className={styles.centerBlock}>
										<span className={styles.centerBlockLabel}>Plans</span>
										<table className={styles.plansTable}>
											<thead>
												<tr>
													<th>Plan</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												{batch.plans.map((plan) => (
													<tr key={plan.id}>
														<td>{formatPlanLabel(plan)}</td>
														<td>{formatRupees(plan.price)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									<div className={styles.shareBlock}>
										<span className={styles.centerBlockLabel}>
											Share {format === "image" ? "as image" : "as text"}
										</span>

										<div className={styles.buttonRow}>
											<Button
												text="Timings"
												variant={Variants.OUTLINE}
												color={Colors.NEUTRAL_DARK}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												onClick={() =>
													onShare(batch, { plans: false, schedule: true })
												}
											/>
											<Button
												text="Fees"
												variant={Variants.OUTLINE}
												color={Colors.NEUTRAL_DARK}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												onClick={() =>
													onShare(batch, { plans: true, schedule: false })
												}
											/>
											<Button
												text="Fees + timings"
												color={Colors.PRIMARY}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												onClick={() =>
													onShare(batch, { plans: true, schedule: true })
												}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				</div>
			)}
		</div>
	);
};

export default BatchesList;
