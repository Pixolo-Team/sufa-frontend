// PLUGINS //
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

/** Create Lead API Call */
export const createLeadRequest = async (data: any) => {
	const privyrApiKey = import.meta.env.PUBLIC_PRIVYR_API_KEY?.trim();

	if (!privyrApiKey) {
		console.error("Missing PUBLIC_PRIVYR_API_KEY for Privyr lead submission.");
		return {
			success: false,
			message: "Lead form is not configured yet. Please try again later.",
		};
	}

	try {
		// Set up the API Call Config
		const config: AxiosRequestConfig = {
			method: "post",
			url: `https://www.privyr.com/api/v1/incoming-leads/${privyrApiKey}`,
			headers: {
				"Content-Type": "application/json",
			},
			data,
		};

		// Make API Call
		const response = await axios.request(config);
		return response.data;
	} catch (error: any) {
		return {
			success: false,
			message:
				error.response?.data?.message ?? "Failed to create lead. Please try again later.",
		};
	}
};
