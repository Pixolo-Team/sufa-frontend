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
		question:
			"What age groups do you cater to, and how are the sessions structured?",
		answer:
			"We offer programs for kids aged 6 to 16 years, with tailored sessions for each age group. Our sessions are designed to balance skill development, fitness, and fun, ensuring that both beginners and advanced players thrive.",
	},
	{
		question: "Is the training tailored to different skill levels?",
		answer:
			"Absolutely! Whether your child is new to football or already has some experience, our coaches assess each player's skill level and create personalized training plans to support their growth.",
	},
	{
		question: "Will my child get opportunities to participate in tournaments?",
		answer:
			"Yes! We believe in giving young players real-world experience. Our academy regularly participates in local and regional tournaments, offering a fantastic platform for kids to showcase their talent.",
	},
	{
		question: "How do you track and communicate my child’s progress?",
		answer:
			"We maintain detailed progress reports, and our coaches provide regular feedback. You'll receive updates through our app and have opportunities for one-on-one discussions with coaches during parent meetings.",
	},
	{
		question: "Do you support kids who want to pursue football professionally?",
		answer:
			"Definitely! For those with professional aspirations, we offer advanced training, mentorship, and guidance on trials and selections, helping bridge the gap between grassroots and professional football.",
	},
	{
		question: "What safety measures are in place during training?",
		answer:
			"Safety is a priority for us. While we don’t have dedicated medical staff, all our coaches are trained in first aid and equipped to handle minor injuries and emergencies. We ensure safe training practices, proper warm-ups, and always keep a first-aid kit on hand.",
	},
	{
		question: "How do you handle injuries or emergencies?",
		answer:
			"We have trained first-aid professionals on-site. In case of any injury, immediate care is provided, and parents are informed promptly. For emergencies, we follow a well-defined safety protocol to ensure the child's well-being.",
	},
	{
		question:
			"How will this program help my child’s overall development, not just in sports?",
		answer:
			"Our program focuses on holistic development. Beyond football skills, we emphasize teamwork, leadership, discipline, and building confidence. Our Growth & Development Program (GDP) also fosters mental and physical well-being.",
	},
	{
		question:
			"Will I get a discount or additional benefits if I pay for more than 2 months in advance?",
		answer:
			"Yes! We offer special discounts and priority booking benefits for those who opt for long-term plans. Reach out to us to learn about our current offers and packages.",
	},
	{
		question: "Are there flexible payment plans?",
		answer:
			"Of course! We provide flexible payment options, including monthly, quarterly, and annual plans. We aim to make the process convenient and accessible for every family.",
	},
	{
		question:
			"What happens if my child misses a class? Are makeup sessions available?",
		answer:
			"We understand that schedules can get busy. If your child misses a session, we offer makeup classes or provide alternative practice resources to ensure they stay on track.",
	},
	{
		question:
			"Can I get a full-year schedule to align with my child's school curriculum and other activities?",
		answer:
			"Yes! We provide a detailed annual calendar, including regular sessions, tournaments, and special camps. This helps you plan your child's other activities without any hassle.",
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
						<div key={faqItemIndex} className={`${styles.accordianItem} fade-in-up`}>
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
