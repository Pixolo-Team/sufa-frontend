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
	title: "Skorost United Football Academy",
	description: "Where Little Feet Dream Big!",
	keywords: "skorost, united, academy",
	openGraph: {
		title: "Skorost United Football Academy",
		description: "Where Little Feet Dream Big!",
		url: "https://academy.skorostunited.com",
		images: [
			{
				url: "/images/og-image.jpg",
				alt: "Skorost United Football Academy",
			},
		],
	},
};

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	// Define Navigation
	
	// Define states

	// Define Refs

	// Helper Functions

	// Use Effects

	return <HomeLayout />;
};
export default HomeScreen;
