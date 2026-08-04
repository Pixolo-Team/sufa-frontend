// REACT //
import React, { useCallback, useMemo } from "react";

// ENUMS //
import { Colors, Shapes, Sizes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/neevo/components/switch/switch.module.scss";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface SwitchProps {
	label?: string;
	isChecked: boolean;
	onChange: (checked: boolean) => void;
	isDisabled?: boolean;
	color?: Colors;
	size?: Sizes;
	shape?: Shapes;
}

/** Neevo Switch Component */
const Switch: React.FC<SwitchProps> = ({
	label = "",
	isChecked = false,
	onChange,
	isDisabled = false,
	color = Colors.PRIMARY,
	size = Sizes.MEDIUM,
	shape = Shapes.DEFAULT,
}) => {
	/** Handles the switch toggle event */
	const handleSwitchToggle = useCallback(() => {
		if (!isDisabled) {
			onChange && onChange(!isChecked);
		}
	}, [isDisabled, onChange, isChecked]);

	/** Combine the base classes and make a collection of class. */
	const switchClassName = useMemo(() => {
		// Create array for Classes
		const classes = [styles.switch];

		// Add color class
		classes.push(styles[capitalizeHyphenated(color)]);

		// Add size and shape class
		if (size && shape) {
			classes.push(
				styles[`${capitalizeHyphenated(size)}${capitalizeHyphenated(shape)}`]
			);
		}

		// Add checked class
		if (isChecked) {
			classes.push(styles.checked);
		}

		// Add disabled class
		if (isDisabled) {
			classes.push(styles.disabled);
		}

		return classes.join(" ");
	}, [isChecked, isDisabled, color, shape, size]);

	return (
		<div className={styles.switchContainer}>
			{/* Switch */}
			<button
				type="button"
				aria-checked={isChecked}
				role="switch"
				onClick={handleSwitchToggle}
				disabled={isDisabled}
				className={switchClassName}
			>
				<span className={styles.switchHandle} aria-hidden="true" />
			</button>
			{/* Label */}
			{label && <span className={styles.switchLabel}>{label}</span>}
		</div>
	);
};

export default Switch;
