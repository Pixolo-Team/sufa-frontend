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
		server: {
			// Dev-only: same-origin proxy for API-Football v3. The API only
			// allows the `x-apisports-key` header, which triggers a browser
			// preflight on direct calls — proxying same-origin avoids CORS
			// entirely. Production uses the matching rewrite in vercel.json.
			proxy: {
				"/api/football": {
					target: "https://v3.football.api-sports.io",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/football/, ""),
				},
			},
		},
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
