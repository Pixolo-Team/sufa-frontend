"use client";
// REACT //
import React, { useRef } from "react";
import Slider, { Settings } from "react-slick";

// STYLES //
import styles from "./coaches.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// COMPONENTS //
import CoachesCard from "@/components/coaches-card/CoachesCard";
import SectionHeader from "@/components/section-header/SectionHeader";
import CustomSlickArrows from "@/components/custom-slick-arrows/CustomSlickArrows";

// Slider settings
const settings: Settings = {
	dots: false,
	arrows: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidesToScroll: 1,
	autoplay: false,
	autoplaySpeed: 3000,
	variableWidth: false,

	responsive: [
		{
			breakpoint: 992, // iPad Air
			settings: { slidesToShow: 2 },
		},
		{
			breakpoint: 600,
			settings: { slidesToShow: 1, centerMode: true, variableWidth: true },
		},
	],
};

/** Coaches Screen */
const Coaches: React.FC<unknown> = () => {
	// Define Refs
	const sliderRef = useRef<Slider | null>(null);

	// View starts here
	return (
		<section className="section-spacing">
			<SectionHeader fadedText="Guruji" highlightedText="Our Coaches" />
			<div className={`${styles.coachesWrapper} container`}>
				<Slider ref={sliderRef} {...settings} className={styles.slider}>
					{[1, 2, 3].map((_, index) => (
						<div key={index}>
							<div className={styles.cardWrap}>
								<div className={styles.cardWrapInner}>
									<CoachesCard
										firstName="Adarsh"
										lastName="Anchan"
										description="Pandit is our Head Coach, he is very experienced and good with kids. He has school experience. He is thin. He wears specs."
										designation="Frontend Engineer - Lead"
										coachImageSrc="/images/coach.jpg"
										socialMedia={{ instagram: "inst" }}
									/>
								</div>
							</div>
						</div>
					))}
				</Slider>
				{/* Custom slick arrows */}
				<CustomSlickArrows sliderRef={sliderRef} />
			</div>
		</section>
	);
};

export default Coaches;
