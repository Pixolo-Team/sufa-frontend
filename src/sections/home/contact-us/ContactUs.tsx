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

// SVG's //
import HeartIcon from "@/../public/icons/filled/heart.svg";

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
			id="contact"
			className={`section-spacing padding-bottom-0 ${styles.contactUsWrapper}`}
		>
			{/* Contact Us Section */}
			<div className="container">
				<div className={`${styles.contactUsTextWrapper} flex flex-wrap`}>
					{/* First text block */}
					<div
						className={`${styles.firstTextBlock} flex flex-wrap align-center font-weight-700`}
					>
						<p className={styles.primaryText}>
							Scrolled
							{/* Mouse animation */}
							<span className={styles.mouse}>
								<span className={styles.scrollDot}></span>
							</span>
						</p>
						<p className={styles.secondaryText}>all the way here ha!</p>
					</div>
					{/* Second text block */}
					<div className={`${styles.secondTextBlock} font-weight-700`}>
						<p className={styles.secondaryText}>
							We are assuming you loved
							{/* Heart animation */}
							<span className={styles.heartContainer}>
								{[...Array(5)].map((_, index) => {
									const randomDelay = Math.random() * 2; // Random delay between 0s to 2s
									const randomLeft = Math.random() * 100 - 50; // Random left position (-50px to +50px)
									const randomRotation = Math.random() * 30 - 15; // Random rotation (-15deg to +15deg)

									return (
										<HeartIcon
											key={index}
											className={styles.heartIcon}
											style={{
												animationDelay: `${randomDelay}s`,
												left: `${randomLeft}px`,
												transform: `rotate(${randomRotation}deg)`,
											}}
										/>
									);
								})}
							</span>
						</p>
						<p className={`${styles.primaryText} ${styles.rightAlignedText}`}>
							Our Website
						</p>
					</div>
					{/* Third text block */}
					<div className={styles.thirdTextBlock}>
						<p className={`${styles.secondaryText} font-weight-700`}>
							Imagine the feeling when you see us
							<span className={`${styles.highlightText} font-weight-800`}>Coach!</span>
						</p>
					</div>
				</div>
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
								level={ButtonLevels.INLINE}
								extraClass="font-weight-600"
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
