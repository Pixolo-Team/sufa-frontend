"use client";
// REACT //
import React from "react";

// ENUMS //
import { Colors, Variants } from "@/neevo/enums/core.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";

// STYLES //
import styles from "@/app/page.module.scss";

// COMPONENTS //
import Image from "next/image";
import Button from "@/neevo/components/button/Button";

// IMAGES //
import Pixolo from "@/../public/images/pixolo.png";
import BrandLogo from "@/../public/images/brand/brand-logo.png";

// SECTIONS //
import Banner from "@/sections/home/banner/Banner";

/** Home Screen */
const HomeScreen: React.FC<unknown> = () => {
	return (
		<div className="flex justify-center align-center">
			<Banner />
		</div>
	);
};
export default HomeScreen;
