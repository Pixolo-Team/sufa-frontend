"use client";
// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import {
	ButtonIconPosition,
	ButtonLevels,
	ButtonSizes,
	ButtonTypes,
} from "@/neevo/enums/button.enum";

// STYLES //
import styles from "@/neevo/components/button/button.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface ButtonProps {
	text: string;
	onClick: () => void;
	variant?: Variants;
	size?: ButtonSizes;
	color?: Colors;
	level?: ButtonLevels;
	leftIcon?: string;
	rightIcon?: string;
	iconPosition?: ButtonIconPosition;
	shape?: Shapes;
	isDisabled?: boolean;
	extraClass?: string;
	type?: ButtonTypes;
}

/** Neevo Button Component */
const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	variant = Variants.SOLID,
	size = ButtonSizes.MEDIUM,
	color = Colors.PRIMARY,
	level = ButtonLevels.BLOCK,
	leftIcon = "",
	rightIcon = "",
	iconPosition = ButtonIconPosition.END,
	shape = Shapes.DEFAULT,
	isDisabled = false,
	extraClass = "",
	type = ButtonTypes.BUTTON,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Combine the base classes and make a collection of class. */
	const buttonClassName = useMemo(() => {
		// Create array for Classes
		const classes = [];

		// Push the base class in it
		classes.push(styles.neevoButton);

		// Check and Add the color and variant classes
		if (variant && color) {
			classes.push(
				styles[`${capitalizeHyphenated(variant)}${capitalizeHyphenated(color)}`]
			);
		}

		// Check and add the Size/Shape/Icon Position Classes
		if (size && shape && iconPosition) {
			classes.push(
				styles[
					`${capitalizeHyphenated(size)}${capitalizeHyphenated(
						shape
					)}${capitalizeHyphenated(iconPosition)}`
				]
			);
		}

		// Add the Level Classes
		if (level) {
			classes.push(styles[`${capitalizeHyphenated(level)}`]);
		}

		// Add the extra classes which comes from parent
		if (extraClass) {
			classes.push(styles[`${extraClass}`]);
		}

		// Convert the array into Classes Strings (to put in ClassName)
		return classes.join(" ");
	}, [variant, color, size, shape, level, iconPosition, extraClass]);

	return (
		<button
			className={`${buttonClassName} ${isDisabled ? styles.disabled : ""}`}
			disabled={isDisabled}
			onClick={onClick}
			type={type}
		>
			<div className={styles.buttonContent}>
				{/* Icon Left */}
				{leftIcon && <Icon className={styles.buttonIconLeft} iconName={leftIcon} />}

				{/* Text */}
				<p className={styles.buttonText}>{text}</p>

				{/* Icon Right */}
				{rightIcon && (
					<Icon className={styles.buttonIconRight} iconName={rightIcon} />
				)}
			</div>
		</button>
	);
};

export default Button;
