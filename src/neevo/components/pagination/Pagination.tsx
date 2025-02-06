// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Sizes, Variants } from "@/neevo/enums/core.enum";
import {
	PaginationColors,
	PaginationShapes,
} from "@/neevo/enums/pagination.enum";

// STYLES //
import styles from "@/neevo/components/pagination/pagination.module.scss";

// COMPONENTS //
import Link from "next/link";
import Icon from "@/neevo/components/Icon";

// CONTEXTS //
import { useAppContext } from "@/contexts/App.context";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface PaginationProps {
	totalPages: number;
	url: string;
	variant?: Variants;
	color?: PaginationColors;
	size?: Sizes;
	shape?: PaginationShapes;
}

/** Neevo Pagination Component */
const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	url,
	variant = Variants.SOLID,
	color = PaginationColors.PRIMARY,
	size = Sizes.MEDIUM,
	shape = PaginationShapes.DEFAULT,
}) => {
	// Define Contexts
	const { getPageNumber } = useAppContext();

	// Get page number from URL
	const pageNumber = getPageNumber();

	// Define States

	// Define Use Effects

	// Ensure totalPages is an integer
	totalPages = Math.ceil(totalPages);

	// Helper Functions
	/** Generate ellipsis elements */
	const renderEllipsis = (start: number, end: number) => {
		const ellipsisElement = (
			<span
				key={`ellipsis-${start}-${end}`}
				className={`${styles.paginationCount} ${styles.ellipsisPagination}`}
			>
				...
			</span>
		);
		return ellipsisElement;
	};

	/** Render the Page buttons */
	const renderPaginationButtons = () => {
		// Define the maximum number of buttons to display
		const maxButtons = 3;

		// Calculate half of the maximum buttons to determine the range
		const halfButtons = Math.floor(maxButtons / 2);

		// Determine the start of the page button range, ensuring it doesn't go below 1
		let start = Math.max(pageNumber - halfButtons, 1);

		// Determine the end of the page button range, ensuring it doesn't exceed the total number of pages
		const end = Math.min(start + maxButtons - 1, totalPages);

		// Adjust the start if the number of buttons in the range is less than maxButtons
		if (end - start + 1 < maxButtons) {
			start = Math.max(end - maxButtons + 1, 1);
		}

		// Initialize an array to store the pagination buttons
		const buttons = [];

		// Add the first page button and an ellipsis if needed
		if (start > 1) {
			// Add the first page button
			buttons.push(
				<Link
					key="page-1"
					className={`${styles.paginationCount}`}
					href={`${url}?page=1`}
				>
					1
				</Link>
			);
			// Add an ellipsis if the start is beyond the second page
			if (start > 2) {
				buttons.push(renderEllipsis(1, start - 1));
			}
		}

		// Generate the main range of page buttons
		for (let pageNum = start; pageNum <= end; pageNum++) {
			buttons.push(
				<Link
					key={`page-${pageNum}`}
					className={`${styles.paginationCount} ${
						pageNum === pageNumber ? styles.active : ""
					}`}
					href={`${url}?page=${pageNum}`}
				>
					{pageNum}
				</Link>
			);
		}

		// Add an ellipsis and the last page button if needed
		if (end < totalPages) {
			// Add an ellipsis if the end is before the second-to-last page
			if (end < totalPages - 1) {
				buttons.push(renderEllipsis(end + 1, totalPages));
			}

			// Add the last page button
			buttons.push(
				<Link
					key={`page-${totalPages}`}
					className={`${styles.paginationCount}`}
					href={`${url}?page=${totalPages}`}
				>
					{totalPages}
				</Link>
			);
		}

		return buttons;
	};

	/** Pagination Classes */
	const paginationClassName = useMemo(() => {
		// Create array for Classes
		const classes = [];

		// Push the base class in it
		classes.push(styles.pagination);

		// Check and Add the color and variant classes
		if (variant && color) {
			classes.push(
				styles[`${capitalizeHyphenated(variant)}${capitalizeHyphenated(color)}`]
			);
		}

		// Check and add the Size/Shape Classes
		if (size && shape) {
			classes.push(
				styles[`${capitalizeHyphenated(size)}${capitalizeHyphenated(shape)}`]
			);
		}

		return classes.join(" ");
	}, [variant, color, size, shape]);

	return (
		<div className={`${paginationClassName}`}>
			{/* Previous Arrow */}
			{/* If I am on the first page, this arrow won't be seen */}
			{totalPages >= pageNumber && pageNumber > 1 && (
				<Link
					className={`${styles.arrow} ${styles.prevArrow}`}
					href={`${url}?page=${pageNumber - 1}`}
				>
					<Icon iconName="right-arrow" className={styles.arrowIcon} />
				</Link>
			)}

			{/* Show Pagination Button only if Total Pages are greater than 1 */}
			{totalPages > 1 && (
				<div className={styles.paginationCountWrap}>
					{renderPaginationButtons()}
				</div>
			)}

			{/* Next Arrow */}
			{/* Only show if not on the last page and totalPages is valid */}
			{pageNumber < totalPages && totalPages > 0 && (
				<Link
					className={`${styles.arrow} ${styles.nextArrow}`}
					href={`${url}?page=${pageNumber + 1}`}
				>
					<Icon iconName="right-arrow" className={styles.arrowIcon} />
				</Link>
			)}
		</div>
	);
};

export default Pagination;
