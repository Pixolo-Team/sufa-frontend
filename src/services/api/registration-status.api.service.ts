// MODULES //
import axios, { AxiosRequestConfig } from "axios";

// TYPES //
import { ApiResponseData } from "@/types/app";
import { TaskData } from "@/types/registration";

/** Registration status API Call */
export const getRegistrationStatusRequest = async (
	taskId: string
): Promise<ApiResponseData<TaskData>> => {
	// Set up the API Call Config
	const config: AxiosRequestConfig = {
		method: "GET",
		url: `http://10.6.40.105:3000/api/v1/clickup/task/${taskId}`,
		headers: {},
		data: { taskId },
	};

	// Make API Call
	const response = await axios.request<ApiResponseData<TaskData>>(config);
	return response.data;
};
