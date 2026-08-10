// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

// PACKAGES //
import QRCode from "qrcode";

// TYPES //
import type { OperationsCenterData, OperationsConfigData } from "@/types/operations";

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
import { formatRupees } from "@/utils/fee-calculator.util";

type QrMode = "global" | "student";

const UPI_NOTE_MAX_LENGTH = 50;

interface PaymentQrProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	config: OperationsConfigData;
	onCenterChange: (centerId: string) => void;
}

/** Tool 3 - one global UPI QR, plus a per-student QR with the amount baked in */
const PaymentQr: React.FC<PaymentQrProps> = ({
	centers,
	center,
	config,
	onCenterChange,
}) => {
	const [mode, setMode] = useState<QrMode>("global");
	const [studentName, setStudentName] = useState("");
	const [studentPhone, setStudentPhone] = useState("");
	const [qrDataUrl, setQrDataUrl] = useState("");

	const feeInputs = useFeeInputs(center);
	const { batch, plan, registrationOption, quote } = feeInputs;

	const isStudentMode = mode === "student";
	const amount = isStudentMode ? (quote?.total ?? 0) : 0;

	const upiUri = useMemo(() => {
		const params = new URLSearchParams({
			pa: config.upiId,
			pn: config.payeeName,
			cu: "INR",
		});

		if (amount > 0) params.set("am", String(amount));

		const note = [
			studentName.trim(),
			batch?.name,
			plan?.name,
			registrationOption?.name,
		]
			.filter(Boolean)
			.join(" | ")
			.slice(0, UPI_NOTE_MAX_LENGTH);

		if (isStudentMode && note) params.set("tn", note);

		return `upi://pay?${params.toString()}`;
	}, [
		config.upiId,
		config.payeeName,
		amount,
		isStudentMode,
		studentName,
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
		if (!isStudentMode) return "skorost-payment-qr.png";

		const slug = studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

		return slug
			? `skorost-payment-${slug}-${amount}.png`
			: `skorost-payment-${amount}.png`;
	}, [isStudentMode, studentName, amount]);

	const shareText = useMemo(() => {
		if (!isStudentMode) return `Pay ${config.payeeName} | ${config.upiId}`;

		const who = studentName.trim() ? `${studentName.trim()} | ` : "";

		return `${who}Fees due ${formatRupees(amount)}. Scan to pay ${config.payeeName}.`;
	}, [isStudentMode, studentName, amount, config.payeeName, config.upiId]);

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
	const canUseStudentQr = !!batch && !!plan && amount > 0;

	return (
		<div className={styles.cardStack}>
			<div className={styles.card}>
				<div className={styles.fieldStack}>
					<Segmented
						value={mode}
						onChange={setMode}
						options={[
							{ label: "Global QR", value: "global" },
							{ label: "Student QR", value: "student" },
						]}
					/>

					{isStudentMode ? (
						<>
							<FeeInputFields
								centers={centers}
								center={center}
								onCenterChange={onCenterChange}
								feeInputs={feeInputs}
							/>

							<InputBox
								id="student-name"
								label="Student name (optional)"
								placeholder="e.g. Aarav"
								value={studentName}
								isError={false}
								errorMessage=""
								onChange={setStudentName}
								onClear={() => setStudentName("")}
							/>

							<InputBox
								id="student-phone"
								label="Parent phone (optional)"
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
					) : (
						<p className={styles.qrHint}>
							No amount encoded | the parent types what they owe.
						</p>
					)}
				</div>
			</div>

			<div className={styles.qrFrame}>
				{qrDataUrl ? (
					<img
						className={styles.qrImage}
						src={qrDataUrl}
						alt={
							isStudentMode
								? `Payment QR for ${formatRupees(amount)}`
								: "Payment QR"
						}
					/>
				) : (
					<p className={styles.qrHint}>Generating QR...</p>
				)}

				<p className={styles.qrCaption}>
					{isStudentMode && amount > 0 ? formatRupees(amount) : "Any amount"}
				</p>
				<p className={styles.qrHint}>
					{isStudentMode && studentName.trim() ? `${studentName.trim()} | ` : ""}
					{config.payeeName} | {config.upiId}
				</p>

				{isStudentMode && !canUseStudentQr && (
					<p className={styles.qrHint}>
						Select a batch and plan first. The amount is calculated from the
						batch-linked plan.
					</p>
				)}

				<div className={styles.buttonRow} style={{ width: "100%" }}>
					<Button
						text="Download"
						variant={Variants.OUTLINE}
						color={Colors.NEUTRAL_DARK}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						isDisabled={!qrDataUrl || (isStudentMode && !canUseStudentQr)}
						onClick={downloadQr}
					/>
					<Button
						text={hasPhone ? "WhatsApp" : "Share"}
						color={Colors.PRIMARY}
						shape={Shapes.ROUNDED}
						size={ButtonSizes.LARGE}
						isDisabled={!qrDataUrl || (isStudentMode && !canUseStudentQr)}
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
