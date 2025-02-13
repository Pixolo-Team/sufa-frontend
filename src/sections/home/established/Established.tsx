"use client";
// REACT //
import React from "react";
import Slider from "react-slick";

// STYLES //
import styles from "./established.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// COMPONENTS //
import Image from "next/image";

// IMAGES //
import SkorostImage from "@/../public/images/skorost.jpg";

/** Established Screen */
const Established: React.FC<unknown> = () => {
	// Slider settings
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		variableWidth: true,
		centerMode: true,
		centerPadding: "0px",
		// slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,
		swipeToSlide: true,
	};
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className={styles.establishedWrapper}>
			<p>ESTABLISHED IN 2003</p>
			<Slider {...settings}>
				<div>
					<div className={styles.imageWrapper}>
						<Image src={SkorostImage} alt="skorost" className={"img-responsive"} />
					</div>
				</div>
				<div>
					<div className={styles.imageWrapper}>
						<Image src={SkorostImage} alt="skorost" className={"img-responsive"} />
					</div>
				</div>
				<div>
					<div className={styles.imageWrapper}>
						<Image src={SkorostImage} alt="skorost" className={"img-responsive"} />
					</div>
				</div>
			</Slider>
		</div>
	);
};

export default Established;
