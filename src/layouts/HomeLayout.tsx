"use client";
// REACT //
import React, { useEffect, useState } from "react";

// STYLES //
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./home-layout.module.scss";

// COMPONENTS //
import StickySocial from "@/components/sticky-social/StickySocial";
import EnquiryForm from "@/components/enquiry-form/EnquiryForm";
import Icon from "@/neevo/components/Icon";

// OTHERS //
import ScrollOut from "scroll-out";

// SECTIONS //
import Banner from "@/sections/home/banner/Banner";
import ChildrenToChampions from "@/sections/home/children-to-champions/ChildrenToChampions";
import Coaches from "@/sections/home/coaches/Coaches";
import ContactUs from "@/sections/home/contact-us/ContactUs";
import Courses from "@/sections/home/courses/Courses";
import Established from "@/sections/home/established/Established";
import Faq from "@/sections/home/faq/Faq";
import FoundersMessage from "@/sections/home/founders-message/FoundersMessage";
import GetFreeTrial from "@/sections/home/get-free-trial/GetFreeTrial";
import Graduates from "@/sections/home/graduates/Graduates";
import JoinUs from "@/sections/home/join-us/JoinUs";
import Registration from "@/sections/home/registration/Registration";
import RegistrationPage from "@/sections/home/registration/Registration";

/** Home Screen */
const HomeLayout: React.FC<unknown> = () => {
	// Define states
	const [showEnquiryPopup, setShowEnquiryPopup] = useState<boolean>(false);

	// Use Effects
	useEffect(() => {
		// Fade In Up animations
		ScrollOut({
			targets: ".fade-in-up",
			once: true,
		});

		ScrollOut({
			targets: ".childrenToChampionsWrapper",
			cssProps: {
				viewportY: true,
			},
		});
	}, []);

	return (
		<div className={styles.homeScreen}>
			{/* Banner Section */}
			<Banner
				bannerTitle="Where Little Feet Dream Big!"
				bannerDescription="At Skorost United Academy, we don’t just train players—we shape champions. With every kick, every sprint, and every lesson, young athletes grow stronger, smarter, and ready to take on the world."
				onButtonClick={() => setShowEnquiryPopup(true)}
			/>
			<RegistrationPage />
			{/* Founders Message Section */}
			<FoundersMessage />

			{/* Established Section */}
			<Established />

			{/* Courses Section */}
			<Courses onCardClick={() => setShowEnquiryPopup(true)} />

			{/* Children to champions Section */}
			<ChildrenToChampions />

			{/* Get free trial Section */}
			<GetFreeTrial onButtonClick={() => setShowEnquiryPopup(true)} />

			{/* Graduates Section */}
			<Graduates />

			{/* Coaches Section */}
			<Coaches />

			{/* Faq Section */}
			<Faq />

			{/* Join us Section */}
			<JoinUs onButtonClick={() => setShowEnquiryPopup(true)} />

			{/* Contact us Section */}
			<ContactUs onButtonClick={() => setShowEnquiryPopup(true)} />

			{/* Contact Us popup */}
			{showEnquiryPopup && (
				<div
					className={styles.overlay}
					onClick={() => setShowEnquiryPopup(false)}
				></div>
			)}

			{/* Contact Us modal */}
			<div
				className={`${styles.formModal} ${
					showEnquiryPopup ? styles.showPopup : ""
				}`}
			>
				<div onClick={() => setShowEnquiryPopup(false)}>
					<Icon iconName={"close"} className={styles.closeIcon} mode="filled" />
				</div>
				<h2 className={styles.formTitle}>Book A Trial Now</h2>
				<EnquiryForm />
			</div>

			<StickySocial onInfoClick={() => setShowEnquiryPopup(true)} />
		</div>
	);
};
export default HomeLayout;
