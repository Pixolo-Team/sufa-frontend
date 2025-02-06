// OTHERS //
import { logEvent, analytics } from "@/../firebase";

/** Log a custom Firebase event */
export const logCustomFirebaseEvent = (
	eventName: string,
	eventParams?: Record<string, any>
) => {
	// Explicit check for window object to avoid SSR errors
	if (analytics) {
		logEvent(analytics, eventName, eventParams);
	}
};
