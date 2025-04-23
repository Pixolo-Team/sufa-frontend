"use client";
// REACT //
import React from "react";

// ENUMS //
import { Shapes, Variants, Colors } from "@/neevo/enums/core.enum";

// STYLES //
import styles from "./registration.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";
import IconButton from "@/neevo/components/icon-button/IconButton";

const journeyData = [
	{
		task: "Form Submitted",
		date: "12th May 2025",
		completed: true,
	},
	{
		task: "Photo Captured",
		date: "12th May 2025",
		completed: true,
		subtitle: "Photo is needed for the ID Card",
	},
	{
		task: "ID Printed",
		date: "12th May 2025",
		completed: true,
	},
	{
		task: "Kit Ordered",
		date: "12th May 2025",
		completed: false,
	},
	{
		task: "Box Prepared",
		date: "12th May 2025",
		completed: false,
	},
	{
		task: "Profile Generated",
		date: "12th May 2025",
		completed: false,
	},
];

/** Registration Screen */
const RegistrationPage = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions

	// View starts here
	return (
		<section className="section-spacing">
			<div className={styles.registrationWrapper}>
				<div className={styles.contentBox}>
					{/* Header */}
					<div className={styles.header}>
						<div className={styles.logoWrapper}>
							<Image
								src="/images/skorost.svg"
								alt="Skorost"
								width={120}
								height={40}
								priority
							/>
						</div>
						<h2 className={`${styles.subtitle} font-weight-500`}>
							BEGIN YOUR JOURNEY
						</h2>
					</div>

					<div className={styles.content}>
						{/* Profile Section */}
						<div className={styles.profileSection}>
							<div className={styles.imageWrapper}>
								<Image
									src="/images/harsh-profile.jpg"
									alt="Harsh Profile"
									fill
									style={{ objectFit: "cover" }}
									priority
								/>
							</div>
							<div className={styles.profileInfo}>
								<h3 className={`${styles.name} font-weight-600`}>Harsh Patil</h3>
								<p className={styles.details}>Age: 12 • Batch: U-11</p>
								<p className={styles.details}>Location: Ghatkopar East</p>
							</div>
						</div>

						{/* Status Box */}
						<div className={styles.statusBox}>
							<h4 className={`${styles.statusTitle} font-weight-600`}>TL;DR</h4>
							<p>
								Your Box is being prepared, it is expected to be delivered by 14th May
								2025
							</p>
						</div>

						{/* Journey List */}
						<div className={styles.journeyList}>
							{journeyData.map((item, index) => (
								<div key={index} className={styles.journeyItem}>
									<Icon
										iconName={item.completed ? "check" : "disc"}
										className={`${styles.icon} ${!item.completed ? styles.pending : ""}`}
										mode="filled"
									/>
									<div className={styles.itemContent}>
										<p className={`${styles.itemTitle} font-weight-500`}>{item.task}</p>
										<p className={styles.itemDate}>{item.date}</p>
										{item.subtitle && (
											<p className={styles.itemSubtitle}>{item.subtitle}</p>
										)}
									</div>
								</div>
							))}
						</div>

						{/* Contact Information */}
						<div className={styles.contactInfo}>
							<p className={styles.contactText}>
								Any Questions? Talk to your assigned coordinator
							</p>
							<p className={`${styles.contactNumber} font-weight-500`}>
								Harsh Patil: +91 9820840946
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default RegistrationPage;
