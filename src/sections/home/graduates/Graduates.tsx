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
			breakpoint: 1200,
			settings: {
				slidesToShow: 3,
				variableWidth: false,
				centerPadding: "0px",
			},
		},
		{
			breakpoint: 600,
			settings: { slidesToShow: 1, variableWidth: false },
		},
	],
};
// Graduates List data
const graduatesList = [
	{
		description:
			"One of the most prolific striker Mumbai has seen. Went on the play at amazing levels and the highest goalscorer of our Senior Team.",
		graduateName: "Shubham Verma",
		graduateSrc: "/images/graduates/shubham.jpg",
	},
	{
		description:
			"Selected for the senior team at 17, played Junior I-League, and now leads as Vice-Captain—Allen Thomas, a true Skorost warrior!",
		graduateName: "Allen Thomas",
		graduateSrc: "/images/graduates/allen.jpg",
	},
	{
		description:
			"Showed immense potential from a young age, played ISL & I-League for many team across India, and now gives back as a coach at Skorost Academy",
		graduateName: "Harsh Patil",
		graduateSrc: "/images/graduates/harsh.jpg",
	},
	{
		description:
			"Selected at 16 as sub for our CB, soon made the main team. Played I-League with Kenkre, starred across India, now shining in the Kolkata League!",
		graduateName: "Pawan Pattem",
		graduateSrc: "/images/graduates/pawan.jpg",
	},
	{
		description:
			"Selected at 17, quickly proved his potential. Rose to the top of the senior squad before making his mark in the Junior I-League.",
		graduateName: "Karan Jagtap",
		graduateSrc: "/images/graduates/karan.jpg",
	},
	{
		description:
			"Spotted by Skorost at 14 as a raw talent, he matured into a powerhouse, rising through the ranks to dominate in the I-League.",
		graduateName: "Jayesh Kurup",
		graduateSrc: "/images/graduates/jayesh.jpg",
	},
	{
		description:
			"A relentless worker since 16, he became one of Mumbai’s top attacking mids, captaining his team in the Junior I-League.",
		graduateName: "Pratamesh Dhumal",
		graduateSrc: "/images/graduates/pratamesh.jpg",
	},
	{
		description:
			"Wise beyond his years, he captained the Youth Team, became Senior Team Vice-Captain, and now shines as a regular in his District team.",
		graduateName: "Atul Ghodke",
		graduateSrc: "/images/graduates/atul.jpg",
	},
	{
		description:
			"The young boy from Ghatkopar, the heart of Skorost. A talent from our roots, now the captain of our senior team.",
		graduateName: "Sarthak Bhosale",
		graduateSrc: "/images/graduates/sarthak.jpg",
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
