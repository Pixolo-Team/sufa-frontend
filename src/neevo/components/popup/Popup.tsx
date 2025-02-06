// REACT //
import React, { useMemo } from "react";

// ENUMS //
import { Colors, Sizes, Variants } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "@/neevo/components/popup/popup.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import Button from "@/neevo/components/button/Button";
import Link from "next/link";

interface PopupProps {
	title?: string;
	description?: string;
	buttonOneClick?: () => void;
	buttonTwoClick?: () => void;
	size?: Sizes;
	buttonOneText?: string;
	buttonTwoText?: string;
	children?: React.ReactNode;
	onCloseClick: () => void;
	onOverlayClick: () => void;
}

/** Popup Component */
const Popup: React.FC<PopupProps> = ({
	title,
	description,
	buttonOneClick,
	buttonTwoClick,
	size = Sizes.SMALL,
	buttonOneText,
	buttonTwoText,
	children,
	onCloseClick,
	onOverlayClick,
}) => {
	// Define Contexts

	// Define States

	// Define Refs

	// Helper Functions
	/** Get Size Class */
	const getSizeClass = useMemo(() => {
		return styles[size];
	}, [size]);

	/** Handle Overlay Click */
	const handleOverlayClick = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		// Prevent the default link navigation
		event.preventDefault();

		// Check if on overlay click exists then call the function
		if (onOverlayClick) {
			onOverlayClick();
		}
	};

	// UseEffect Hooks

	return (
		<div className={styles.popupMain}>
			<div className={`${styles.commonPopupWrap} ${getSizeClass}`}>
				{/* Close Button */}
				<button className={styles.closePopupButton} onClick={onCloseClick}>
					<Icon iconName="close" className={styles.closeIcon} />
				</button>
				<div>
					{/* Title */}
					{title && <p className={styles.confirmationTitle}>{title}</p>}

					{/* Description */}
					{description && <p className={styles.description}>{description}</p>}
				</div>

				{/* Children Prop */}
				{children && <div>{children}</div>}

				{/* Buttons */}
				{(buttonOneClick || buttonTwoClick) && (
					<div className={styles.confirmationButtonWrap}>
						{/* Button 1 */}
						{buttonOneText && buttonOneClick && (
							<div className={styles.confirmationButton}>
								<Button
									text={buttonOneText}
									size={ButtonSizes.SMALL}
									level={ButtonLevels.BLOCK}
									color={Colors.PRIMARY}
									variant={Variants.OUTLINE}
									onClick={buttonOneClick}
								/>
							</div>
						)}

						{/* Button 2 */}
						{buttonTwoText && buttonTwoClick && (
							<div className={styles.confirmationButton}>
								<Button
									text={buttonTwoText}
									size={ButtonSizes.SMALL}
									level={ButtonLevels.BLOCK}
									color={Colors.PRIMARY}
									variant={Variants.SOLID}
									onClick={buttonTwoClick}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Overlay */}
			<Link
				className={styles.popupOverlay}
				onClick={handleOverlayClick}
				href={""}
			/>
		</div>
	);
};

export default Popup;
