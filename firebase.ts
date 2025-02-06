// OTHERS //
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { getMessaging, Messaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics only on client-side
let analytics: Analytics | undefined;
let messaging: Messaging | undefined;

// Check if window object is available
if (typeof window !== "undefined") {
	// Initialize Firebase Analytics and Messaging
	messaging = getMessaging(app);
	analytics = getAnalytics(app);
}
export { messaging, analytics, logEvent };
