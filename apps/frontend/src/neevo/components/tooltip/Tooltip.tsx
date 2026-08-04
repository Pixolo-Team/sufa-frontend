// REACT //
import React, { useMemo, useState } from "react";

// STYLES //
import styles from "@/neevo/components/tooltip/tooltip.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface TooltipProps {
	title: string;
	message?: string;
	position?: "top" | "down" | "left" | "right";
	onCloseClick: () => void;
}

/** Neevo Tooltip Component */
const Tooltip: React.FC<TooltipProps> = ({
	title,
	message = "",
	position = "top",
	onCloseClick = () => {
		return;
	},
}) => {
	// Initialize state for showing the message.
	const [showMessage, setShowMessage] = useState<boolean>(false);

	/** Apply appropriate style classes for the tooltip container based on the direction. */
	const toolTipStyles = useMemo(() => {
		// Class name based on directions.
		const classes = [styles.tooltipWrapper];

		// Determine the direction and push the corresponding class to the array.
		switch (position) {
			case "left":
				classes.push(styles["tooltipLeft"]);
				break;
			case "right":
				classes.push(styles["tooltipRight"]);
				break;
			case "down":
				classes.push(styles["tooltipDown"]);
				break;
			case "top":
				classes.push(styles["tooltipTop"]);
				break;
			default:
				break;
		}

		// Join all classes into a single string separated by spaces and return it.
		return classes.join(" ");
	}, [position]);

	/** Function to handle the click action on the Read less/Read more button */
	const toggleReadMoreContent = () => {
		setShowMessage((prev) => !prev);
	};

	return (
		// Container for the tooltip
		<div className={toolTipStyles}>
			<div className={styles.tooltipContainer}>
				{/* Header for the tooltip */}
				<div className={styles.header}>
					{/* Title of the tooltip */}
					<p className={styles.title}>{title}</p>
					{/* Close button for the tooltip */}
					<button className={styles.closeButton} onClick={onCloseClick}>
						<Icon className={styles.closeIcon} iconName="close" />
					</button>
				</div>

				{/* Message to be displayed */}
				{showMessage && message.length !== 0 && (
					<p className={styles.message}>{message}</p>
				)}

				{/* Footer with the show hide button */}
				{message.length !== 0 && (
					<div className={styles.footer}>
						{/* Show hide button */}
						<button className={styles.showHideButton} onClick={toggleReadMoreContent}>
							{showMessage && message.length !== 0 ? "Read less" : "Read more"}
						</button>
					</div>
				)}

				{/* Pointer for the tooltip */}
				<div className={styles.pointer} />
			</div>
		</div>
	);
};

export default Tooltip;
