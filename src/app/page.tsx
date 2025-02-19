"use client";
// REACT //
import React, { useState, useEffect } from "react";

// ENUMS //
import { Sizes } from "@/neevo/enums/core.enum";

// STYLES //
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./page.module.scss";

// COMPONENTS //
import Image from "next/image";
import Popup from "@/neevo/components/popup/Popup";
import EnquiryForm from "@/components/enquiry-form/EnquiryForm";

// OTHERS //
import ScrollOut from "scroll-out";

// IMAGES //
import WhatsappImage from "@/../public/images/whatsapp-64.png";

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

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	// Define states
	const [showEnquiryPopup, setShowEnquiryPopup] = useState<boolean>(false);

	// Use Effects
	useEffect(() => {
		// Fade In Up animations
		ScrollOut({
			targets: ".fade-in-up",
			once: true,
		});
	}, []);

	return (
		<div className={styles.homeScreen}>
			{/* Banner Section */}
			<Banner
				bannerTitle="Where Little Feet Dream Big!"
				bannerDescription="At Skorost United Academy, we don’t just train players—we shape champions.
					With every kick, every sprint, and every lesson, young athletes grow
					stronger, smarter, and ready to take on the world."
				onButtonClick={() => setShowEnquiryPopup(true)}
			/>

			{/* Founders Message Section */}
			<FoundersMessage />

			{/* Established Section */}
			<Established />

			{/* Courses Section */}
			<Courses />

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

			{/* Floating section */}
			<div
				className={`${styles.floatingSection} flex justify-center align-center`}
			>
				<a
					href="https://wa.me/919004453226?text=Hi! I would like to know more about your academy."
					target="_blank"
					rel="noreferrer"
				>
					<Image
						src={WhatsappImage}
						alt="whatsapp"
						className="img-responsive full-width-img"
					/>
				</a>
			</div>

			{/* Contact Us popup */}
			{showEnquiryPopup && (
				<Popup
					onCloseClick={() => {
						setShowEnquiryPopup(false);
					}}
					onOverlayClick={() => {
						setShowEnquiryPopup(false);
					}}
					size={Sizes.SMALL}
				>
					<EnquiryForm />
				</Popup>
			)}
		</div>
	);
};
export default HomeScreen;
