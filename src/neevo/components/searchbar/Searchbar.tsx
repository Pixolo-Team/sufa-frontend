"use client";
// REACT //
import React, { useState, useRef, useEffect, useMemo } from "react";

// TYPES //
import { DropdownOptionData } from "@/neevo/types/forms";

// ENUMS //
import { Sizes } from "@/neevo/enums/core.enum";
import { InputTextTypes } from "@/neevo/enums/input.enum";

// STYLES //
import styles from "@/neevo/components/searchbar/searchbar.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import Link from "next/link";

// UTILS //
import {
	capitalizeHyphenated,
	convertToKebabCase,
} from "@/neevo/utils/string-parser.util";

// Neevo Search Bar Component props.
interface SearchbarProps {
	label?: string;
	placeholder: string;
	options?: DropdownOptionData[];
	isDisabled?: boolean;
	size?: Sizes;
	onTextChange: (value: string) => void;
}

/** Neevo Search Bar Component */
const Searchbar: React.FC<SearchbarProps> = ({
	label = "",
	placeholder = "",
	options = [],
	isDisabled = false,
	size = Sizes.MEDIUM,
	onTextChange,
}) => {
	// Define States.
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [filteredOptions, setFilteredOptions] = useState<DropdownOptionData[]>(
		[]
	);
	const [inputValue, setInputValue] = useState<string>("");

	// Define Refs
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	// Helper Functions

	/** Function to return the Style Classes */
	const getSearchBarStyles = useMemo(() => {
		// Conditional classes for disabled state.
		const classes = [];
		// Add the Base Class
		classes.push(styles.neevoSearchbarWrap);
		classes.push(styles[`neevoSearchbar${capitalizeHyphenated(size)}`]);

		// Add Disabled Class
		if (isDisabled) {
			classes.push(styles.neevoSearchbarWrapDisabled);
		}

		return classes.join(" ");
	}, [isDisabled, size]);

	/** Toggle the dropdown's open/closed state */
	const toggleDropdown = (isOpen: boolean) => {
		setIsDropdownOpen(isOpen);
	};

	/** Function to clear value in input field when clear button is clicked */
	const clearInputText = () => {
		// Empty the state
		setInputValue("");
		// Send empty value to parent
		onTextChange("");
	};

	/** Function to handle click action on dropdown options. */
	const selectValue = (event: React.MouseEvent, option: DropdownOptionData) => {
		event.preventDefault();
		// Update the state
		setInputValue(option.label);
		// Hide the dropdown
		toggleDropdown(false);
		// Send the value to parent
		onTextChange(option.value);
	};

	/** Function to handle onChange event on search input */
	const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Show the dropdown
		toggleDropdown(true);
		// Send the value to parent
		onTextChange(event.target.value);
		// Empty the filtered options
		if (event.target.value === "") {
			setFilteredOptions([]);
		}
		setInputValue(event.target.value);
	};

	/** Function to render dropdown */
	const renderDropdown = () => {
		return (
			<div className={styles.dropdownOptionsList}>
				{/* Iterate through the Options */}
				{filteredOptions.map((optionItem, optionIndex) => (
					// Option Link
					<Link
						href={""}
						key={`dropdown-option-${convertToKebabCase(label || "")}-${optionIndex}`}
						onClick={(e) => selectValue(e, optionItem)}
						className={styles.dropdownOption}
					>
						{/* Search icon (left side) */}
						<Icon iconName="search-option" className={styles.optionsIconLeft} />
						{/* Option value (label) */}
						<p className={styles.searchbarOptionsValue}>{optionItem.label}</p>
					</Link>
				))}
			</div>
		);
	};

	/** On change in inputValue, update filteredOptions array. */
	useEffect(() => {
		// Filter list as per input only if options prop is provided.
		if (options && options.length > 0 && inputValue !== "") {
			const newFilteredOption = options.filter((optionItem) =>
				optionItem.value.toLowerCase().includes(inputValue.toLowerCase())
			);
			// Set the filtered options State with the new filtered
			setFilteredOptions(newFilteredOption);
			// Show options dropdown
			toggleDropdown(true);
		}
	}, [inputValue, options]);

	/** Trigger render when isDropdownOpen is true*/
	useEffect(() => {
		/** Close the dropdown when clicked outside */
		const closeDropdownOnClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

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
		<div className={getSearchBarStyles} ref={dropdownRef}>
			{/* Select Label */}
			{label.trim() !== "" && <p className={styles.label}>{label}</p>}

			<div className={styles.searchbarElementWrapper}>
				{/* Icon left */}
				<Icon iconName="search" className={styles.iconLeft} />
				{/* Select element */}
				<input
					type={InputTextTypes.EMAIL}
					className={styles.inputElement}
					onChange={(e) => onSearchInputChange(e)}
					onClick={() => toggleDropdown(true)}
					placeholder={placeholder}
					value={inputValue}
					disabled={isDisabled}
				/>
				{/* Clear button for Searchbar */}
				{inputValue.length !== 0 && (
					<button
						className={styles.clearButton}
						onClick={clearInputText}
						disabled={isDisabled}
					>
						<Icon iconName="close" className={styles.clearIcon} />
					</button>
				)}

				{/* Dropdown Options */}
				{inputValue.length !== 0 &&
					filteredOptions.length !== 0 &&
					isDropdownOpen &&
					renderDropdown()}
			</div>
		</div>
	);
};

export default Searchbar;
