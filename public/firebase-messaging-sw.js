importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
let messaging;
try {
	messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
	console.error("Failed to initialize Firebase Messaging", err);
}

// To display background notifications
if (messaging) {
	try {
		messaging.onBackgroundMessage((payload) => {
			console.log("Received background message: ", payload);
			const notificationTitle = payload.notification.title;
			const notificationOptions = {
				body: payload.notification.body,
				tag: notificationTitle, // tag is added to ovverride the notification with latest update
				icon: payload.notification?.image || "/favicon.ico",
			};

			self.registration.showNotification(notificationTitle, notificationOptions);
		});
	} catch (err) {
		console.log(err);
	}
}
