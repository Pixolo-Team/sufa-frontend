"use client";
// REACT //
import React from "react";

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
	return (
		<div>
			{/* Banner Section */}
			<Banner
				bannerTitle="Where Little Feet Dream Big!"
				bannerDescription="At Skorost United Academy, we don’t just train players—we shape champions.
					With every kick, every sprint, and every lesson, young athletes grow
					stronger, smarter, and ready to take on the world."
			/>

			{/* Founders Message Section */}
			<FoundersMessage />

			{/* Established Section */}
			<Established />
		</div>
		// <div>
		// 	{/* Banner Section */}
		// 	<Banner />

		// 	{/* Founders Message Section */}
		// 	<FoundersMessage />

		// 	{/* Established Section */}
		// 	<Established />

		// 	{/* Courses Section */}
		// 	<Courses />

		// 	{/* Children to champions Section */}
		// 	<ChildrenToChampions />

		// 	{/* Get free trial Section */}
		// 	<GetFreeTrial />

		// 	{/* Graduates Section */}
		// 	<Graduates />

		// 	{/* Coaches Section */}
		// 	<Coaches />

		// 	{/* Faq Section */}
		// 	<Faq />

		// 	{/* Join us Section */}
		// 	<JoinUs />

		// 	{/* Contact us Section */}
		// 	<ContactUs />
		// </div>
	);
};
export default HomeScreen;
