// MODULES //
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/app";
import type { TaskData } from "@/types/registration";

// CONSTANTS //
import { CONSTANTS } from "@/infrastructure/constants";

/** Registration status API Call */
export const getRegistrationStatusRequest = async (
	taskId: string
): Promise<ApiResponseData<TaskData>> => {
	// Set up the API Call Config
	const config: AxiosRequestConfig = {
		method: "GET",
		url: `${CONSTANTS.API_URL}/registrations/track-registration/${taskId}`,
		headers: {},
		data: { taskId },
	};

	// Make API Call
	const response = await axios.request<ApiResponseData<TaskData>>(config);
	return response.data;
};
