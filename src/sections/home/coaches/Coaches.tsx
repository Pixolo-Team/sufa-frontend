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
			settings: { slidesToShow: 1 },
		},
	],
};

const coachesData = [
	{
		firstName: "Shubham",
		lastName: "Pandit",
		description:
			"A C License coach with passion and experience, he transforms young talents with grit and dedication. Inspiring players to love, play, and own the game, he instills a winning mindset that fuels big dreams and bold play.",
		designation: "Head Coach",
		coachImageSrc: "/images/pandit.jpg",
		socialMedia: { instagram: "inst" },
		alt: "Professional coaching team at the best football academy in Ghatkopar under 11, under 15 and under 17",
	},
	{
		firstName: "Harsh",
		lastName: "Patil",
		description:
			"An I-League goalkeeper, Harsh Patil coaches our U11 and U15 teams. As the head of our Goalkeeper Development Program (GDP), he molds young keepers with agility, tactical awareness, and fearless confidence.",
		designation: "Goalkeeper Coach",
		coachImageSrc: "/images/harsh.jpg",
		socialMedia: { instagram: "https://www.instagram.com/_harshgk/" },
		alt: "Professional coaching team at the best football academy in Ghatkopar under 11, under 15 and under 17",
	},
	{
		firstName: "Dipesh",
		lastName: "Suvarna",
		description:
			"Captain of our senior team, Dipesh Suvarna is developing his coaching skills while leading young athletes. His firsthand experience offers invaluable mentorship on and off the pitch.",
		designation: "Youth Coach",
		coachImageSrc: "/images/dipesh.jpg",
		socialMedia: { instagram: "https://www.instagram.com/dipesh_31/" },
		alt: "Professional coaching team at the best football academy in Ghatkopar under 11, under 15 and under 17",
	},
	{
		firstName: "Fawaz",
		lastName: "Pakkir",
		description:
			"With rich experience as a senior player and coach, Fawaz Pakkir sharpens young footballers’ skills and game sense—building future champions with every drill.",
		designation: "Youth Coach",
		coachImageSrc: "/images/fawaz.jpg",
		socialMedia: { instagram: "meera_insta" },
		alt: "Professional coaching team at the best football academy in Ghatkopar under 11, under 15 and under 17",
	},
	// {
	// 	firstName: "Sarthak",
	// 	lastName: "Bhosale",
	// 	description:
	// 		"Sarthak Bhosale leads our senior girls' team with a focus on skill, teamwork, and confidence. His training transforms talent into fierce competitors.",
	// 	designation: "Women’s Coach",
	// 	coachImageSrc: "/images/coach.jpg",
	// 	socialMedia: { instagram: "meera_insta" },
	// },
	{
		firstName: "Pradeep",
		lastName: "Ghavri",
		description:
			"Pradeep Ghavri ensures our players’ peak performance with specialized fitness programs. His training builds strength, prevents injuries, and boosts overall conditioning.",
		designation: "Fitness Coach",
		coachImageSrc: "/images/pradeep.jpg",
		socialMedia: { instagram: "meera_insta" },
		alt: "Professional coaching team at the best football academy in Ghatkopar under 11, under 15 and under 17",
	},
];

/** Coaches Screen */
const Coaches: React.FC<unknown> = () => {
	// Define Refs
	const sliderRef = useRef<Slider | null>(null);

	// View starts here
	return (
		<section className="section-spacing">
			{/* Section Header */}
			<SectionHeader fadedText="Guruji" highlightedText="Our Coaches" />
			{/* Coaches slider */}
			<div className={`${styles.coachesWrapper} container fade-in-up`}>
				<Slider ref={sliderRef} {...settings} className={styles.slider}>
					{coachesData.map((coach, coachIndex) => (
						<div key={coachIndex}>
							<div className={styles.cardWrap}>
								<div className={styles.cardWrapInner}>
									<CoachesCard
										firstName={coach.firstName}
										lastName={coach.lastName}
										description={coach.description}
										designation={coach.designation}
										coachImageSrc={coach.coachImageSrc}
										socialMedia={coach.socialMedia}
										alt={coach.alt}
									/>
								</div>
							</div>
						</div>
					))}
				</Slider>
				{/* Custom slick arrows */}
				<div className={styles.customArrows}>
					<CustomSlickArrows sliderRef={sliderRef} />
				</div>
			</div>
		</section>
	);
};

export default Coaches;
