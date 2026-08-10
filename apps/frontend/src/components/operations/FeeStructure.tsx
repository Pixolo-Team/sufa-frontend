// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";
import type {
	OperationsBatchData,
	OperationsCenterData,
	OperationsConfigData,
} from "@/types/operations";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonSizes } from "@/neevo/enums/button.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import InputBox from "@/neevo/components/input-box/InputBox";
import Select from "@/neevo/components/select/Select";
import Segmented from "./Segmented";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import { renderFeeStructureImage } from "@/utils/fee-structure-image.util";
import {
	formatBatchTimingLines,
	formatBatchTimings,
	formatPlanLabel,
} from "@/utils/operations.util";

type PreviewMode = "image" | "text";

interface FeeStructureProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	config: OperationsConfigData;
	onCenterChange: (centerId: string) => void;
}

const buildBatchOptions = (center: OperationsCenterData | undefined) =>
	(center?.batches ?? []).map((item) => ({
		label: item.name,
		value: item.id,
	}));

/** Tool 2 - build the batch-linked fee structure as an image and a message */
const FeeStructure: React.FC<FeeStructureProps> = ({
	centers,
	center,
	config,
	onCenterChange,
}) => {
	const [parentName, setParentName] = useState("");
	const [phone, setPhone] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [previewMode, setPreviewMode] = useState<PreviewMode>("image");
	const [senderId, setSenderId] = useState("");
	const [batchId, setBatchId] = useState("");
	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imageUrl, setImageUrl] = useState("");

	const centerOptions: DropdownOptionData[] = centers.map((item) => ({
		label: item.name,
		value: item.id,
	}));
	const senderOptions: DropdownOptionData[] = (center?.coaches ?? []).map(
		(coach) => ({ label: coach.name, value: coach.id })
	);
	const batchOptions: DropdownOptionData[] = buildBatchOptions(center);

	const sender =
		center?.coaches.find((coach) => coach.id === senderId) ?? center?.coaches[0];
	const batch: OperationsBatchData | undefined = useMemo(
		() => center?.batches.find((item) => item.id === batchId),
		[center, batchId]
	);
	const selectedCenterOption =
		centerOptions.find((option) => option.value === center?.id) ?? null;
	const selectedSenderOption =
		senderOptions.find((option) => option.value === sender?.id) ?? null;
	const selectedBatchOption =
		batchOptions.find((option) => option.value === batch?.id) ?? null;

	useEffect(() => {
		setBatchId("");
	}, [center?.id]);

	const message = useMemo(() => {
		if (!center || !batch) return "";

		const greeting = parentName.trim() ? `Hi ${parentName.trim()}, h` : "H";
		const planLines = batch.plans
			.map((plan) => `- ${formatPlanLabel(plan)}: ${formatRupees(plan.price)}`)
			.join("\n");
		const registrationLines =
			batch.registrationOptions.length > 0
				? batch.registrationOptions
						.map((item) => `- ${item.name}: ${formatRupees(item.price)}`)
						.join("\n")
				: "";
		const timingLines = formatBatchTimingLines(batch)
			.map((line) => `- ${line}`)
			.join("\n");

		return [
			`${greeting}ere is the fee structure for ${config.academyName} - ${center.name}:`,
			"",
			`Batch: ${batch.name}`,
			"",
			"Plans:",
			planLines,
			registrationLines ? "" : null,
			registrationLines ? "Registration:" : null,
			registrationLines || null,
			"",
			`Address: ${center.address}`,
			"Schedule:",
			timingLines,
			"",
			"For a free trial or to enroll, reply here. See you on the pitch!",
			sender?.name ? `- ${sender.name}, ${config.academyName}` : "",
		]
			.filter((line): line is string => !!line || line === "")
			.filter((line, index, all) => line !== "" || all[index - 1] !== "")
			.join("\n");
	}, [batch, center, parentName, config.academyName, sender]);

	useEffect(() => {
		if (!center || !batch) {
			setImageBlob(null);
			setImageUrl("");
			return;
		}

		let isActive = true;

		renderFeeStructureImage({
			academyName: config.academyName,
			center,
			batch,
			senderName: sender?.name,
		}).then((blob) => {
			if (!isActive || !blob) return;

			setImageBlob(blob);
			setImageUrl(URL.createObjectURL(blob));
		});

		return () => {
			isActive = false;
		};
	}, [batch, center, config.academyName, sender?.name]);

	useEffect(
		() => () => {
			if (imageUrl) URL.revokeObjectURL(imageUrl);
		},
		[imageUrl]
	);

	const imageFileName = `skorost-fees-${batch?.id ?? center?.id ?? "batch"}.png`;

	const copyMessage = useCallback(() => {
		navigator.clipboard
			.writeText(message)
			.then(() => showToast("Message copied", ToastTypes.SUCCESS))
			.catch(() => showToast("Could not copy the message", ToastTypes.ERROR));
	}, [message]);

	const copyImage = useCallback(async () => {
		if (!imageBlob) return;

		try {
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": imageBlob }),
			]);
			showToast("Image copied", ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy the image. Try Download.", ToastTypes.ERROR);
		}
	}, [imageBlob]);

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
			await navigator.share({ files: [file], text: message });
		} catch {
			// User cancel lands here too.
		}
	}, [imageBlob, imageFileName, message, downloadImage]);

	const openWhatsApp = useCallback(() => {
		const digits = phone.replace(/\D/g, "");

		if (digits.length < 10) {
			setPhoneError("Enter a valid phone number");
			return;
		}

		setPhoneError("");
		const waNumber = digits.length === 10 ? `91${digits}` : digits;

		window.open(
			`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
			"_blank",
			"noopener"
		);
	}, [phone, message]);

	return (
		<div className={styles.cardStack}>
			<div className={styles.card}>
				<div className={styles.fieldStack}>
					<Select
						label="Center"
						placeholder="Select center"
						options={centerOptions}
						selectedOption={selectedCenterOption}
						isRequired
						onChange={(option) => onCenterChange(option.value)}
					/>

					<Select
						label="Batch"
						placeholder="Select batch"
						options={batchOptions}
						selectedOption={selectedBatchOption}
						caption={batch ? formatBatchTimings(batch) : ""}
						isRequired
						isDisabled={!center}
						onChange={(option) => setBatchId(option.value)}
					/>

					{senderOptions.length > 0 && (
						<Select
							label="Sent by (coach)"
							placeholder="Select coach"
							options={senderOptions}
							selectedOption={selectedSenderOption}
							onChange={(option) => setSenderId(option.value)}
						/>
					)}

					<InputBox
						id="parent-name"
						label="Parent name (optional)"
						placeholder="e.g. Ravi"
						value={parentName}
						isError={false}
						errorMessage=""
						onChange={setParentName}
						onClear={() => setParentName("")}
					/>

					<InputBox
						id="parent-phone"
						label="Parent phone"
						placeholder="98765 43210"
						type={InputTextTypes.NUMBER}
						value={phone}
						isRequired
						isError={!!phoneError}
						errorMessage={phoneError}
						caption="10 digits. +91 is added automatically"
						onChange={(value) => {
							setPhone(value);
							setPhoneError("");
						}}
						onClear={() => setPhone("")}
					/>
				</div>
			</div>

			{center && batch ? (
				<div className={styles.card}>
					<span className={styles.sectionLabel}>Preview</span>

					<Segmented
						value={previewMode}
						onChange={setPreviewMode}
						options={[
							{ label: "Image", value: "image" },
							{ label: "Message", value: "text" },
						]}
					/>

					<div className={styles.previewBody}>
						{previewMode === "image" ? (
							imageUrl ? (
								<img
									className={styles.previewImage}
									src={imageUrl}
									alt={`Fee structure for ${center.name} ${batch.name}`}
								/>
							) : (
								<p className={styles.qrHint}>Drawing image...</p>
							)
						) : (
							<div className={styles.messagePreview}>{message}</div>
						)}
					</div>

					{previewMode === "image" ? (
						<>
							<div className={styles.buttonRow}>
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

							<p className={styles.qrHint}>
								Send image opens the phone's share sheet. Pick WhatsApp there.
							</p>
						</>
					) : (
						<div className={styles.buttonRow}>
							<Button
								text="Copy message"
								variant={Variants.OUTLINE}
								color={Colors.NEUTRAL_DARK}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.LARGE}
								onClick={copyMessage}
							/>
							<Button
								text="WhatsApp"
								color={Colors.PRIMARY}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.LARGE}
								onClick={openWhatsApp}
							/>
						</div>
					)}
				</div>
			) : (
				<div className={styles.card}>
					<p className={styles.notice}>
						Select a batch to preview the linked plans, registration fees and daily
						timings.
					</p>
				</div>
			)}
		</div>
	);
};

export default FeeStructure;
