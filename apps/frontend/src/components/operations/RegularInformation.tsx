// REACT //
import { useCallback, useState } from "react";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import { ButtonIconPosition, ButtonSizes } from "@/neevo/enums/button.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// CONSTANTS //
import {
	REGULAR_INFO_SECTIONS,
	type RegularInfoSection,
} from "@/constants/regular-information";

/**
 * Turns a section's table into tab-separated text, which pastes into WhatsApp
 * and Sheets cleanly. The title and note ride along so the pasted block reads
 * on its own, without the surrounding page.
 */
const tableToText = (section: RegularInfoSection) => {
	const table = section.table!;
	const lines = [
		section.title,
		"",
		...[table.headers, ...table.rows].map((row) => row.join("\t")),
	];

	if (section.note) lines.push("", section.note);

	return lines.join("\n");
};

/**
 * Tool - reference material staff send to parents often enough that hunting
 * for it every time is the actual problem. Everything here is copy- or
 * download-in-one-tap; nothing is editable.
 */
const RegularInformation: React.FC = () => {
	const [openSectionId, setOpenSectionId] = useState<string | null>(
		REGULAR_INFO_SECTIONS[0]?.id ?? null
	);

	const copyText = useCallback(async (text: string, successMessage: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showToast(successMessage, ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy. Please copy manually.", ToastTypes.ERROR);
		}
	}, []);

	// Writes the actual bitmap to the clipboard where the browser allows it, so
	// staff can paste straight into WhatsApp instead of saving then attaching.
	const copyImage = useCallback(async (src: string) => {
		try {
			const response = await fetch(src);
			const blob = await response.blob();

			// SVG isn't a clipboard-writable image type in any browser - the real
			// assets will be PNG/JPG, but the placeholders are SVG, so fall back
			// to copying the URL rather than throwing.
			if (!blob.type.startsWith("image/") || blob.type.includes("svg")) {
				await navigator.clipboard.writeText(new URL(src, window.location.origin).href);
				showToast("Image link copied", ToastTypes.SUCCESS);
				return;
			}

			await navigator.clipboard.write([
				new ClipboardItem({ [blob.type]: blob }),
			]);
			showToast("Image copied", ToastTypes.SUCCESS);
		} catch {
			showToast("Could not copy the image. Use Download.", ToastTypes.ERROR);
		}
	}, []);

	const downloadImage = useCallback((src: string, id: string) => {
		const link = document.createElement("a");
		const extension = src.split(".").pop() || "png";

		link.href = src;
		link.download = `skorost-${id}.${extension}`;
		link.click();
	}, []);

	return (
		<div className={styles.cardStack}>
			<p className={`${styles.notice} ${styles.infoNotice}`}>
				Placeholder content. Real copy, photos and prices are pending.
			</p>

			{REGULAR_INFO_SECTIONS.map((section) => {
				const isOpen = openSectionId === section.id;

				return (
					<div key={section.id} className={styles.card}>
						<button
							type="button"
							className={styles.infoHeader}
							aria-expanded={isOpen}
							aria-controls={`regular-info-${section.id}`}
							onClick={() => setOpenSectionId(isOpen ? null : section.id)}
						>
							<span className={styles.infoHeaderText}>
								<b>{section.title}</b>
								<small>{section.description}</small>
							</span>
							<span
								className={`${styles.infoChevron} ${
									isOpen ? styles.infoChevronOpen : ""
								}`}
								aria-hidden="true"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.75"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</span>
						</button>

						{isOpen && (
							<div className={styles.infoBody} id={`regular-info-${section.id}`}>
								{section.copyText && (
									<pre className={styles.infoText}>{section.copyText}</pre>
								)}

								{section.table && (
									<div className={styles.infoTableWrap}>
										<table className={styles.infoTable}>
											<thead>
												<tr>
													{section.table.headers.map((header) => (
														<th key={header}>{header}</th>
													))}
												</tr>
											</thead>
											<tbody>
												{section.table.rows.map((row) => (
													<tr key={row[0]}>
														{row.map((cell, cellIndex) => (
															<td key={cellIndex}>{cell}</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}

								{section.note && <p className={styles.infoNote}>{section.note}</p>}

								{section.image && (
									<img
										className={styles.infoImage}
										src={section.image.src}
										alt={section.image.alt}
										loading="lazy"
									/>
								)}

								<div className={styles.buttonRow}>
									{section.copyText && (
										<Button
											text="Copy text"
											variant={Variants.OUTLINE}
											color={Colors.NEUTRAL_DARK}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
											onClick={() =>
												void copyText(section.copyText!, `${section.title} copied`)
											}
										/>
									)}

									{section.table && (
										<Button
											text="Copy table"
											variant={Variants.OUTLINE}
											color={Colors.NEUTRAL_DARK}
											shape={Shapes.ROUNDED}
											size={ButtonSizes.LARGE}
											extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
											onClick={() =>
												void copyText(tableToText(section), `${section.title} copied`)
											}
										/>
									)}

									{section.image && (
										<>
											<Button
												text="Copy image"
												variant={Variants.OUTLINE}
												color={Colors.NEUTRAL_DARK}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												extraClass={`${styles.opsButtonOverride} ${styles.opsButtonOutline}`}
												onClick={() => void copyImage(section.image!.src)}
											/>
											<Button
												text="Download"
												color={Colors.PRIMARY}
												shape={Shapes.ROUNDED}
												size={ButtonSizes.LARGE}
												leftIcon="download-tray"
												iconPosition={ButtonIconPosition.CENTER}
												extraClass={styles.opsButtonOverride}
												onClick={() => downloadImage(section.image!.src, section.id)}
											/>
										</>
									)}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default RegularInformation;
