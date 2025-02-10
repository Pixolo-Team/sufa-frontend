"use client";

// REACT //
import { Suspense, useEffect, useState } from "react";

// ENUMS //
import { Themes } from "@/neevo/enums/theme.enum";

// STYLES //
import "@/../public/styles/globals.scss";

// COMPONENTS //
import localFont from "next/font/local";
import Alert from "@/neevo/components/alert/Alert";

// CONTEXTS //
import { AuthProvider } from "@/contexts/Auth.context";
import { AppProvider } from "@/contexts/App.context";
import { ThemeProvider } from "next-themes";

// SERVICES //
import { requestNotificationToken } from "@/services/notification/notification.service";

// UTILS //
import { registerServiceWorker } from "@/utils/notifications.util";

// OTHERS //
import { onMessage } from "firebase/messaging";
import { messaging } from "@/../firebase";

// FONTS //
const kippaxModern = localFont({
	src: [
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Black.otf",
			weight: "900",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Extra-Bold.otf",
			weight: "800",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Bold.otf",
			weight: "700",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Medium.otf",
			weight: "500",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Regular.otf",
			weight: "400",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Thin.otf",
			weight: "100",
		},
	],
	variable: "--font-family-primary",
	display: "swap",
});

/** Root Layout Screen */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Define States
	const [notificationInfo, setNotificationInfo] = useState<{
		title: string;
		description: string;
	}>({ title: "", description: "" });
	const [showNotification, setShowNotification] = useState<boolean>(false);

	// Helper Functions

	// Use Effects and Focus Effects
	useEffect(() => {
		// Request notification permission
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				// Get the notification token
				requestNotificationToken();
			}
		});

		// Register service worker
		registerServiceWorker();

		// Handle incoming messages
		if (!messaging) return;
		onMessage(messaging, (payload) => {
			// Set the Notification Info State
			setNotificationInfo({
				title: payload?.notification?.title ?? "",
				description: payload?.notification?.body ?? "",
			});
			// Show the alert
			setShowNotification(true);
		});
	}, []);

	return (
		<AuthProvider>
			<html
				lang="en"
				id="html"
				className="vertical-side-menu"
				suppressHydrationWarning
			>
				<body className={`${kippaxModern.className}`}>
					<Suspense fallback={<div>Loading...</div>}>
						<AppProvider>
							<ThemeProvider
								enableSystem={true}
								defaultTheme={Themes.LIGHT}
								attribute="class"
								storageKey="theme"
							>
								<div className="main">{children}</div>
								{
									// Show the alert
									showNotification ? (
										<div className="notification-alert">
											<Alert
												title={notificationInfo.title}
												description={notificationInfo.description}
												onCloseClick={() => setShowNotification(false)}
											/>
										</div>
									) : null
								}
							</ThemeProvider>
						</AppProvider>
					</Suspense>
				</body>
			</html>
		</AuthProvider>
	);
}
