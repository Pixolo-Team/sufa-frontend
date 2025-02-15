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
import GrassImage from "@/../public/images/grass.png";

/** Contact Us Screen */
const ContactUs: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section>
			{/* Contact Us Section */}
			<div className="container">
				<div
					className={`${styles.contactUsWrapper} flex justify-center align-center`}
				>
					<div className={styles.imageWrapper}>
						<Image
							src={FootballImage}
							alt="ftb"
							className="img-responsive full-width-image"
						/>
					</div>
					<div className={styles.contentWrapper}>
						{/* Title */}
						<p className={`${styles.title} font-weight-700`}>
							Still have any Question
						</p>
						{/* Button for small devices */}
						<div className={"hide-on-desktop"}>
							<Button
								text={"Contact Us"}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.MEDIUM}
								color={Colors.SECONDARY}
								onClick={() => {
									console.log("Contact Us");
								}}
								level={ButtonLevels.BLOCK}
							/>
						</div>
						{/* Button for large devices */}
						<div className={"hide-on-mobile"}>
							<Button
								text={"Contact Us"}
								shape={Shapes.ROUNDED}
								size={ButtonSizes.XXLARGE}
								color={Colors.SECONDARY}
								onClick={() => {
									console.log("Contact Us");
								}}
								level={ButtonLevels.BLOCK}
							/>
						</div>
					</div>
				</div>
			</div>
			{/* Bottom image */}
			<div className={styles.bottomImage}>
				<Image src={GrassImage} alt="grass" className={`${styles.grassImage}`} />
				<div className={styles.bottomBackground}></div>
			</div>
		</section>
	);
};

export default ContactUs;
