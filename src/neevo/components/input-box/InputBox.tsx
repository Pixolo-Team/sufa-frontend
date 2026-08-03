// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Sizes } from "@/neevo/enums/core.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "@/neevo/components/input-box/input-box.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

interface InputBoxProps {
	label?: string;
	type?: InputTextTypes;
	placeholder?: string;
	value: string;
	isDisabled?: boolean;
	isError: boolean;
	iconLeft?: string;
	iconRight?: string;
	showClear?: boolean;
	caption?: string;
	errorMessage: string;
	size?: Sizes;
	isRequired?: boolean;
	onChange: (value: string) => void;
	onClear: () => void;
	onBlur?: () => void;
	onRightIconClick?: () => void;
	id?: string;
}

/** Input Box Component */
const InputBox: React.FC<InputBoxProps> = ({
	label = "",
	type = InputTextTypes.TEXT,
	placeholder = "",
	value = "",
	isDisabled = false,
	isError = false,
	iconLeft = "",
	iconRight = "",
	showClear = true,
	caption = "",
	errorMessage = "",
	size = Sizes.MEDIUM,
	isRequired = false,
	onChange,
	onClear,
	onBlur,
	onRightIconClick,
	id,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Memoize the input class names to avoid unnecessary recalculations. */
	const inputClasses = useMemo(() => {
		return [
			styles.inputBox,
			styles[`inputBox${capitalizeHyphenated(size)}`],
			isDisabled && styles.inputBoxDisabled,
			!isDisabled && isError && styles.inputBoxError,
			iconLeft && styles.inputBoxPaddingLeft,
			iconRight && styles.inputBoxPaddingRight,
			showClear && styles.inputBoxClosePresent,
			showClear && iconRight && styles.inputBoxRightClosePresent,
		]
			.filter(Boolean)
			.join(" ");
	}, [isDisabled, isError, iconLeft, iconRight, showClear, size]);

	/** Memoize the icon right class names to avoid unnecessary recalculations. */
	const iconRightClasses = useMemo(() => {
		return [styles.iconRightContainer, onRightIconClick && "cursor-pointer"]
			.filter(Boolean)
			.join(" ");
	}, [onRightIconClick]);

	return (
		<div className={inputClasses}>
			{/* Label */}
			{label && (
				<label className={styles.inputLabel} htmlFor={id}>
					{label}
					{/* Required field (star)*/}
					{isRequired && <span className={styles.inputRequired}>*</span>}
				</label>
			)}

			<div className={styles.inputWrapper}>
				{/* Left Icon */}
				{iconLeft && <Icon className={styles.iconLeft} iconName={iconLeft} />}

				{/* Input Element */}
				<input
					className={styles.inputElement}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={isDisabled}
					required={isRequired}
					onBlur={onBlur}
					id={id}
				/>

				<span className={styles.rightIconsWrapper}>
					{/* Right Icon */}
					{iconRight && (
						<button
							className={iconRightClasses}
							onClick={onRightIconClick}
							disabled={isDisabled}
						>
							<Icon className={styles.iconRight} iconName={iconRight} />
						</button>
					)}

					{/* Clear Button */}
					{showClear && onClear && value.length > 0 && (
						<button
							className={styles.clearButton}
							disabled={isDisabled}
							onClick={onClear}
						>
							<Icon className={styles.clearButtonIcon} iconName="close" />
						</button>
					)}
				</span>
			</div>

			{/* Caption */}
			{caption && <p className={styles.caption}>{caption}</p>}

			{/* Error Message */}
			{errorMessage && isError && (
				<p className={styles.errorMessage}>{errorMessage}</p>
			)}
		</div>
	);
};

export default InputBox;
