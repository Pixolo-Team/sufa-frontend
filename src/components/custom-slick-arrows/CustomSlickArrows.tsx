"use client";
// REACT //
import React from "react";
import Slider from "react-slick";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface CustomSlickArrowsProps {
	sliderRef: React.RefObject<Slider>;
}
/** Custom Slick arrows component */
const CustomSlickArrows: React.FC<CustomSlickArrowsProps> = ({ sliderRef }) => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions
	/** Function to go on next slide */
	const goToNextSlide = () => {
		sliderRef.current?.slickNext();
	};
	/** Function to go on previous slide */
	const goToPreviousSlide = () => {
		sliderRef.current?.slickPrev();
	};

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<div className="custom-slick-arrow-wrapper flex justify-center">
			<button
				className={
					"custom-slick-arrow custom-slick-arrow-left flex align-center justify-center"
				}
				onClick={goToPreviousSlide}
			>
				{/* Left arrow */}
				<Icon className={"arrow-icon"} iconName={"link-arrow"} mode="filled" />
			</button>
			<button
				className={
					"custom-slick-arrow custom-slick-arrow-right flex align-center justify-center"
				}
				onClick={goToNextSlide}
			>
				{/* Right arrow */}
				<Icon className={"arrow-icon"} iconName={"link-arrow"} mode="filled" />
			</button>
		</div>
	);
};

export default CustomSlickArrows;
