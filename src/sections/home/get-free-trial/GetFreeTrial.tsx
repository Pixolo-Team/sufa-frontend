"use client";
// REACT //
import React from "react";

// ENUMS //
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";
import { Colors, Shapes } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "./get-free-trial.module.scss";

// COMPONENTS //
import Button from "@/neevo/components/button/Button";
import Image from "next/image";

// IMAGES //
import TigerImage from "@/../public/images/tiger-cub.png";

interface GetFreeTrialProps {
	onButtonClick: () => void;
}

/** Get Free Trial Screen */
const GetFreeTrial: React.FC<GetFreeTrialProps> = ({ onButtonClick }) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className="container">
				<div
					className={`${styles.contentWrapper} flex justify-center align-center`}
				>
					<div className={`${styles.textWrapper} `}>
						{/* Heading */}
						<p className={`${styles.heading} font-weight-700 fade-in-up`}>
							Get a Free Trial
						</p>
						{/* Sub heading */}
						<p className={`${styles.subHeading} font-weight-400 fade-in-up`}>
							Experience the Skorost way! Join us for a free trial session.
						</p>
						{/* Button for small devices */}
						<div className={"hide-on-desktop fade-in-up"}>
							<Button
								text={"Book a Free Trial Now"}
								onClick={() => onButtonClick()}
								level={ButtonLevels.INLINE}
								size={ButtonSizes.MEDIUM}
								shape={Shapes.ROUNDED}
								color={Colors.SECONDARY}
							/>
						</div>
						{/* Button for large devices */}
						<div className={"hide-on-mobile fade-in-up"}>
							<Button
								text={"Book a Free Trial Now"}
								onClick={() => onButtonClick()}
								level={ButtonLevels.INLINE}
								size={ButtonSizes.XLARGE}
								shape={Shapes.ROUNDED}
								color={Colors.SECONDARY}
							/>
						</div>
					</div>
					{/* Image */}
					<div className={`${styles.imageWrapper} fade-in-up`}>
						<Image
							src={TigerImage}
							alt="tiger"
							className={`${styles.image} img-responsive full-width-img`}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default GetFreeTrial;
