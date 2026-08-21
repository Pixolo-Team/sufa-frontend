// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

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

type InfoFilter = "all" | "text" | "image" | "table";

const INFO_FILTERS: { id: InfoFilter; label: string }[] = [
	{ id: "all", label: "All" },
	{ id: "text", label: "Text" },
	{ id: "image", label: "Images" },
	{ id: "table", label: "Tables" },
];

const getSectionTypeLabel = (section: RegularInfoSection) => {
	const labels = [];

	if (section.copyText || section.accordions) labels.push("Text");
	if (section.image) labels.push("Image");
	if (section.table) labels.push("Table");

	return labels.join(" + ");
};

const getSectionSearchText = (section: RegularInfoSection) =>
	[
		section.title,
		section.description,
		section.copyText,
		section.note,
		section.image?.alt,
		section.table?.headers.join(" "),
		section.table?.rows.flat().join(" "),
		section.accordions
			?.map((item) => `${item.title} ${item.copyText}`)
			.join(" "),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

/**
 * Tool - reference material staff send to parents often enough that hunting
 * for it every time is the actual problem. Everything here is copy- or
 * download-in-one-tap; nothing is editable.
 */
const RegularInformation: React.FC = () => {
	const [openSectionId, setOpenSectionId] = useState<string | null>(
		REGULAR_INFO_SECTIONS[0]?.id ?? null
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<InfoFilter>("all");
	const [openAccordionIds, setOpenAccordionIds] = useState<Set<string>>(
		() =>
			new Set(
				REGULAR_INFO_SECTIONS[0]?.accordions?.[0]?.id
					? [REGULAR_INFO_SECTIONS[0].accordions[0].id]
					: []
			)
	);

	const visibleSections = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return REGULAR_INFO_SECTIONS.filter((section) => {
			const matchesFilter =
				activeFilter === "all" ||
				(activeFilter === "text" && (section.copyText || section.accordions)) ||
				(activeFilter === "image" && section.image) ||
				(activeFilter === "table" && section.table);

			if (!matchesFilter) return false;
			if (!normalizedSearch) return true;

			return getSectionSearchText(section).includes(normalizedSearch);
		});
	}, [activeFilter, searchTerm]);

	useEffect(() => {
		if (visibleSections.length === 0) {
			setOpenSectionId(null);
			return;
		}

		if (
			openSectionId !== null &&
			!visibleSections.some((section) => section.id === openSectionId)
		) {
			setOpenSectionId(visibleSections[0].id);
		}
	}, [openSectionId, visibleSections]);

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

	const toggleAccordion = useCallback((id: string) => {
		setOpenAccordionIds((currentIds) => {
			const nextIds = new Set(currentIds);

			if (nextIds.has(id)) nextIds.delete(id);
			else nextIds.add(id);

			return nextIds;
		});
	}, []);

	return (
		<div className={styles.cardStack}>
			<div className={styles.infoToolbar}>
				<label className={styles.infoSearch}>
					<span aria-hidden="true">
						<svg
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.9"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="M20 20l-3.5-3.5" />
						</svg>
					</span>
					<input
						type="search"
						value={searchTerm}
						placeholder="Search regular info"
						aria-label="Search regular information"
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
				</label>

				<div className={styles.infoFilters} aria-label="Regular information filters">
					{INFO_FILTERS.map((filter) => (
						<button
							key={filter.id}
							type="button"
							className={`${styles.infoFilterChip} ${
								activeFilter === filter.id ? styles.infoFilterChipActive : ""
							}`}
							aria-pressed={activeFilter === filter.id}
							onClick={() => setActiveFilter(filter.id)}
						>
							{filter.label}
						</button>
					))}
				</div>
			</div>

			<p className={`${styles.notice} ${styles.infoNotice}`}>
				Placeholder content. Real copy, photos and prices are pending.
			</p>

			{visibleSections.length === 0 && (
				<div className={styles.infoEmptyState}>
					<b>No matching information</b>
					<small>Try another search or switch the filter.</small>
				</div>
			)}

			{visibleSections.map((section) => {
				const isOpen = openSectionId === section.id;
				const typeLabel = getSectionTypeLabel(section);

				return (
					<div
						key={section.id}
						className={`${styles.card} ${styles.infoCard} ${
							isOpen ? styles.infoCardOpen : ""
						}`}
					>
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
							{typeLabel && (
								<span className={styles.infoTypeBadge}>{typeLabel}</span>
							)}
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
								{section.accordions && (
									<div className={styles.infoAccordionList}>
										{section.accordions.map((item) => {
											const isAccordionOpen = openAccordionIds.has(item.id);

											return (
												<div key={item.id} className={styles.infoAccordionItem}>
													<div className={styles.infoAccordionHeader}>
														<button
															type="button"
															className={styles.infoAccordionToggle}
															aria-expanded={isAccordionOpen}
															aria-controls={`regular-info-${section.id}-${item.id}`}
															onClick={() => toggleAccordion(item.id)}
														>
															<span>{item.title}</span>
															<span
																className={`${styles.infoChevron} ${
																	isAccordionOpen
																		? styles.infoChevronOpen
																		: ""
																}`}
																aria-hidden="true"
															>
																<svg
																	width="16"
																	height="16"
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
														<button
															type="button"
															className={styles.infoCopyIconButton}
															aria-label={`Copy ${item.title}`}
															onClick={() =>
																void copyText(item.copyText, `${item.title} copied`)
															}
														>
															<svg
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="1.9"
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<rect x="9" y="9" width="11" height="11" rx="2" />
																<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
															</svg>
														</button>
													</div>

													{isAccordionOpen && (
														<pre
															className={styles.infoAccordionText}
															id={`regular-info-${section.id}-${item.id}`}
														>
															{item.copyText}
														</pre>
													)}
												</div>
											);
										})}
									</div>
								)}

								{section.copyText && !section.accordions && (
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
									{section.copyText && !section.accordions && (
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
