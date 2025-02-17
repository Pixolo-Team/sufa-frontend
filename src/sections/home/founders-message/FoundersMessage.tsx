"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "./founders-message.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";
import ContentFromCms from "@/components/cms/ContentFromCms";

// IMAGES //
import FounderImage from "@/../public/images/abhay-amin.png";
import FounderSign from "@/../public/images/founder-sign.png";

/** Founders Message Screen */
const FoundersMessage: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className={`${styles.contentWrapper} flex`}>
				<div className={styles.messageWrapper}>
					<div className="left-container-padding">
						{/* Quotes svg */}
						<div className={`${styles.doubleQuotes} flex justify-center`}>
							<Icon iconName="quote" className={styles.verifiedIcon} mode="filled" />
							<Icon iconName="quote" className={styles.verifiedIcon} mode="filled" />
						</div>
						{/* Founder message */}
						<ContentFromCms wrapperClassName={styles.founderContentStyles}>
							<p className="fade-in-up">
								At Skorost United Academy, every child who steps onto the field isn’t
								just a player—we see them as the future of the game, and more
								importantly, the future of life itself. This academy is built on
								passion, discipline, and an unbreakable spirit—the same values that have
								shaped my own journey in football.
							</p>
							<p className="fade-in-up">
								We don’t just teach football; we build character. We create an
								environment where young athletes grow into strong, confident
								individuals—ready to take on challenges, both on and off the field.
								Every drill, every match, every lesson is designed not just to make
								better players, but to make better people.
							</p>
							<p className="fade-in-up">
								Here, you’re not just joining an academy—you’re becoming part of a
								legacy. Welcome to Skorost United. Let’s write history together.
							</p>
						</ContentFromCms>
						{/* Founder sign */}
						<Image src={FounderSign} alt="sign" className="fade-in-up" />
						{/* Founder Name */}
						<p className={`${styles.founderName} font-weight-800 fade-in-up`}>
							ABHAY AMIN
						</p>
						{/* About */}
						<p className={`${styles.designation} font-weight-700 fade-in-up`}>
							FOUNDER & OWNER
						</p>
					</div>
				</div>
				{/* Founder Image */}
				<div className={`${styles.imageWrapper} fade-in-up`}>
					<Image
						src={FounderImage}
						alt="founder"
						width={500}
						height={500}
						className={`${styles.founderImage} img-responsive full-width-image`}
					/>
				</div>
			</div>
		</section>
	);
};

export default FoundersMessage;
