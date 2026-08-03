// REACT //
import React, { useMemo } from "react";

// STYLES //
import styles from "@/neevo/components/text-area/text-area.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface TextAreaProps {
	label?: string;
	placeholder?: string;
	value?: string;
	isDisabled?: boolean;
	isError: boolean;
	iconLeft?: string;
	iconRight?: string;
	showClear?: boolean;
	caption?: string;
	errorMessage: string;
	numberOfLines?: number;
	isRequired?: boolean;
	onChange: (value: string) => void;
	onClear: () => void;
	onBlur?: () => void;
	id?: string;
}

/** Textarea Component */
const TextArea: React.FC<TextAreaProps> = ({
	label = "",
	placeholder = "",
	value = "",
	isDisabled = false,
	isError = false,
	iconLeft = "",
	iconRight = "",
	showClear = true,
	caption = "",
	errorMessage = "",
	numberOfLines = 1,
	isRequired = true,
	onChange,
	onClear,
	onBlur,
	id,
}) => {
	// Define States

	// Define Refs

	// Helper Functions
	/** Memoize the textarea class names to avoid unnecessary recalculations. */
	const textareaClasses = useMemo(() => {
		return [
			styles.textarea,
			isDisabled && styles.textareaDisabled,
			!isDisabled && isError && styles.textareaError,
			iconLeft && styles.textareaPaddingLeft,
			iconRight && styles.textareaPaddingRight,
			showClear && styles.textareaClosePresent,
			showClear && iconRight && styles.textareaRightClosePresent,
		]
			.filter(Boolean)
			.join(" ");
	}, [isDisabled, isError, iconLeft, iconRight, showClear]);

	// Calculate the height of the textarea
	const textAreaHeight = `${numberOfLines * 16 * 1.5}px`;

	return (
		<div className={textareaClasses}>
			{/* Label */}
			{label && (
				<label className={styles.textareaLabel} htmlFor={id}>
					{label}
					{/* Required field (star)*/}
					{isRequired && <span className={styles.textareaRequired}>*</span>}
				</label>
			)}

			<div className={styles.textareaWrapper}>
				{/* Left Icon */}
				{iconLeft && <Icon className={styles.iconLeft} iconName={iconLeft} />}

				{/* Textarea Element */}
				<textarea
					className={styles.textareaElement}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={isDisabled}
					style={{ height: textAreaHeight }}
					onBlur={onBlur}
					rows={numberOfLines}
					id={id}
				/>

				<span className={styles.rightIconsWrapper}>
					{/* Right Icon */}
					{iconRight && <Icon className={styles.iconRight} iconName={iconRight} />}

					{/* Clear Button */}
					{showClear && value.length > 0 && (
						<button className={styles.clearButton} onClick={onClear}>
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

export default TextArea;
