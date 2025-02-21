"use client";
// REACT //
import React, { useRef } from "react";
import Slider, { Settings } from "react-slick";

// STYLES //
import styles from "./graduates.module.scss";

// COMPONENTS //
import CustomSlickArrows from "@/components/custom-slick-arrows/CustomSlickArrows";
import GraduatesCard from "@/components/graduates-card/GraduatesCard";
import SectionHeader from "@/components/section-header/SectionHeader";

// Slider settings
const settings: Settings = {
	dots: false,
	arrows: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000,
	variableWidth: true,
	centerMode: true,
	responsive: [
		{
			breakpoint: 600,
			settings: { slidesToShow: 1, variableWidth: false },
		},
	],
};
// Graduates List data
const graduatesList = [
	{
		description: "Graduated in 2003 and played in the India League for DK Pharma",
		graduateName: "Shubham Verma",
		graduateSrc: "/images/graduate.jpg",
	},
	{
		description:
			"Graduated in 2003 and played in the India League for DK Pharma. Graduated in 2003 and played in the India.",
		graduateName: "Harsh Patil",
		graduateSrc: "/images/graduate.jpg",
	},
	{
		description: "Graduated in 2003 and played in the India League for DK Pharma",
		graduateName: "Pawan Pattem",
		graduateSrc: "/images/graduate.jpg",
	},
	{
		description: "Graduated in 2003 and played in the India League.",
		graduateName: "Karan Jagtap",
		graduateSrc: "/images/graduate.jpg",
	},
	{
		description: "Graduated in 2003 and played in the India League.",
		graduateName: "Allen Thomas",
		graduateSrc: "/images/graduate.jpg",
	},
];
/** Graduates Screen */
const Graduates: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs
	const sliderRef = useRef<Slider | null>(null);

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			{/* Section Header */}
			<SectionHeader fadedText="Champs" highlightedText="Meet Our Graduates" />
			{/* Graduate slider */}
			<div className={`${styles.graduatesWrapper} fade-in-up`}>
				<Slider ref={sliderRef} {...settings} className={styles.slider}>
					{graduatesList.map((graduate, graduateIndex) => (
						<div key={graduateIndex}>
							<div className={`${styles.cardWrap} flex justify-center`}>
								<div className={styles.cardWrapInner}>
									<GraduatesCard
										description={graduate.description}
										graduateName={graduate.graduateName}
										graduateImgSrc={graduate.graduateSrc}
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

export default Graduates;
