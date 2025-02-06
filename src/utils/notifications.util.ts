/** Register the service worker */
export const registerServiceWorker = () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/firebase-messaging-sw.js")
			.then((registration) => {
				console.log("Service Worker registered with scope:", registration.scope);
			})
			.catch((err) => console.error("Service Worker registration failed:", err));
	}
};
