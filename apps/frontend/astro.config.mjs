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
			// Dev-only: same-origin proxy for football-data.org. Their API
			// only whitelists `http://localhost` for CORS, so direct browser
			// calls from localhost:PORT get blocked. Production uses the
			// matching rewrite in vercel.json.
			proxy: {
				"/api/football-data": {
					target: "https://api.football-data.org",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/football-data/, ""),
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
