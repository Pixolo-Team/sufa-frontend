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
import { ButtonSizes } from "@/neevo/enums/button.enum";
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

type QrMode = "global" | "payment" | "custom";

const UPI_NOTE_MAX_LENGTH = 50;

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

	const feeInputs = useFeeInputs(center, registrationOptions);
	const { inputs, batch, plan, registrationOption, quote } = feeInputs;

	const isPaymentMode = mode === "payment";
	const isCustomMode = mode === "custom";
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
			isPaymentMode ? plan?.name : undefined,
			isPaymentMode ? registrationOption?.name : undefined,
			isCustomMode ? customDescription.trim() || "Custom payment" : undefined,
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
		customDescription,
		batch?.name,
		plan?.name,
		registrationOption?.name,
	]);

	useEffect(() => {
		let isActive = true;

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
	}, [upiUri]);

	const fileName = useMemo(() => {
		if (mode === "global") return "skorost-payment-qr.png";

		const slug = studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

		return slug
			? `skorost-payment-${slug}-${amount}.png`
			: `skorost-payment-${amount}.png`;
	}, [mode, studentName, amount]);

	const shareText = useMemo(() => {
		if (mode === "global") return `Pay ${config.payeeName} | ${config.upiId}`;

		if (isCustomMode) {
			const greeting = studentName.trim() ? `Hi ${studentName.trim()}, h` : "H";
			const subject = customDescription.trim()
				? `the payment of your ${customDescription.trim()}`
				: "your payment";

			return `${greeting}ere is the QR code for ${subject}. Amount: ${formatRupees(amount)}.`;
		}

		const who = studentName.trim() ? `${studentName.trim()} | ` : "";

		return `${who}Fees due ${formatRupees(amount)}. Scan to pay ${config.payeeName}.`;
	}, [
		mode,
		isCustomMode,
		studentName,
		customDescription,
		amount,
		config.payeeName,
		config.upiId,
	]);

	const downloadQr = useCallback(() => {
		if (!qrDataUrl) return;

		const link = document.createElement("a");

		link.href = qrDataUrl;
		link.download = fileName;
		link.click();
	}, [qrDataUrl, fileName]);

	const shareQr = useCallback(async () => {
		try {
			const blob = await (await fetch(qrDataUrl)).blob();
			const file = new File([blob], fileName, { type: "image/png" });

			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], text: shareText });
				return;
			}

			await navigator.clipboard.writeText(upiUri);
			showToast("Sharing unavailable | UPI link copied", ToastTypes.SUCCESS);
		} catch {
			// A cancelled share sheet lands here too, so stay quiet about it
		}
	}, [qrDataUrl, fileName, shareText, upiUri]);

	const openWhatsApp = useCallback(() => {
		const digits = studentPhone.replace(/\D/g, "");

		if (digits.length < 10) return;

		const waNumber = digits.length === 10 ? `91${digits}` : digits;

		window.open(
			`https://wa.me/${waNumber}?text=${encodeURIComponent(shareText)}`,
			"_blank",
			"noopener"
		);
	}, [studentPhone, shareText]);

	const hasPhone = studentPhone.replace(/\D/g, "").length >= 10;
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

					{mode === "global" && (
						<p className={styles.qrHint}>
							No amount encoded | the parent types what they owe.
						</p>
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
						{formatDisplayDate(inputs.endDate)} | prices as stored, no rounding
					</p>
				</div>
			)}

			<div className={styles.qrFrame}>
				{qrDataUrl ? (
					<img
						className={styles.qrImage}
						src={qrDataUrl}
						alt={
							mode !== "global"
								? `Payment QR for ${formatRupees(amount)}`
								: "Payment QR"
						}
					/>
				) : (
					<p className={styles.qrHint}>Generating QR...</p>
				)}

				<p className={styles.qrCaption}>
					{mode !== "global" && amount > 0 ? formatRupees(amount) : "Any amount"}
				</p>
				<p className={styles.qrHint}>
					{mode !== "global" && studentName.trim() ? `${studentName.trim()} | ` : ""}
					{config.payeeName} | {config.upiId}
				</p>

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
					<Button
						text="Download"
						variant={Variants.OUTLINE}
						color={Colors.NEUTRAL_DARK}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						isDisabled={!qrDataUrl || !canGenerate}
						onClick={downloadQr}
					/>
					<Button
						text={hasPhone ? "WhatsApp" : "Share"}
						color={Colors.PRIMARY}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						isDisabled={!qrDataUrl || !canGenerate}
						onClick={() => {
							if (hasPhone) {
								openWhatsApp();
								return;
							}

							void shareQr();
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default PaymentQr;
