// REACT //
import React, { useState, useRef, useEffect, useMemo } from "react";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";

// ENUMS //
import { Sizes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/neevo/components/select/select.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

// UTILS //
import {
	capitalizeHyphenated,
	convertToKebabCase,
} from "@/neevo/utils/string-parser.util";

interface SelectProps {
	label?: string;
	placeholder?: string;
	options: DropdownOptionData[];
	leftIcon?: string;
	selectedOption?: DropdownOptionData | null;
	isError?: boolean;
	isDisabled?: boolean;
	caption?: string;
	errorMessage?: string;
	size?: Sizes;
	isRequired?: boolean;
	onChange: (option: DropdownOptionData) => void;
}

/** Neevo Select Dropdown Component */
const Select: React.FC<SelectProps> = ({
	label = "",
	placeholder = "Choose any option",
	options = [],
	leftIcon = "",
	selectedOption = null,
	isError,
	isDisabled = false,
	caption = "",
	errorMessage = "",
	size = Sizes.MEDIUM,
	isRequired = false,
	onChange,
}) => {
	// Define States
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	// Define Refs
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	/** Conditional classes for error and disabled states */
	const neevoSelectClasses = useMemo(() => {
		const classes = [
			styles.neevoSelectWrap,
			styles[`neevoSelect${capitalizeHyphenated(size)}`],
		];

		if (isError) {
			classes.push(styles.neevoSelectWrapError);
		}

		if (isDisabled) {
			classes.push(styles.neevoSelectWrapDisabled);
		}

		return classes.join(" ");
	}, [isError, isDisabled, size]);

	/** Function to toggle the dropdown's open/closed state */
	const toggleDropdown = (event: React.MouseEvent) => {
		event.preventDefault();
		setIsDropdownOpen((prevState) => !prevState);
	};

	/** Function to handle Dropdown's click action */
	const selectDropdownOption = (
		event: React.MouseEvent,
		option: DropdownOptionData
	) => {
		toggleDropdown(event);

		onChange(option);
	};

	/** Close the dropdown when clicked outside */
	const closeDropdownOnClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsDropdownOpen(false);
		}
	};

	useEffect(() => {
		// Attach the event listener when the dropdown is open
		if (isDropdownOpen) {
			document.addEventListener("click", closeDropdownOnClickOutside);
		} else {
			// Remove the event listener when the dropdown is closed to prevent memory leaks
			document.removeEventListener("click", closeDropdownOnClickOutside);
		}

		// Cleanup the event listener when the component unmounts
		return () => {
			document.removeEventListener("click", closeDropdownOnClickOutside);
		};
	}, [isDropdownOpen]);

	return (
		<div className={neevoSelectClasses} ref={dropdownRef}>
			{/* Select Label */}
			{label.trim() !== "" && (
				<p className={styles.label}>
					{label}
					{/* Required field (star symbol) */}
					{isRequired && <span className={styles.inputRequired}>*</span>}
				</p>
			)}
			<div className={styles.selectElementWrapper}>
				{/* Select Element */}
				<div
					onClick={(event) => toggleDropdown(event)}
					className={styles.selectElement}
				>
					{/* Left icon */}
					{leftIcon.trim() !== "" && (
						<Icon
							iconName={
								selectedOption === null
									? leftIcon
									: selectedOption?.iconName ?? leftIcon
							}
							mode="outline"
							className={styles.iconLeft}
						/>
					)}
					{/* Show Placeholder or the Selected Value */}
					<p className={selectedOption === null ? styles.placeholder : styles.value}>
						{selectedOption === null ? placeholder : selectedOption.label}
					</p>

					{/* Down arrow for Dropdown */}
					<Icon
						iconName="down-arrow"
						mode="outline"
						className={`${styles.dropDownArrow} ${
							isDropdownOpen ? styles.dropdownOpen : ""
						}`}
					/>
				</div>

				{/* Dropdown Options */}
				{isDropdownOpen && (
					<div className={styles.dropdownOptionsList}>
						{/* Loop for the Options */}
						{options.map((option, index) => (
							<div
								key={`dropdown-option-${convertToKebabCase(label ?? "")}-${index}`}
								onClick={(event) => {
									selectDropdownOption(event, option);
								}}
								className={`${styles.dropdownOption} ${
									selectedOption?.value === option.value
										? styles.neevoSelectOptionSelected
										: ""
								}`}
							>
								{/* If Icon Name exists then show the Icon */}
								{leftIcon.trim() !== "" && option.iconName && (
									<Icon iconName={option.iconName} className={styles.optionsIconLeft} />
								)}
								{/* Option label */}
								<p className={styles.selectOptionsValue}>{option.label}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Caption */}
			{caption.trim() !== "" && <p className={styles.caption}>{caption}</p>}

			{/* Error Message */}
			{isError && <p className={styles.errorMessage}>{errorMessage}</p>}
		</div>
	);
};

export default Select;
