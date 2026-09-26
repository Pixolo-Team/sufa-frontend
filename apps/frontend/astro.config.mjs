// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://academy.skorostunited.com",
	// Every page is prerendered except the dynamic registration tracker,
	// which opts out with `export const prerender = false`
	adapter: vercel(),
	// The dev toolbar's audit app re-fetches every local <img> on each DOM
	// mutation to measure its size. The autoplaying Splide carousels mutate the
	// DOM constantly, so it hammered the network with thousands of image
	// requests in dev. The toolbar never ships to production; disabling it just
	// removes that dev-only noise.
	devToolbar: { enabled: false },
	integrations: [
		// React is only used for the interactive Enquiry Form island
		react({ include: ["**/*.tsx"] }),
	],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					// Silence the deprecation warnings coming from the legacy `@import` syntax
					silenceDeprecations: ["import", "legacy-js-api"],
				},
			},
		},
	},
});
