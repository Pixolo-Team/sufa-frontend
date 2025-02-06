"use client";
// REACT //
import React, { useEffect, useState } from "react";

// TYPES //
import { PathData } from "@/types/path";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import AccordionMenuItem from "./components/accordion-menu-item/AccordionMenuItem";
import SideMenuLogo from "./components/side-menu-logo/SideMenuLogo";

// UTILS //
import { convertToKebabCase } from "@/neevo/utils/string-parser.util";

// NAVIGATION //
import { usePathname } from "next/navigation";

interface SideMenuProps {
	menuItems: {
		title: string;
		menu_items: PathData[];
	}[];
}

// Define Variables
let canHover = false;

/** Side Menu Component */
const SideMenu: React.FC<SideMenuProps> = ({ menuItems }) => {
	const currentPageUrl = usePathname();
	// Define Contexts

	// Define States
	const [isSideMenuMinimized, setIsSideMenuMinimized] = useState<boolean>(false);
	const [isSideMenuHovered, setIsSideMenuHovered] = useState<boolean>(false);

	// Helper Functions

	/** Toggle Side Menu */
	const toggleSideMenu = (isMinimized: boolean) => {
		// Set is minimized state
		setIsSideMenuMinimized(isMinimized);
		// Check if is minimized is true then add side menu collapsed class and content active class else remove side menu collapsed class and content active class
		if (isMinimized) {
			document.getElementById("html")?.classList.add("side-menu-collapsed");
			document.getElementById("content")?.classList.add("content-active");
			setTimeout(() => {
				canHover = true;
			}, 300);
		} else {
			document.getElementById("html")?.classList.remove("side-menu-collapsed");
			document.getElementById("content")?.classList.remove("content-active");
			document.getElementById("html")?.classList.remove("side-menu-hover");
			canHover = false;
		}
	};

	/** Add or remove hover class */
	const toggleHoverClass = (addClass: boolean) => {
		if (addClass) {
			if (isSideMenuMinimized && canHover) {
				document.getElementById("html")?.classList.add("side-menu-hover");
				setIsSideMenuHovered(true);
			}
		} else {
			document.getElementById("html")?.classList.remove("side-menu-hover");
			setIsSideMenuHovered(false);
		}
	};

	/** Close Sidemenu on page change */
	const closeSideMenu = () => {
		if (document.getElementById("html")?.classList.contains("sideMenuActive")) {
			document.getElementById("html")?.classList.remove("sideMenuActive");
		}
	};

	// Use Effect
	useEffect(() => {
		closeSideMenu();
	}, [currentPageUrl]);

	return (
		<div
			id="side-menu"
			className="side-menu-main"
			onMouseEnter={() => toggleHoverClass(true)}
			onMouseLeave={() => {
				toggleHoverClass(false);
			}}
		>
			{/* Side Menu Container */}
			<div id="side-menu-container" className="side-menu-container">
				{/* Side Menu */}
				<div className="side-menu">
					{/* Brand Logo */}
					<div className="logo-wrapper">
						<SideMenuLogo
							isSideMenuCollapsed={isSideMenuMinimized}
							isSideMenuHovered={isSideMenuHovered}
						/>
					</div>

					{/* Menu */}
					<div className="menu-wrapper">
						{menuItems.map((menuItem, menuItemIndex) => (
							<div
								className="menu-items-wrapper"
								key={`menu-wrap-${convertToKebabCase(menuItem.title)}-${menuItemIndex}`}
							>
								<p className="menu-title">{menuItem.title}</p>
								{/* Menu Items */}
								{menuItem.menu_items.map((singleMenuItem, singleMenuItemIndex) => (
									<AccordionMenuItem
										key={`sub-menu-item-${convertToKebabCase(
											singleMenuItem.name
										)}-${singleMenuItemIndex}`}
										menuItem={singleMenuItem}
									/>
								))}
							</div>
						))}
					</div>

					{/* Menu Toggle Button */}
					<button
						className="menu-toggle-arrow-button"
						onClick={() => toggleSideMenu(!isSideMenuMinimized)}
					>
						<Icon
							iconName="arrow"
							className={`back-arrow-icon ${
								isSideMenuMinimized && "back-arrow-icon-active"
							}`}
							mode="filled"
						/>
					</button>
				</div>
			</div>

			{/* Overlay */}
			<button
				id="overlayActive"
				className="overlayActive"
				onClick={() => {
					document.getElementById("html")?.classList.remove("sideMenuActive");
				}}
			/>
		</div>
	);
};

export default SideMenu;
