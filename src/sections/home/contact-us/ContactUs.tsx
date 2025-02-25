"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Shapes } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "./contact-us.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// IMAGES //
import FootballImage from "@/../public/images/football-img.png";

interface ContactUsProps {
	onButtonClick: () => void;
}

/** Contact Us Screen */
const ContactUs: React.FC<ContactUsProps> = ({ onButtonClick }) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section
			className={`section-spacing padding-bottom-0 ${styles.contactUsWrapper}`}
		>
			{/* Contact Us Section */}
			<div className="container">
				<div
					className={`${styles.contactUsInner} flex justify-center align-center`}
				>
					<div className={`${styles.imageWrapper} fade-in-up`}>
						<Image
							src={FootballImage}
							alt="ftb"
							className="img-responsive full-width-img"
						/>
					</div>
					<div className={`${styles.contentWrapper} `}>
						{/* Title */}
						<p className={`${styles.title} font-weight-700 fade-in-up`}>
							Still have any Question?
						</p>
						{/* Button for small devices */}
						<div className={"hide-on-desktop fade-in-up"}>
							<Button
								text={"Contact Us"}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.LARGE}
								color={Colors.SECONDARY}
								onClick={() => {
									onButtonClick();
								}}
								level={ButtonLevels.BLOCK}
							/>
						</div>
						{/* Button for large devices */}
						<div className={"hide-on-mobile fade-in-up"}>
							<Button
								text={"Contact Us"}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.XXLARGE}
								color={Colors.SECONDARY}
								onClick={() => {
									onButtonClick();
								}}
								level={ButtonLevels.BLOCK}
							/>
						</div>
					</div>
				</div>
			</div>
			{/* Bottom image */}
			<div className={styles.bottomImageWrapper}>
				<div className={styles.bottomImage} />
			</div>
		</section>
	);
};

export default ContactUs;
