"use client";
// REACT //
import React from "react";

// STYLES //
import styles from "@/app/page.module.scss";

// SECTIONS //
import FoundersMessage from "@/sections/home/founders-message/FoundersMessage";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className="flex justify-center align-center">
			<FoundersMessage />
		</div>
	);
};
export default HomeScreen;
