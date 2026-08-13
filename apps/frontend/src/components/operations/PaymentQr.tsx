// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

// PACKAGES //
import QRCode from "qrcode";

// TYPES //
import type {
	OperationsCenterData,
	OperationsConfigData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonIconPosition, ButtonSizes } from "@/neevo/enums/button.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import InputBox from "@/neevo/components/input-box/InputBox";
import Segmented from "./Segmented";
import FeeInputFields from "./FeeInputFields";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// HOOKS //
import { useFeeInputs } from "./use-fee-inputs";

// UTILS //
import { formatDisplayDate, formatRupees } from "@/utils/fee-calculator.util";
import { formatPlanLabel } from "@/utils/operations.util";

type QrMode = "global" | "payment" | "custom";

const UPI_NOTE_MAX_LENGTH = 50;
// Branded photo card - download/share only, never shown inline.
const STATIC_GLOBAL_QR_SRC = "/images/operations/skorost-qr-payment.png";
// Logo-watermarked QR - what Global QR mode actually displays on screen.
const STATIC_GLOBAL_QR_DISPLAY_SRC = "/images/operations/skorost-qr-global.png";

interface PaymentQrProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	config: OperationsConfigData;
	registrationOptions: OperationsRegistrationOptionData[];
	onCenterChange: (centerId: string) => void;
}

/** Tool 3 - one global UPI QR, plus a per-student QR with the amount baked in */
const PaymentQr: React.FC<PaymentQrProps> = ({
	centers,
	center,
	config,
	registrationOptions,
	onCenterChange,
}) => {
	const [mode, setMode] = useState<QrMode>("global");
	const [studentName, setStudentName] = useState("");
	const [studentPhone, setStudentPhone] = useState("");
	const [customAmount, setCustomAmount] = useState("");
	const [customDescription, setCustomDescription] = useState("");
	const [qrDataUrl, setQrDataUrl] = useState("");
	const [isQrFullscreen, setIsQrFullscreen] = useState(false);

	const feeInputs = useFeeInputs(center, registrationOptions);
	const { inputs, batch, plan, registrationOption, quote } = feeInputs;

	const isPaymentMode = mode === "payment";
	const isCustomMode = mode === "custom";
	const isGlobalMode = mode === "global";
	const amount = isPaymentMode
		? (quote?.total ?? 0)
		: isCustomMode
			? Number(customAmount) || 0
			: 0;

	const upiUri = useMemo(() => {
		const params = new URLSearchParams({
			pa: config.upiId,
			pn: config.payeeName,
			cu: "INR",
		});

		if (amount > 0) params.set("am", String(amount));

		const note = [
			studentName.trim(),
			isPaymentMode ? batch?.name : undefined,
			isPaymentMode && plan ? formatPlanLabel(plan) : undefined,
			isPaymentMode ? registrationOption?.name : undefined,
			isCustomMode ? "Custom payment" : undefined,
		]
			.filter(Boolean)
			.join(" | ")
			.slice(0, UPI_NOTE_MAX_LENGTH);

		if (mode !== "global" && note) params.set("tn", note);

		return `upi://pay?${params.toString()}`;
	}, [
		config.upiId,
		config.payeeName,
		amount,
		mode,
		isPaymentMode,
		isCustomMode,
		studentName,
		batch?.name,
		plan,
		registrationOption?.name,
	]);

	// Global mode always shows the static logo QR - payment/custom modes
	// generate a fresh amount-baked QR.
	useEffect(() => {
		let isActive = true;

		if (isGlobalMode) {
			setQrDataUrl(STATIC_GLOBAL_QR_DISPLAY_SRC);
			return;
		}

		QRCode.toDataURL(upiUri, { margin: 1, width: 512 })
			.then((dataUrl) => {
				if (isActive) setQrDataUrl(dataUrl);
			})
			.catch(() => {
				if (isActive) setQrDataUrl("");
			});

		return () => {
			isActive = false;
		};
	}, [isGlobalMode, upiUri]);

	// Global mode downloads/shares the branded photo card; every other mode
	// downloads/shares the same generated QR shown on screen.
	const downloadSrc = isGlobalMode ? STATIC_GLOBAL_QR_SRC : qrDataUrl;

	useEffect(() => {
		if (!isQrFullscreen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsQrFullscreen(false);
		};

		document.addEventListener("keydown", onKeyDown);

		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isQrFullscreen]);

	const openQrFullscreen = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.currentTarget.blur();
			setIsQrFullscreen(true);
		},
		[]
	);

	const fileName = useMemo(() => {
		if (mode === "global") return "skorost-payment-qr.png";

		const slug = studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

		return slug
			? `skorost-payment-${slug}-${amount}.png`
			: `skorost-payment-${amount}.png`;
	}, [mode, studentName, amount]);

	const shareText = useMemo(() => {
		if (mode === "global") {
			return [
				`⚽ *${config.payeeName}*`,
				"",
				"Please scan the QR code and enter the payable amount.",
				"",
				`UPI ID: ${config.upiId}`,
			].join("\n");
		}

		if (isCustomMode) {
			const subject = customDescription.trim()
				? customDescription.trim()
				: "Custom payment";

			return [
				`⚽ *${config.payeeName}*`,
				studentName.trim() ? `👤 *Student:* ${studentName.trim()}` : null,
				"",
				`*${subject}*`,
				`Amount: *${formatRupees(amount)}*`,
				"",
				"Please scan the attached QR code to complete the payment.",
			]
				.filter((line): line is string => line !== null)
				.join("\n");
		}

		return [
			`⚽ *${config.payeeName}*`,
			studentName.trim() ? `👤 *Student:* ${studentName.trim()}` : null,
			batch ? `👥 *Batch:* ${batch.name} (${batch.ageGroup})` : null,
			plan ? `📦 *Package:* ${formatPlanLabel(plan)}` : null,
			registrationOption ? `🎒 *Registration:* ${registrationOption.name}` : null,
			"",
			`Amount Due: *${formatRupees(amount)}*`,
			"",
			"Please scan the attached QR code to complete the payment.",
		]
			.filter((line): line is string => line !== null)
			.join("\n");
	}, [
		mode,
		isCustomMode,
		studentName,
		customDescription,
		amount,
		config.payeeName,
		config.upiId,
		batch,
		plan,
		registrationOption,
	]);

	const downloadQr = useCallback(() => {
		if (!downloadSrc) return;

		const link = document.createElement("a");

		link.href = downloadSrc;
		link.download = fileName;
		link.click();
	}, [downloadSrc, fileName]);

	const copyText = useCallback(async (text: string, successMessage: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showToast(successMessage, ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy. Please copy manually.", ToastTypes.ERROR);
		}
	}, []);

	const copyUpiId = useCallback(() => {
		void copyText(config.upiId, "UPI ID copied");
	}, [config.upiId, copyText]);

	const copyPaymentUrl = useCallback(() => {
		void copyText(upiUri, "Payment URL copied");
	}, [copyText, upiUri]);

	// wa.me can pre-fill text but never a file, and it can target a specific
	// number but the OS share sheet can't - so which one runs depends on
	// whether a number was typed in. Either way the QR image still gets to the
	// chat: attached directly via the share sheet, or downloaded for staff to
	// attach by hand when a specific number pins us to the text-only deep link.
	const openWhatsApp = useCallback(async () => {
		const digits = studentPhone.replace(/\D/g, "");
		const waNumber = digits.length >= 10 ? `91${digits.slice(-10)}` : "";
		const message = `${shareText}\n${upiUri}`;

		if (waNumber) {
			downloadQr();
			window.open(
				`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
				"_blank",
				"noopener"
			);
			showToast("QR downloaded | attach it in the chat", ToastTypes.SUCCESS);
			return;
		}

		try {
			const blob = await (await fetch(downloadSrc)).blob();
			const file = new File([blob], fileName, { type: "image/png" });

			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], text: message });
				return;
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}
		}

		downloadQr();
		window.open(
			`https://wa.me/?text=${encodeURIComponent(message)}`,
			"_blank",
			"noopener"
		);
		showToast("QR downloaded | attach it in the chat", ToastTypes.SUCCESS);
	}, [studentPhone, shareText, upiUri, downloadSrc, fileName, downloadQr]);
	const canGenerate = isPaymentMode
		? !!batch && !!plan && amount > 0
		: isCustomMode
			? amount > 0
			: true;

	return (
		<div className={styles.cardStack}>
			<div className={styles.card}>
				<div className={styles.fieldStack}>
					<Segmented
						value={mode}
						onChange={setMode}
						options={[
							{ label: "Global QR", value: "global" },
							{ label: "Fee Payment", value: "payment" },
							{ label: "Custom", value: "custom" },
						]}
					/>

					{isPaymentMode && (
						<FeeInputFields
							centers={centers}
							center={center}
							onCenterChange={onCenterChange}
							registrationOptions={registrationOptions}
							feeInputs={feeInputs}
						/>
					)}

					{isCustomMode && (
						<>
							<InputBox
								id="custom-amount"
								label="Amount"
								placeholder="e.g. 500"
								type={InputTextTypes.NUMBER}
								value={customAmount}
								isRequired
								isError={false}
								errorMessage=""
								onChange={setCustomAmount}
								onClear={() => setCustomAmount("")}
							/>

							<InputBox
								id="custom-description"
								label="Description (optional)"
								placeholder="e.g. Jersey order 2026"
								value={customDescription}
								isError={false}
								errorMessage=""
								caption="Shown in the message when you share the QR"
								onChange={setCustomDescription}
								onClear={() => setCustomDescription("")}
							/>
						</>
					)}

					{mode !== "global" && (
						<>
							<InputBox
								id="student-name"
								label="Name (optional)"
								placeholder="e.g. Aarav"
								value={studentName}
								isError={false}
								errorMessage=""
								onChange={setStudentName}
								onClear={() => setStudentName("")}
							/>

							<InputBox
								id="student-phone"
								label="Phone (optional)"
								placeholder="98765 43210"
								type={InputTextTypes.NUMBER}
								value={studentPhone}
								isError={false}
								errorMessage=""
								caption="Enter a number to send the amount on WhatsApp"
								onChange={setStudentPhone}
								onClear={() => setStudentPhone("")}
							/>
						</>
					)}
				</div>
			</div>

			{isPaymentMode && quote && (
				<div className={styles.result}>
					<div className={styles.resultTotal}>
						<span>Total due</span>
						<b>{formatRupees(quote.total)}</b>
					</div>

					{quote.rows.map((row) => (
						<div key={row.id} className={styles.resultRow}>
							<span className={styles.resultRowLabel}>
								{row.label}
								<small>{row.detail}</small>
							</span>
							<span>{formatRupees(row.amount)}</span>
						</div>
					))}

					<p className={styles.resultFootnote}>
						{formatDisplayDate(inputs.startDate)} -{" "}
						{formatDisplayDate(inputs.endDate)}
					</p>
				</div>
			)}

			<div className={styles.qrFrame}>
				{qrDataUrl ? (
					<button
						type="button"
						className={styles.qrImageButton}
						aria-label="Open QR full screen"
						onClick={openQrFullscreen}
					>
						<img
							className={styles.qrImage}
							src={qrDataUrl}
							alt={
								mode !== "global"
									? `Payment QR for ${formatRupees(amount)}`
									: "Payment QR"
							}
						/>
					</button>
				) : (
					<p className={styles.qrHint}>Generating QR...</p>
				)}

				<p className={styles.qrCaption}>
					{mode !== "global" && amount > 0
						? formatRupees(amount)
						: isCustomMode
							? ""
							: config.academyName}
				</p>
				{mode !== "global" && (
					<p className={styles.qrPayeeName}>{config.academyName}</p>
				)}
				{mode === "global" && (
					<p className={styles.qrHint}>
						<span>{config.upiId}</span>
						<button
							type="button"
							className={styles.copyIconButton}
							aria-label="Copy UPI ID"
							onClick={copyUpiId}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="9" y="9" width="11" height="11" rx="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
					</p>
				)}

				{isPaymentMode && !canGenerate && (
					<p className={styles.qrHint}>
						Select a batch and plan first. The amount is calculated from the
						batch-linked plan.
					</p>
				)}

				{isCustomMode && !canGenerate && (
					<p className={styles.qrHint}>Enter an amount to generate the QR.</p>
				)}

				<div className={styles.buttonRow} style={{ width: "100%" }}>
					{mode !== "global" && (
						<Button
							text="Copy URL"
							variant={Variants.OUTLINE}
							color={Colors.NEUTRAL_DARK}
							shape={Shapes.ROUNDED}
							size={ButtonSizes.LARGE}
							isDisabled={!canGenerate}
							extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline} ${styles.fullWidthButton}`}
							onClick={copyPaymentUrl}
						/>
					)}
					<Button
						text="Download"
						variant={Variants.OUTLINE}
						color={Colors.NEUTRAL_DARK}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						leftIcon="download-tray"
						iconPosition={ButtonIconPosition.CENTER}
						isDisabled={!qrDataUrl || !canGenerate}
						extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
						onClick={downloadQr}
					/>
					<Button
						text="WhatsApp"
						color={Colors.PRIMARY}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						isDisabled={!qrDataUrl || !canGenerate}
						extraClass={styles.opsButtonOverride}
						onClick={openWhatsApp}
					/>
				</div>
			</div>

			{isQrFullscreen && qrDataUrl && (
				<div
					className={styles.qrFullscreen}
					role="dialog"
					aria-modal="true"
					aria-label="Payment QR full screen"
					onClick={() => setIsQrFullscreen(false)}
				>
					<img
						className={styles.qrFullscreenLogo}
						src="/images/skorost.svg"
						alt="Skorost United Football Academy"
					/>
					<img
						src={qrDataUrl}
						alt={
							mode !== "global"
								? `Payment QR for ${formatRupees(amount)}, enlarged`
								: "Payment QR, enlarged"
						}
					/>
					<p className={styles.qrFullscreenName}>
						{mode !== "global" && amount > 0
							? formatRupees(amount)
							: config.academyName}
					</p>
					<p className={styles.qrFullscreenHint}>
						{mode === "global"
							? config.upiId
							: studentName.trim() || config.payeeName}
					</p>
					<button
						className={styles.qrFullscreenClose}
						type="button"
						aria-label="Close QR full screen"
					>
						Tap anywhere to close
					</button>
				</div>
			)}
		</div>
	);
};

export default PaymentQr;
