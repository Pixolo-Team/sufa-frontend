"use client";
// REACT //
import React, { useState } from "react";

// STYLES //
import styles from "./faq.module.scss";

// COMPONENTS //
import Accordian from "@/components/accordian/Accordian";
import SectionHeader from "@/components/section-header/SectionHeader";

const faqList = [
	{
		question: "What age groups do you accept?",
		answer:
			"We accept students from ages 5-18. We have different programs for different age groups.",
	},
	{
		question: "Do you offer trial classes?",
		answer:
			"Yes, we offer one free trial class for new students to experience our coaching style.",
	},
	{
		question: "What equipment do students need to bring?",
		answer:
			"Students should bring their own sports shoes, water bottles, and comfortable athletic wear.",
	},
	{
		question: "Are the coaches certified?",
		answer:
			"Yes, all our coaches are certified professionals with years of experience in training students.Yes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training studentsYes, all our coaches are certified professionals with years of experience in training students",
	},
];

/** Faq Screen */
const Faq: React.FC<unknown> = () => {
	// Navigation and Route Params

	// Define States
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	// Define Refs

	// Helper Functions
	/** Function to handle toggle */
	const handleToggle = (index: number) => {
		setActiveIndex((prev) => (prev === index ? null : index));
	};

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className="container">
				{/* Section Header */}
				<SectionHeader
					fadedText="Faq`s"
					highlightedText="All the A’s to your Q’s"
					leftImage={"/images/squirrel.png"}
				/>
				{/* Accordian Items */}
				<div className={styles.content}>
					{faqList.map((faqItem, faqItemIndex) => (
						<div key={faqItemIndex} className={styles.accordianItem}>
							<Accordian
								title={faqItem.question}
								description={faqItem.answer}
								isOpen={activeIndex === faqItemIndex}
								onToggle={() => handleToggle(faqItemIndex)}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Faq;
