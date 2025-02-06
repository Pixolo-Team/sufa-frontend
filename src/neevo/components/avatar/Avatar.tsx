"use client";
// REACT //
import React, { useMemo, useState } from "react";

// ENUMS //
import { Colors, Shapes, Variants } from "@/neevo/enums/core.enum";
import {
	AvatarStatus,
	AvatarSizes,
	AvatarFallbacks,
} from "@/neevo/enums/avatar.enum";

// STYLES //
import styles from "./avatar.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";

// UTILS //
import { capitalizeHyphenated } from "@/neevo/utils/string-parser.util";

// IMAGES //
import blurredImage from "@/../public/images/blurred-image.jpg";

interface AvatarProps {
	variant?: Variants;
	size?: AvatarSizes;
	color?: Colors;
	shape?: Shapes;
	status?: AvatarStatus;
	src?: string;
	name?: string;
	fallbackIcon?: string;
	fallback?: AvatarFallbacks;
}

/** Neevo Avatar Component */
const Avatar: React.FC<AvatarProps> = ({
	variant = Variants.SOLID,
	size = AvatarSizes.REGULAR,
	color = Colors.PRIMARY,
	shape = Shapes.DEFAULT,
	status = AvatarStatus.NONE,
	src = "",
	name = "",
	fallbackIcon = "user-circle",
	fallback = AvatarFallbacks.ICON,
}) => {
	// Define States
	const [didImageLoad, setDidImageLoad] = useState<boolean>(true);

	// Define Refs

	// Helper Functions
	/** Handle Image Load Error */
	const handleImageLoadError = () => {
		setDidImageLoad(false);
	};

	/** Combine the base class from styles.neevoAvatar with dynamically generated class names based on props. */
	const avatarClassName = useMemo(() => {
		// Create array for Classes
		const classes = [];

		// Push the base class in it
		classes.push(styles.neevoAvatar);

		// Class for Color and Variant
		if (variant && color) {
			classes.push(
				styles[`${capitalizeHyphenated(color)}${capitalizeHyphenated(variant)}`]
			);
		}

		// Class for Size, Shape, Variant and Status
		if (size && shape && variant && status) {
			classes.push(
				styles[
					`${capitalizeHyphenated(size)}${capitalizeHyphenated(
						shape
					)}${capitalizeHyphenated(variant)}${capitalizeHyphenated(status)}`
				]
			);
		}

		// Class for Status only
		if (status) {
			classes.push(styles[`${capitalizeHyphenated(status)}`]);
		}

		return classes.join(" ");
	}, [variant, color, size, shape, status]);

	/** Render Avatar Content */
	const renderAvatarContent = () => {
		// Check if the image has loaded and a source is provided
		if (didImageLoad && src) {
			// If image loaded and src exists, display the image
			return (
				<Image
					className={styles.avatarImage}
					src={src}
					alt={name || "User Avatar"}
					onError={handleImageLoadError}
					placeholder="blur"
					width={72}
					height={72}
					blurDataURL={blurredImage.src}
				/>
			);
		}

		// Handle different fallback options based on the fallback type
		switch (fallback) {
			case AvatarFallbacks.INITIALS:
				// If fallback is to display initials, check if the name exists
				return name ? (
					<div className={styles.avatarInitial}>{name.charAt(0)}</div>
				) : (
					<Icon className={styles.avatarIcon} iconName={fallbackIcon} />
				);
			case AvatarFallbacks.ICON:
				// If fallback is to display an icon, render the icon
				return (
					<Icon
						className={styles.avatarIcon}
						iconName={fallbackIcon}
						mode="outline"
					/>
				);
			default:
				// Default case when fallback type is not specified or recognized
				return name ? (
					<div className={styles.avatarInitial}>{name.charAt(0)}</div>
				) : (
					<Icon
						className={styles.avatarIcon}
						iconName={fallbackIcon}
						mode="filled"
					/>
				);
		}
	};

	return (
		<div className={`${avatarClassName}`}>
			<div className={styles.avatarWrap}>{renderAvatarContent()}</div>
			{/* Show Status icon if the status is NOT None */}
			{status !== AvatarStatus.NONE && (
				<div className={styles.avatarStatus}>
					{status === AvatarStatus.VERIFIED && (
						<Icon
							className={styles.avatarStatusIcon}
							iconName="verified"
							mode="filled"
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default Avatar;
