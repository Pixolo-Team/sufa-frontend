// OTHERS //
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { getMessaging, Messaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDBXo0PCskA2Nq5eGSHUG1PZgYlB_dgWJU",
	authDomain: "skorost-united-fa.firebaseapp.com",
	projectId: "skorost-united-fa",
	storageBucket: "skorost-united-fa.firebasestorage.app",
	messagingSenderId: "36505876847",
	appId: "1:36505876847:web:c7e15cdc2e7d2b8014909a",
	measurementId: "G-V8B8BSM6M3",
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
