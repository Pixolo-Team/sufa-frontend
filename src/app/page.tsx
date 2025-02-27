// REACT //
import React from "react";

// STYLES //
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// OTHERS //
import HomeLayout from "@/layouts/HomeLayout";

// DATA //
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
	title: "Skorost United Football Academy, Ghatkopar East & West | Free Trial",
	description:
		"Looking for the Best Football Academy in Ghatkopar East, West, or Mumbai? Our top-rated football coaching offers advanced goalkeeper training, youth programs in Powai and Vikhroli, and personal training for kids and beginners. Join our Football Fitness Programs, After School Classes, and Football Camps in Mumbai. Enjoy a Free Trial Session and kickstart your football journey with professional coaching and holistic sports development for children!",
	keywords:
		"Best Football Academy in Ghatkopar East,Best Football Academy in Ghatkopar West,Best Football Academy in Mumbai,Top 10 Football Academies in Ghatkopar,Top 10 Football Academies in Mumbai,Kids Football Academy in Ghatkopar,Kids Football Academy in Powai,Football Coaching for Kids in Vikhroli,Football Training Near Ghatkopar East,Football Training Near Ghatkopar West,Professional Football Coaching in Mumbai,Football Coaching for Beginners in Ghatkopar,Youth Football Coaching in Powai,Advanced Goalkeeper Training in Mumbai,Best Sports Coaching for Kids in Ghatkopar,Football Fitness Programs in Mumbai,After School Football Classes in Ghatkopar,Football Camps in Mumbai for Kids,Sports Development for Children,Football Workshops Near Me,Personal Football Training in Ghatkopar,Learn Football Skills in Mumbai,Free Football Trial Session in Ghatkopar",
	openGraph: {
		title: "Skorost United Academy, Ghatkopar East & West | Free Trial",
		description:
			"Looking for the Best Football Academy in Ghatkopar East, West, or Mumbai? Our top-rated football coaching offers advanced goalkeeper training, youth programs in Powai and Vikhroli, and personal training for kids and beginners. Join our Football Fitness Programs, After School Classes, and Football Camps in Mumbai. Enjoy a Free Trial Session and kickstart your football journey with professional coaching and holistic sports development for children!",
		url: "https://academy.skorostunited.com",
		images: [
			{
				url: "/images/og-image.jpg",
				alt: "Skorost United Football Academy",
			},
		],
	},
	alternates: {
		canonical: "https://academy.skorostunited.com",
	},
	other: {
		"google-site-verification": "_oSbhp3h8iKU34WhrZC8kmkzDaHpqNhZnX93WHIAeHA",
	},
};

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	// Define Navigation

	// Define Context

	// Define States

	// Define Refs

	// Helper Functions

	// Use Effects

	return <HomeLayout />;
};
export default HomeScreen;
