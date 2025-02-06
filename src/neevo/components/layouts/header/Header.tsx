"use client";
// REACT //
import React, { useState, useEffect } from "react";

// TYPES //
import { HeaderOptionData } from "@/neevo/types/forms";

// ENUMS //
import { Shapes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/components/neevo/header/header.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import Avatar from "@/neevo/components/avatar/Avatar";
import Link from "next/link";

interface HeaderProps {
	options: HeaderOptionData[];
}

/** Header Component */
const Header: React.FC<HeaderProps> = ({ options }) => {
	// Define Contexts

	// Define States
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
		useState<boolean>(false);

	// Define Refs

	// Helper Functions

	/** Add side menu active class */
	const addSideMenuActiveClass = () => {
		document.getElementById("html")?.classList.add("sideMenuActive");
	};

	/** Function to handle click action on options */
	const selectOption = (optionName: string, event: React.MouseEvent) => {
		event.preventDefault();
		switch (optionName) {
			case "logout":
				// TODO: Logout Function here
				break;
			default:
				console.log("ABC");
		}
	};

	/** Function to handle click action on profile */
	const toggleProfileDropdown = (event: React.MouseEvent) => {
		event.preventDefault();
		setIsProfileDropdownOpen((prev) => !prev);
	};

	/** Close the dropdown, when the user clicks anywhere outside */
	const closeDropdownOnClickOutside = () => {
		setIsProfileDropdownOpen(false);
	};

	// Use Effect and Focus Effect
	useEffect(() => {
		// Attach the event listener when the dropdown is open
		if (isProfileDropdownOpen) {
			document.addEventListener("click", closeDropdownOnClickOutside);
		} else {
			// Remove the event listener when the dropdown is closed to prevent memory leaks
			document.removeEventListener("click", closeDropdownOnClickOutside);
		}

		// Cleanup the event listener when the component unmounts
		return () => {
			document.removeEventListener("click", closeDropdownOnClickOutside);
		};
	}, [isProfileDropdownOpen]);

	// View starts here.
	return (
		<header className={styles.header}>
			{/* Left Content */}
			<div className={styles.leftContent}>
				{/* Logo */}
				<button
					className={styles.hamburgerMenuButton}
					onClick={addSideMenuActiveClass}
				>
					<Icon iconName="hamburger" className={styles.hamburgerIcon} />
				</button>
			</div>

			{/* Right Content */}
			<Link
				href={""}
				className={styles.rightContent}
				onClick={(e) => toggleProfileDropdown(e)}
			>
				<div className={styles.infoWrap}>
					<Avatar name="Name" shape={Shapes.ROUNDED} />
					<div>
						<p className={styles.profileUserName}>Dona Martinez</p>
						<p className={styles.userDesignation}>Designation</p>
					</div>
				</div>
				{options.length > 0 && (
					<Icon
						className={`${styles.headerDropdownArrow} ${
							isProfileDropdownOpen ? styles.drawerOpen : ""
						}`}
						iconName="right-arrow"
					/>
				)}

				{/* Options drawer */}
				{options.length > 0 && isProfileDropdownOpen && (
					<div className={styles.optionsContainer}>
						{options.map((optionItem, optionIndex) => {
							return (
								<Link
									href={""}
									key={`${optionItem.value}-${optionIndex}`}
									className={styles.option}
									onClick={(e) => selectOption(optionItem.label, e)}
								>
									<Icon
										iconName={optionItem.icon_name ?? ""}
										className={styles.iconLeft}
									/>
									<p className={styles.optionsValue}>{optionItem.label}</p>
								</Link>
							);
						})}
					</div>
				)}
			</Link>
		</header>
	);
};

export default Header;
