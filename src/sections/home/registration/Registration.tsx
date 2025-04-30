"use client";
// REACT //
import React, { useCallback, useEffect, useState } from "react";

// TYPES //
import { TaskData } from "@/types/registration";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";

// STYLES //
import styles from "./registration.module.scss";

// COMPONENTS //
import Image from "next/image";
import Icon from "@/neevo/components/Icon";

// API SERVICES //
import { getRegistrationStatusRequest } from "@/services/api/registration-status.api.service";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// UTILS //
import { formatDate } from "@/utils/date.util";

const taskId = "86cyaukrf";

/** Registration Page */
const RegistrationPage = () => {
	// Navigation and Route Params

	// Define States
	const [registrationSteps, setRegistrationSteps] = useState<TaskData>();

	// Define Refs
	

	// Helper Functions
	const getRegistrationStatus = useCallback(() => {
		// Make API Call
		getRegistrationStatusRequest(taskId)
			.then((response) => {
				if (response.status_code === 200) {
					// Set the response data to the state
					setRegistrationSteps(response.data);
				} else {
					showToast(response.message, ToastTypes.WARNING);
				}
			})
			.catch(() => {
				// Set the error message in the toast
				showToast("Failed to get Status", ToastTypes.ERROR);
			});
	}, [taskId]);

	// UseEffect Functions and UseFocusEffect Functions
	useEffect(() => {
		// Get Registration Status
		getRegistrationStatus();
	}, [getRegistrationStatus]);

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
									src={registrationSteps?.description.student_image}
									alt={"Student Image"}
									fill
									style={{ objectFit: "cover" }}
									priority
								/>
							</div>
							<div className={styles.profileInfo}>
								<h3 className={`${styles.name} font-weight-700`}>
									{registrationSteps?.name}
								</h3>
								<div className={styles.details}>
									<p>
										Age: <span className="font-weight-700">{registrationSteps?.description.age}</span>
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
								{registrationSteps?.description.comments}
							</p>
						</div>

						{/* Journey List */}
						<div className={styles.journeyList}>
							{registrationSteps?.subtasks && registrationSteps?.subtasks.map((subtask) => (
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
										{subtask.status === "complete" ? (
											<p className={styles.itemDate}>{formatDate(subtask.date_updated)}</p>
										) : (
											<p className={styles.itemDate} />
										)}
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
								<span className="font-weight-700">{registrationSteps?.creator.username}: </span>
								{registrationSteps?.creator.email}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default RegistrationPage;
