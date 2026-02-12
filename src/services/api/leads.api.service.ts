// PLUGINS //
import axios, { AxiosRequestConfig } from "axios";

/** Create Lead API Call */
export const createLeadRequest = async (data: any) => {
	try {
		// Set up the API Call Config
		const config: AxiosRequestConfig = {
			method: "post",
			url: "/api/create-clickup-lead",
			headers: {
				"Content-Type": "application/json",
			},
			data,
		};

		// Make API Call
		const response = await axios.request(config);
		return response.data;
	} catch (error: any) {
		error.response.data.status = false;
		return error.response;
	}
};
