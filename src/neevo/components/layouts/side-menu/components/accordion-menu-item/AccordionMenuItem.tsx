// REACT //
import React, { useEffect, useRef, useState } from "react";

// TYPES //
import { PathData } from "@/types/path";

// STYLES //
import "@/../public/styles/globals.scss";

// COMPONENTS //
import Link from "next/link";
import Icon from "@/neevo/components/Icon";

// NAVIGATION //
import { usePathname } from "next/navigation";

interface AccordionMenuItemProps {
	menuItem: PathData;
}

/** Accordion Menu Item  Component */
const AccordionMenuItem: React.FC<AccordionMenuItemProps> = ({ menuItem }) => {
	// Navigation
	const pathname = usePathname();

	// Define States
	const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(true);
	const [subMenuItemsContainerHeight, setSubMenuItemsContainerHeight] =
		useState<number>(0);

	// Define Refs
	const subMenuItemsContainerRef = useRef<HTMLDivElement>(null);

	// Helper Functions

	/** Toggle Collapsible Menu */
	const toggleCollapsibleMenu = () => {
		// Check if sub menu items container ref exists
		if (subMenuItemsContainerRef.current) {
			// Check if sub menu items container height is 0 then set height to scroll height and set is collapsed to false else set height to 0 and set is collapsed to true
			if (subMenuItemsContainerHeight === 0) {
				setSubMenuItemsContainerHeight(
					subMenuItemsContainerRef?.current?.scrollHeight ?? 0
				);
				setIsMenuCollapsed(false);
			} else {
				setSubMenuItemsContainerHeight(0);
				setIsMenuCollapsed(true);
			}
		}
	};

	/** Get submenu container height */
	const getSubMenuContainerHeight = () => {
		if (subMenuItemsContainerRef.current) {
			return subMenuItemsContainerRef?.current?.scrollHeight ?? 0;
		}
	};

	/** Check if the current path or any submenu path matches the pathname */
	const isActive = (itemPath: string, subMenuItems: PathData[] | undefined) => {
		if (pathname === itemPath) {
			return true;
		}
		if (subMenuItems) {
			return subMenuItems.some((subMenuItem) => pathname === subMenuItem.path);
		}
		return false;
	};

	// Use Effect and Focus Effect
	useEffect(() => {
		// Get sub menu items container height
		getSubMenuContainerHeight();
	}, []);

	return (
		<div className="sub-menu-item-container">
			<button
				className={`menuItem ${
					isActive(menuItem.path, menuItem.sub_menu_items) ? "active" : ""
				}`}
				onClick={toggleCollapsibleMenu}
			>
				{/* Menu Option  */}
				<Link
					href={menuItem.path}
					className="link"
					style={
						menuItem.sub_menu_items && menuItem.sub_menu_items.length > 0
							? { pointerEvents: "none" }
							: { pointerEvents: "all" }
					}
				>
					<div className="menu-right-content">
						<Icon iconName={menuItem.icon} className="menu-icon" />
						<p className="menu-item-text">{menuItem.name}</p>
					</div>
					{/* Down Arrow Icon */}
					{menuItem.sub_menu_items && menuItem?.sub_menu_items?.length > 0 && (
						<Icon
							iconName="right-arrow"
							className={`down-arrow-icon ${
								isMenuCollapsed && "down-arrow-icon-rotate"
							}`}
						/>
					)}
				</Link>
			</button>

			{/* Sub Menu Items */}
			{/* Render submenu item only if it exists and its length is greater than 0 */}
			{menuItem.sub_menu_items && menuItem.sub_menu_items.length > 0 && (
				<div
					className="subMenuItems"
					ref={subMenuItemsContainerRef}
					style={{ height: subMenuItemsContainerHeight }}
				>
					{menuItem?.sub_menu_items?.map((subMenuItem, subMenuItemIndex) => (
						<div
							key={`${subMenuItem.name}-${subMenuItemIndex}`}
							className={`subMenu ${
								pathname === subMenuItem.path ? "subMenuActive" : ""
							}`}
						>
							<Link href={subMenuItem.path} className="subMenuWrap">
								{subMenuItem.icon && (
									<Icon iconName={subMenuItem.icon} className="menu-icon" />
								)}
								<p className="menu-item-text">{subMenuItem.name}</p>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AccordionMenuItem;
