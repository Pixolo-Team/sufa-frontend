// REACT //
import React from "react";

// STYLES //
import styles from "./courses.module.scss";

// COMPONENTS //
import CoursesCard from "@/components/courses-card/CoursesCard";
import SectionHeader from "@/components/section-header/SectionHeader";

// IMAGES //
import gdpImage from "@/../public/images/courses/gdp.jpg";
import u11Image from "@/../public/images/courses/u-11.jpg";
import u15Image from "@/../public/images/courses/u-15.jpg";

interface CoursesProps {
	onCardClick: () => void;
}

/** Courses Screen */
const Courses: React.FC<CoursesProps> = ({ onCardClick }) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions`

	// View starts here
	return (
		<section id="courses" className="section-spacing">
			<div className="container">
				{/* Section header component */}
				<SectionHeader fadedText="Champions" highlightedText="Courses" />
				<p
					className={`${styles.sectionDescription} text-center font-weight-500 fade-in-up`}
				>
					Designed for Excellence!
				</p>
				{/* Courses card components */}
				<div className={`${styles.cardsWrapper} flex flex-column`}>
					<CoursesCard
						wrapperClass={`${styles.cardItem}`}
						courseImageSrc={gdpImage.src}
						courseTitle="Goalkeeper Development"
						onClick={onCardClick}
						altTextForImage="Professional football coaching for goalkeepers in Ghatkopar, Mumbai"
					/>
					<CoursesCard
						wrapperClass={`${styles.cardItem}`}
						courseImageSrc={u11Image.src}
						courseTitle="Under-11 Program"
						onClick={onCardClick}
						altTextForImage="Kids enjoying football coaching in Mumbai"
					/>
					<CoursesCard
						wrapperClass={`${styles.cardItem}`}
						courseImageSrc={u15Image.src}
						courseTitle="Under-15 Program"
						onClick={onCardClick}
						altTextForImage="Football training session for kids at the best football academy in Ghatkopar East"
					/>
					<CoursesCard
						wrapperClass={`${styles.cardItem}`}
						courseImageSrc={u15Image.src}
						courseTitle="Sports Psychology"
						onClick={onCardClick}
						altTextForImage="Football training session for kids at the best football academy in Ghatkopar East"
					/>
					<CoursesCard
						wrapperClass={`${styles.cardItem}`}
						courseImageSrc={gdpImage.src}
						courseTitle="Goalkeeper Mindset"
						onClick={onCardClick}
						altTextForImage="Football training session for kids at the best football academy in Ghatkopar East"
					/>
				</div>
			</div>
		</section>
	);
};

export default Courses;
