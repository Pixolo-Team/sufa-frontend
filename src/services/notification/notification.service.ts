// OTHERS //
import { getToken } from "firebase/messaging";
import { messaging } from "@/../firebase";

/** Check if messaging is available and request the notification token */
export const requestNotificationToken = async () => {
	try {
		// Check if messaging is available
		if (messaging) {
			// Get the token
			const token = await getToken(messaging, {
				vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
			});
			// TODO: Save the token to the server
			if (token) {
				console.log("FCM Token:", token);
			} else {
				console.warn("No registration token available.");
			}
		} else {
			console.warn("No messaging available.");
		}
	} catch (error) {
		console.error("An error occurred while retrieving the token.", error);
	}
};
