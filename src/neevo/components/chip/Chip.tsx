// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Shapes, Sizes, Variants } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/neevo/components/chip/chip.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface ChipProps {
	text: string;
	color?: Colors;
	variant?: Variants;
	size?: Sizes;
	shape?: Shapes;
	leftIcon?: string;
	showClose?: boolean;
	isEllipses?: boolean;
	onCloseClick?: () => void;
}

/** Neevo Chip Component */
const Chip: React.FC<ChipProps> = ({
	text,
	color = Colors.PRIMARY,
	variant = Variants.SOLID,
	size = Sizes.MEDIUM,
	leftIcon = "",
	shape = Shapes.DEFAULT,
	showClose = false,
	isEllipses = false,
	onCloseClick,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Combine the base classes and make a collection of class. */
	const chipClassName = useMemo(() => {
		// Create array for Classes
		const classes = [];

		// Push the base class in it
		classes.push(styles.neevoChipContainer);

		// Check and Add the color and variant classes
		if (variant && color) {
			classes.push(
				styles[`${capitalizeHyphenated(variant)}${capitalizeHyphenated(color)}`]
			);
		}

		// Check and add the Size/Shape/Icon Position Classes
		if (size && shape) {
			classes.push(
				styles[`${capitalizeHyphenated(size)}${capitalizeHyphenated(shape)}`]
			);
		}

		// Convert the array into Classes Strings (to put in ClassName)
		return classes.join(" ");
	}, [variant, color, size, shape]);

	return (
		<div className={`${chipClassName}`}>
			<div className={styles.chipWrapper}>
				{/* Left Icon */}
				{leftIcon && <Icon className={styles.chipLeftIcon} iconName={leftIcon} />}

				{/* Text */}
				<p
					className={`${styles.chipText} ${
						isEllipses ? styles.chipTextEllipses : ""
					}`}
				>
					{text}
				</p>
			</div>

			{/* Close Button */}
			{showClose && onCloseClick && (
				<button className={styles.chipCloseButton} onClick={onCloseClick}>
					<Icon className={styles.chipCloseIcon} iconName="close" />
				</button>
			)}
		</div>
	);
};

export default Chip;
