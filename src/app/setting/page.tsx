"use client";
// REACT //
import React from "react";

// ENUMS //
import {
	ButtonIconPosition,
	ButtonLevels,
	ButtonSizes,
} from "@/neevo/enums/button.enum";
import { Colors, Variants } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "@/app/setting/setting.module.scss";
import ThemeSwitcher from "@/neevo/components/ThemeSwitcher";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";

/** Setting Screen */
const SettingScreen: React.FC<unknown> = () => {
	return (
		<div className={`container ${styles.settingsContainer}`}>
			{/* Heading */}
			<p className={styles.settingTitle}>Settings</p>
			{/* Subheading */}
			<p className={styles.settingDescription}>Do Account Actions here</p>

			{/* Container for toggle and logout section */}
			<div className={styles.settingListWrapper}>
				{/* Toggle Section */}
				<div className={styles.listElement}>
					<p className={styles.listTitle}>Dark Mode</p>
					{/* Theme Switcher */}
					<div className={styles.themeSwitcherContainer}>
						<ThemeSwitcher />
					</div>
				</div>

				{/* Logout Section */}
				<div className={styles.listElement}>
					<p className={styles.listTitle}>Logout from here</p>
					{/* Button Component */}
					<Button
						text="Logout"
						onClick={() => console.log("clicked")}
						leftIcon="logout"
						size={ButtonSizes.SMALL}
						variant={Variants.OUTLINE}
						color={Colors.PRIMARY}
						level={ButtonLevels.INLINE}
						iconPosition={ButtonIconPosition.CENTER}
					/>
				</div>
			</div>
		</div>
	);
};

export default SettingScreen;
