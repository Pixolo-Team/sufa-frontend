// REACT //
import React, { useMemo } from "react";

// STYLES //
import styles from "@/neevo/components/radio/radio.module.scss";

// ENUMS //
import { Colors, Sizes } from "@/neevo/enums/core.enum";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

/** Neevo Radio Button Component Props*/
interface RadioProps {
	label: string;
	color?: Colors;
	size?: Sizes;
	value: string;
	isChecked?: boolean;
	isDisabled?: boolean;
	onChange: (value: string) => void;
}

/** Neevo Radio Button Component */
const Radio: React.FC<RadioProps> = ({
	label = "",
	color = Colors.PRIMARY,
	size = Sizes.SMALL,
	value = "",
	isChecked = false,
	isDisabled = false,
	onChange,
}) => {
	/** Generate dynamic style classes as per Color, Size and State. */
	const radioClassName = useMemo(() => {
		// Create array for Classes
		const classes = [];

		// Push the base class in it
		classes.push(styles.radioContainer);

		// Selecting value for stateStyles
		const stateStyles = isDisabled ? "Disabled" : "Default";

		// Check and Add the color, size, and stateStyles classes
		if (color && size && stateStyles) {
			classes.push(
				styles[
					`${capitalizeHyphenated(color)}${capitalizeHyphenated(size)}${stateStyles}`
				]
			);
		}

		return classes.join(" ");
	}, [color, size, isDisabled]);

	// View starts here
	return (
		// Main container.
		<label className={radioClassName}>
			{/* Input element */}
			<input
				value={value}
				className={styles.radioInput}
				type="radio"
				checked={isChecked}
				disabled={isDisabled}
				onChange={(e) => onChange(e.target.value)}
			/>
			{/* label show only when label is provided */}
			{label !== "" && <p className={styles.radioLabel}>{label}</p>}
			{/* Radio Disc */}
			<span className={styles.radioBorder}></span>
		</label>
	);
};

export default Radio;
