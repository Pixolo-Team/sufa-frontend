// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Shapes, Sizes, Variants } from "@/neevo/enums/core.enum";
import { BadgeTextTypes } from "@/neevo/enums/badge.enum";

// STYLES //
import styles from "@/neevo/components/badge/badge.module.scss";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface BadgeProps {
	color?: Colors;
	variant?: Variants;
	shape?: Shapes;
	size?: Sizes;
	text: string;
	showDot?: boolean;
	maxLength?: number;
	type?: BadgeTextTypes;
}

/** Neevo Badge Component */
const Badge: React.FC<BadgeProps> = ({
	color = Colors.PRIMARY,
	variant = Variants.SOLID,
	shape = Shapes.DEFAULT,
	size = Sizes.MEDIUM,
	text,
	showDot = false,
	maxLength = 0,
	type = BadgeTextTypes.NUMBER,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Function to get classes for Badge component. */
	const getBadgeClasses = useMemo(() => {
		// Create classes Array
		const classes = [styles.neevoBadge];

		// Class for color and variant
		classes.push(
			styles[`${capitalizeHyphenated(variant)}${capitalizeHyphenated(color)}`]
		);

		// Class for size and shape.
		classes.push(
			styles[`${capitalizeHyphenated(size)}${capitalizeHyphenated(shape)}`]
		);

		// If Show Dot is true
		if (showDot) {
			classes.push(styles.badgeInnerDot);
		}

		return classes.join(" ");
	}, [variant, color, size, shape, showDot]);

	/** Get truncated badge text with suffix if necessary */
	const badgeTextWithSuffix = useMemo(() => {
		// If maxLength is 0 or text length is less than maxLength, return text as it is
		if (maxLength === 0 || text.length <= maxLength) {
			return text;
		}

		// If type is NUMBER, display max value with suffix (e.g., "999+")
		if (type === BadgeTextTypes.NUMBER) {
			// Display max value with suffix (e.g., "999+")
			return `${"9".repeat(maxLength)}+`;
		}

		// Default truncation for other types (e.g., "abc..")
		return `${text.slice(0, maxLength)}..`;
	}, [type, maxLength, text]);

	// Use Effects and Use Focus Effect
	return (
		<div className={getBadgeClasses}>
			{/* Show text only if show dot is not true and text is not empty  */}
			{text && !showDot && (
				<p className={styles.badgeText}>{`${badgeTextWithSuffix}`}</p>
			)}
		</div>
	);
};
export default Badge;
