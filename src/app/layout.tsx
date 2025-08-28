// REACT //
import { Suspense } from "react";
import ReactLenis from "lenis/react";

// ENUMS //
import { Themes } from "@/neevo/enums/theme.enum";

// STYLES //
import "@/../public/styles/globals.scss";
import { ThemeProvider } from "next-themes";

// COMPONENTS //
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

// FONTS //
const kippaxModern = localFont({
	src: [
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Black.woff",
			weight: "900",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Extra-Bold.woff",
			weight: "800",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Bold.woff",
			weight: "700",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Medium.woff",
			weight: "500",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Regular.woff",
			weight: "400",
		},
		{
			path: "../../public/fonts/kippax-modern/Kippax-Modern-Thin.woff",
			weight: "100",
		},
	],
	variable: "--font-family-primary",
	display: "swap",
});

const secondaryFont = Montserrat({
	subsets: ["latin"],
	variable: "--font-family-secondary",
	display: "swap",
});

const juventus = localFont({
	src: "../../public/fonts/juventus-fans-bold.ttf",
	variable: "--font-family-tertiary",
	display: "swap",
});

/** Root Layout Screen */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Define Navigation

	// Define Context

	// Define States

	// Helper Functions

	// Use Effects and Focus Effects

	return (
		<html
			lang="en"
			id="html"
			className="vertical-side-menu"
			suppressHydrationWarning
		>
			<body
				className={`${kippaxModern.variable} ${secondaryFont.variable} ${juventus.variable}`}
			>
				{/* Google Analytics */}
				<GoogleAnalytics gaId="G-V7ETJVBHG2" />
				<Suspense fallback={<div>Loading...</div>}>
					<ThemeProvider
						enableSystem={true}
						defaultTheme={Themes.LIGHT}
						attribute="class"
						storageKey="theme"
					>
						{/* Header component */}
						<Header />

						{/* Main content */}
						<main className="main">
							<ReactLenis
								root
								options={{
									lerp: 0.5,
									smoothWheel: true,
									duration: 1.5,
								}}
							>
								{children}
							</ReactLenis>
						</main>

						{/* Footer component */}
						<Footer />
					</ThemeProvider>
				</Suspense>
			</body>
		</html>
	);
}
