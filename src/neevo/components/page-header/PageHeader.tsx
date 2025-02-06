// REACT //
import React from "react";
import { useRouter } from "next/navigation";

// ENUMS //
import { Variants } from "@/neevo/enums/core.enum";
import {
	ButtonIconPosition,
	ButtonLevels,
	ButtonSizes,
} from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./page-header.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";

interface PageHeaderProps {
	title: string;
	description: string;
	onBackButtonClick?: () => void;
	buttonOneText?: string;
	onButtonOneClick?: () => void;
	buttonTwoText?: string;
	onButtonTwoClick?: () => void;
	showBack?: boolean;
	buttonOneLeftIcon?: string;
	buttonTwoLeftIcon?: string;
}

/** Page Header Component */
const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	description,
	onBackButtonClick,
	buttonOneText,
	onButtonOneClick,
	buttonTwoText,
	onButtonTwoClick,
	showBack = true,
	buttonOneLeftIcon,
	buttonTwoLeftIcon,
}) => {
	// Define Router
	const router = useRouter();

	// Define States

	// Define Refs

	// Helper Functions
	/** Define the back button click handler */
	const handleBackButtonClick = () => {
		if (onBackButtonClick) {
			onBackButtonClick();
		} else {
			router.back();
		}
	};

	return (
		<div className={styles.pageHeader}>
			{showBack && (
				<div className={styles.backButtonWrap}>
					{/* Back Button */}
					<Button
						variant={Variants.PLAIN}
						text="Back"
						leftIcon="arrow"
						onClick={handleBackButtonClick}
						level={ButtonLevels.INLINE}
						size={ButtonSizes.SMALL}
						extraClass="horizontalSpaceNone"
					/>
				</div>
			)}

			<div className={styles.headerContent}>
				<div className={styles.headerContentInfo}>
					{/* Page Title */}
					<h1 className={styles.headerTitle}>{title}</h1>
					{/* Page Description */}
					<p className={styles.headerDescription}>{description}</p>
				</div>

				<div className={styles.headerActionsButtonWrap}>
					{/* Button 1 */}
					{buttonOneText && onButtonOneClick && (
						<div className={styles.headerActionButton}>
							<Button
								variant={Variants.OUTLINE}
								text={buttonOneText}
								onClick={onButtonOneClick}
								leftIcon={buttonOneLeftIcon}
								iconPosition={ButtonIconPosition.CENTER}
							/>
						</div>
					)}

					{/* Button 2 */}
					{buttonTwoText && onButtonTwoClick && (
						<div className={styles.headerActionButton}>
							<Button
								variant={Variants.SOLID}
								text={buttonTwoText}
								onClick={onButtonTwoClick}
								leftIcon={buttonTwoLeftIcon}
								iconPosition={ButtonIconPosition.CENTER}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PageHeader;
