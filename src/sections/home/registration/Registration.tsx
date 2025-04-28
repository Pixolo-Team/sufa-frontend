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

const journeyData = [
	{
		task: "Form Submitted and Under Review",
		date: "12th May 2025, 10:30 AM",
		completed: true,
	},
	{
		task: "Photo Captured and Verified with Additional Documentation",
		date: "12th May 2025, 11:45 AM",
		completed: true,
	},
	{
		task: "ID Printed and Ready for Collection at Designated Center",
		date: "12th May 2025, 02:15 PM",
		completed: true,
	},
	{
		task: "Kit Ordered",
		date: "12th May 2025, 03:30 PM",
		completed: false,
	},
	{
		task: "Box Prepared",
		date: "12th May 2025, 04:45 PM",
		completed: false,
	},
	{
		task: "Profile Generated",
		date: "12th May 2025, 05:00 PM",
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
			<div className={`${styles.registrationWrapper} flex justify-center`}>
				<div className={styles.contentBox}>
					{/* Header */}
					<div className={`${styles.header} flex flex-column align-center`}>
						<div className={`${styles.logoWrapper} flex align-center justify-center`}>
							<Image
								src="/images/skorost.svg"
								alt="Skorost"
								width={120}
								height={40}
								className={styles.logo}
							/>
						</div>
						<h2 className={`${styles.subtitle} font-weight-500`}>
							Begin your journey
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
								<h3 className={`${styles.name} font-weight-700`}>Harsh Patil</h3>
								<div className={styles.details}>
									<p>
										Age: <span className="font-weight-700">12</span>
									</p>
									<p>
										Batch: <span className="font-weight-700">U-11</span>
									</p>
								</div>
								<p className={styles.details}>
									Location:
									<span className="font-weight-700">Ghatkopar East</span>
								</p>
							</div>
						</div>

						{/* Status Box */}
						<div className={styles.statusBox}>
							<h4 className={`${styles.statusTitle} font-weight-600`}>TL; DR</h4>
							<p className={`${styles.statusText} font-weight-500`}>
								Your Box is being prepared, it is expected to be delivered by 14th May
								2025
							</p>
						</div>

						{/* Journey List */}
						<div className={styles.journeyList}>
							{journeyData.map((item, index) => (
								<div key={index} className={styles.journeyItem}>
									<div
										className={`${
											item.completed ? styles.completedIcon : styles.pendingIcon
										} flex align-center justify-center`}
									>
										{item.completed && (
											<Icon iconName="tick" className={styles.tickIcon} mode="filled" />
										)}
									</div>
									<div className={styles.itemContent}>
										<p className={`${styles.itemTitle} font-weight-500`}>{item.task}</p>
										<p className={styles.itemDate}>{item.date}</p>
									</div>
								</div>
							))}
						</div>

						{/* Contact Information */}
						<div className={styles.contactInfo}>
							<p className={styles.contactText}>
								<span className="font-weight-700">Any Questions ?</span> Talk to your
								assigned coordinator
							</p>
							<p className={styles.contactNumber}>
								<span className="font-weight-700">Harsh Patil: </span>
								+91 9820840946
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default RegistrationPage;
