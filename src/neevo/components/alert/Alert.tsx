// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Variants } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "@/neevo/components/alert/alert.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import Button from "@/neevo/components/button/Button";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

// Define the interface for AlertProps
interface AlertProps {
	title: string;
	description?: string;
	variant?: Variants;
	color?: Colors;
	leftIcon?: string;
	showClose?: boolean;
	buttonOneText?: string;
	buttonTwoText?: string;
	onButtonOneClick?: () => void;
	onButtonTwoClick?: () => void;
	onCloseClick?: () => void;
}

/** Neevo Alert component */
const Alert: React.FC<AlertProps> = ({
	title = "",
	description = "",
	variant = Variants.SOFT,
	color = Colors.PRIMARY,
	leftIcon = "",
	showClose = false,
	buttonOneText = "",
	buttonTwoText = "",
	onButtonOneClick,
	onButtonTwoClick,
	onCloseClick,
}) => {
	/** Helper function to generate the class name for the Alert component. */
	const alertClassName = useMemo(() => {
		// Make an array for classes.
		const classes = [];

		// Add the base class.
		classes.push(styles.neevoAlertBase);

		// Add the color class.
		classes.push(
			styles[
				`neevoAlert${capitalizeHyphenated(color)}${capitalizeHyphenated(variant)}`
			]
		);

		// Return the classes as a string.
		return classes.join(" ");
	}, [color, variant]);

	// Variable to determine if the Button one should be visible or not
	const showButtonOne = buttonOneText !== "" && onButtonOneClick;
	// Variable to determine if the Button two should be visible or not
	const showButtonTwo = buttonTwoText !== "" && onButtonTwoClick;

	// Render the Alert component.
	return (
		// Main Container.
		<div className={alertClassName}>
			{/* Left icon  */}
			{leftIcon.trim() !== "" && (
				<Icon className={styles.leftIcon} iconName={leftIcon} />
			)}

			{/* Text Container  */}
			<div className={styles.textContainer}>
				{/* Title */}
				<p className={styles.titleText}>{title}</p>
				{/* Description */}
				{description.trim() !== "" && (
					<p className={styles.description}>{description}</p>
				)}

				{/* Options button container */}
				{(showButtonOne || showButtonTwo) && (
					<div className={styles.buttonsContainer}>
						{/* Button One */}
						{showButtonOne && (
							<Button
								text={buttonOneText}
								variant={variant === Variants.SOLID ? Variants.SOFT : Variants.SOLID}
								color={color}
								onClick={onButtonOneClick}
								size={ButtonSizes.SMALL}
								level={ButtonLevels.INLINE}
							/>
						)}
						{/* Button Two */}
						{showButtonTwo && (
							<Button
								text={buttonTwoText}
								onClick={onButtonTwoClick}
								variant={variant}
								color={color}
								size={ButtonSizes.SMALL}
								level={ButtonLevels.INLINE}
							/>
						)}
					</div>
				)}
			</div>

			{/* Close button container (top right) */}
			{showClose && onCloseClick && (
				<div className={styles.closeButtonContainer}>
					{/* Close button */}
					<button className={styles.closeButton} onClick={onCloseClick}>
						{/* Close button Icon */}
						<Icon className={styles.closeButtonIcon} iconName="close" />
					</button>
				</div>
			)}
		</div>
	);
};

export default Alert;
