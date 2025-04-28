"use client";
// REACT //
import React from "react";

// TYPES //
import { ApiResponse, TaskResponse } from "@/types/registration";

// STYLES //
import styles from "./registration.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";

const journeyData = {
	parentTask: {
		id: "86cyauhb6",
		name: "Yug",
		status: "aiff registration",
		description:
			"Yug is a 12 year old boy who is a great player and a great person",
		creator: {
			id: 49390702,
			username: "Jyoti Pandey",
			email: "jyoti.pixolo@gmail.com",
		},
		date_created: "1742379504061",
		date_closed: null,
		date_updated: "1744020502159",
		subtasks: [
			{
				id: "86cyauhbc",
				name: "Add the Parent in Skorost Whatsapp Community",
				status: "complete",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379504484",
				date_closed: null,
				date_updated: "1742379504484",
			},
			{
				id: "86cyauhbb",
				name: "Send the Parent Welcome message",
				status: "complete",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379504480",
				date_closed: null,
				date_updated: "1742884936842",
			},
			{
				id: "86cyauhbw",
				name: "Send the Registration Form to the Player/Parent",
				status: "complete",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379505382",
				date_closed: null,
				date_updated: "1742884936842",
			},
			{
				id: "86cyauhd5",
				name: "Player Photo Shoot",
				status: "complete",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379508991",
				date_closed: null,
				date_updated: "1742884933729",
			},
			{
				id: "86cyauhdp",
				name: "Create player in AIFF CRS portal",
				status: "enrolled",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379510231",
				date_closed: null,
				date_updated: "1742379510231",
			},
			{
				id: "86cyauhdm",
				name: "Generate Player Graphic with FIFA ID and AIFF ID",
				status: "enrolled",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379510234",
				date_closed: null,
				date_updated: "1742379510234",
			},
			{
				id: "86cyauhe1",
				name: "Send the Registration Graphic to the Parent with a Message",
				status: "enrolled",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379511418",
				date_closed: null,
				date_updated: "1742379511418",
			},
			{
				id: "86cyauhe2",
				name: "Add AIFF ID and FIFA ID to Database",
				status: "enrolled",
				creator: {
					id: 49390702,
					username: "Jyoti Pandey",
					email: "jyoti.pixolo@gmail.com",
				},
				date_created: "1742379511516",
				date_closed: null,
				date_updated: "1742379511516",
			},
		],
	},
};

/** Registration Screen */
const RegistrationPage = () => {
	// Navigation and Route Params

	// Define States

	// Define Refs

	// Helper Functions
	const formatDate = (timestamp: string) => {
		const date = new Date(parseInt(timestamp));
		return date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

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
								<h3 className={`${styles.name} font-weight-700`}>
									{journeyData.parentTask.name}
								</h3>
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
							<h4 className={`${styles.statusTitle} font-weight-600`}>Description</h4>
							<p className={`${styles.statusText} font-weight-500`}>
								{journeyData.parentTask.description}
							</p>
						</div>

						{/* Journey List */}
						<div className={styles.journeyList}>
							{journeyData.parentTask.subtasks.map((subtask) => (
								<div key={subtask.id} className={styles.journeyItem}>
									<div
										className={`${
											subtask.status === "complete"
												? styles.completedIcon
												: styles.pendingIcon
										} flex align-center justify-center`}
									>
										{subtask.status === "complete" && (
											<Icon iconName="tick" className={styles.tickIcon} mode="filled" />
										)}
									</div>
									<div className={styles.itemContent}>
										<p className={`${styles.itemTitle} font-weight-500`}>
											{subtask.name}
										</p>
										<p className={styles.itemDate}>{formatDate(subtask.date_updated)}</p>
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
