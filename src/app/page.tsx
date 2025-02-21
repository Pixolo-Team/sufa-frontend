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
	title: "Skorost United Academy, Ghatkopar East & West | Free Trial",
	description:
		"Skorost United Academy, Ghatkopar: Ages 5-16, expert licensed coaches, specialized goalkeeper training. Renowned football club. Book a free trial session!",
	keywords:
		"Football Academy, Goalkeeper Coaching, Football Coaching, Ghatkopar, Mumbai, Ghatkopar East, Ghatkopar West, Sport Coaching, Personal Training for Football, Kids Football Academy, Youth Football Coaching, Advanced Goalkeeper Training, Football Classes Mumbai, Sports Development for Kids, Football Training for Beginners, Football Programs for Children, Sports for Kids, Holistic Development, Youth Sports Coaching, Football Fitness, Football Camps Mumbai, Football Workshops Ghatkopar, After School Sports Activities, Learn Football Skills, Professional Football Coaching, Top Football Academy Mumbai, Football Coaching Near Me, Free Trial Session",
	openGraph: {
		title: "Skorost United Academy, Ghatkopar East & West | Free Trial",
		description:
			"Skorost United Academy, Ghatkopar: Ages 5-16, expert licensed coaches, specialized goalkeeper training. Renowned football club. Book a free trial session!",
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
