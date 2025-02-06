"use client";
// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Shapes, Sizes, Variants } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/neevo/components/icon-button/icon-button.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

// Define props interface for IconButton component.
interface IconButtonProps {
	icon: string;
	variant?: Variants;
	size?: Sizes;
	color?: Colors;
	shape?: Shapes;
	isDisabled?: boolean;
	onClick: () => void;
}

/** Neevo - Icon Button Component */
const IconButton: React.FC<IconButtonProps> = ({
	icon = "",
	variant = Variants.SOLID,
	size = Sizes.MEDIUM,
	color = Colors.PRIMARY,
	shape = Shapes.DEFAULT,
	isDisabled = false,
	onClick,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Combine base class with dynamically generated classNames. */
	const buttonClassName = useMemo(() => {
		// Create a Array for classes
		const classes = [];

		// Add Base Class
		classes.push(styles.neevoButton);

		// Add Color class
		classes.push(
			styles[`${capitalizeHyphenated(variant)}${capitalizeHyphenated(color)}`]
		);

		// Add Shape Classes
		classes.push(
			styles[`${capitalizeHyphenated(size)}${capitalizeHyphenated(shape)}`]
		);

		return classes.join(" ");
	}, [variant, color, size, shape]);

	// Use Effects

	return (
		// Button Component.
		<button
			className={`${buttonClassName} ${isDisabled ? styles.disabled : ""}`}
			disabled={isDisabled}
			onClick={onClick}
		>
			<div className={styles.buttonContent}>
				{/* Render Icon component if icon is provided */}
				{icon.trim() !== "" && (
					<Icon className={styles.buttonIcon} iconName={icon} />
				)}
			</div>
		</button>
	);
};

export default IconButton;
