"use client";
// REACT //
import React from "react";
import Slider, { Settings } from "react-slick";

// STYLES //
import styles from "./established.module.scss";

// COMPONENTS //
import Image from "next/image";

// IMAGES //
import SkorostImage from "@/../public/images/skorost.jpg";

// Slider settings
const settings: Settings = {
	dots: false,
	infinite: true,
	speed: 500,
	variableWidth: true,
	centerMode: true,
	centerPadding: "0px",
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000,
	arrows: false,
	swipeToSlide: true,
};

/** Established Screen */
const Established: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className={styles.establishedWrapper}>
				{/* Heading at front */}
				<p className={`${styles.heading} ${styles.backHeading} font-weight-700`}>
					ESTABLISHED IN 2003
				</p>
				<div className={styles.sliderWrapper}>
					{/* Heading at back */}
					<p className={`${styles.heading} ${styles.frontHeading} font-weight-700`}>
						ESTABLISHED IN 2003
					</p>
					{/* Images Silder */}
					<Slider {...settings} className={styles.slider}>
						<div>
							<div className={styles.imageWrapper}>
								<Image
									src={SkorostImage}
									alt="skorost"
									className={"img-responsive full-width-img"}
								/>
							</div>
						</div>
						<div>
							<div className={styles.imageWrapper}>
								<Image
									src={SkorostImage}
									alt="skorost"
									className={"img-responsive full-width-img"}
								/>
							</div>
						</div>
						<div>
							<div className={styles.imageWrapper}>
								<Image
									src={SkorostImage}
									alt="skorost"
									className={"img-responsive full-width-img"}
								/>
							</div>
						</div>
					</Slider>
				</div>
			</div>
		</section>
	);
};

export default Established;
