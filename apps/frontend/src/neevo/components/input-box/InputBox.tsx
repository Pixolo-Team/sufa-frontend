// REACT //
import React, { useMemo, useRef } from "react";

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
	min?: string;
	max?: string;
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
	min,
	max,
}) => {
	// Define States

	// Define Refs
	const inputRef = useRef<HTMLInputElement>(null);

	// Helper Functions
	const isDate = type === InputTextTypes.DATE;
	const effectiveIconRight = iconRight || (isDate ? "calendar" : "");
	const effectiveOnRightIconClick =
		onRightIconClick || (isDate ? () => inputRef.current?.showPicker?.() : undefined);

	/** Memoize the input class names to avoid unnecessary recalculations. */
	const inputClasses = useMemo(() => {
		return [
			styles.inputBox,
			styles[`inputBox${capitalizeHyphenated(size)}`],
			isDisabled && styles.inputBoxDisabled,
			!isDisabled && isError && styles.inputBoxError,
			iconLeft && styles.inputBoxPaddingLeft,
			effectiveIconRight && styles.inputBoxPaddingRight,
			showClear && styles.inputBoxClosePresent,
			showClear && effectiveIconRight && styles.inputBoxRightClosePresent,
		]
			.filter(Boolean)
			.join(" ");
	}, [isDisabled, isError, iconLeft, effectiveIconRight, showClear, size]);

	/** Memoize the icon right class names to avoid unnecessary recalculations. */
	const iconRightClasses = useMemo(() => {
		return [
			styles.iconRightContainer,
			effectiveOnRightIconClick && "cursor-pointer",
		]
			.filter(Boolean)
			.join(" ");
	}, [effectiveOnRightIconClick]);

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
					ref={inputRef}
					className={styles.inputElement}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={isDisabled}
					required={isRequired}
					onBlur={onBlur}
					id={id}
					min={min}
					max={max}
				/>

				<span className={styles.rightIconsWrapper}>
					{/* Right Icon */}
					{effectiveIconRight && (
						<button
							className={iconRightClasses}
							onClick={effectiveOnRightIconClick}
							disabled={isDisabled}
						>
							<Icon className={styles.iconRight} iconName={effectiveIconRight} />
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
