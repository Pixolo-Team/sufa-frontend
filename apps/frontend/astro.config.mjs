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
