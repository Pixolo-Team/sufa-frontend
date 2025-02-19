// REACT //
import { Suspense } from "react";

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

// CONTEXTS //
import { AppProvider } from "@/contexts/App.context";

// DATA //
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
	title: "Skorost United Football Academy",
	description: "Where Little Feet Dream Big!",
	keywords: "skorost, united, academy",
	openGraph: {
		title: "Skorost United Football Academy",
		description: "Where Little Feet Dream Big!",
		url: "https://skorostunited.com",
		images: [
			{
				url: "https://skorostunited.com/images/og-image.jpg",
				alt: "Skorost United Football Academy",
			},
		],
	},
};

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

const secondaryFont = Montserrat({
	subsets: ["latin"],
	variable: "--font-family-secondary",
	display: "swap",
});

/** Root Layout Screen */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
			<body className={`${kippaxModern.variable} ${secondaryFont.variable}`}>
				<Suspense fallback={<div>Loading...</div>}>
					<AppProvider>
						<ThemeProvider
							enableSystem={true}
							defaultTheme={Themes.LIGHT}
							attribute="class"
							storageKey="theme"
						>
							{/* Header component */}
							<Header />

							{/* Main content */}
							<main className="main">{children}</main>

							{/* Footer component */}
							<Footer />
						</ThemeProvider>
					</AppProvider>
				</Suspense>
			</body>
		</html>
	);
}
