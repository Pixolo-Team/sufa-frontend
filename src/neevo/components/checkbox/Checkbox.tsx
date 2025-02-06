"use client";
// REACT //
import React, { useEffect, useRef } from "react";

// ENUMS //
import { Colors, Sizes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/neevo/components/checkbox/checkbox.module.scss";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

// Neevo Checkbox Interface.
interface CheckboxProps {
	indeterminate?: boolean;
	isChecked?: boolean;
	isDisabled?: boolean;
	label?: string;
	size?: Sizes;
	color?: Colors;
	onChange: (value: boolean) => void;
}

/** Neevo Checkbox */
const Checkbox: React.FC<CheckboxProps> = ({
	indeterminate = false,
	isChecked = false,
	isDisabled = false,
	label = "",
	size = Sizes.MEDIUM,
	color = Colors.PRIMARY,
	onChange,
}) => {
	// Define Refs
	const checkboxRef = useRef<HTMLInputElement | null>(null);

	// Helper Functions

	/** Get all the classes needed for Checkbox, based on the Props */
	const getCheckboxStyles = () => {
		// Make array for Classes
		const classes = [];

		// Add Base Class
		classes.push(styles.checkboxContainer);

		// Add disabled Class
		if (isDisabled) {
			classes.push(styles.disabled);
		}

		// Add Color Class
		classes.push(
			styles[
				`${capitalizeHyphenated(color as string)}${capitalizeHyphenated(
					size as string
				)}`
			]
		);

		return classes.join(" ");
	};

	// Use Effects and Focus Effects
	useEffect(() => {
		if (checkboxRef.current) {
			checkboxRef.current.indeterminate = !isChecked && indeterminate;
		}
	}, [indeterminate, isChecked]);

	return (
		<label className={getCheckboxStyles()}>
			{/* Label  - if available */}
			{label?.trim() !== "" && <p className={styles.label}>{label}</p>}

			{/* Checkbox - Input component */}
			<input
				type="checkbox"
				ref={checkboxRef}
				disabled={isDisabled}
				checked={isChecked}
				onChange={(e) => {
					onChange(e.target.checked);
				}}
			/>
			<span className={styles.checkmark}></span>
		</label>
	);
};

export default Checkbox;
