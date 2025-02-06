// MODULES //
import axios, { AxiosRequestConfig } from "axios";

// TYPES //
import { AuthenticatedUserData } from "@/types/user";
import { ApiResponseData } from "@/types/app";

// CONSTANTS //
import { CONSTANTS } from "@/infrastructure/constants";

/** Signup User API Call */
export const signupRequest = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string
): Promise<ApiResponseData<AuthenticatedUserData | boolean>> => {
	try {
		// Set up the API Call Config
		const config: AxiosRequestConfig = {
			method: "post",
			// TODO: Change this URL
			url: `${CONSTANTS.API_URL}&file_name=signup`,
			headers: {},
			data: { email, password, firstName, lastName },
		};

		// Make API Call
		const response = await axios.request<
			ApiResponseData<AuthenticatedUserData | boolean>
		>(config);
		return response.data;
	} catch (error: any) {
		error.response.data.status = false;
		return error.response;
	}
};

/** Login User API Call */
export const loginRequest = async (
	email: string,
	password: string
): Promise<ApiResponseData<AuthenticatedUserData | boolean>> => {
	try {
		// Set up the API Call Config
		const config: AxiosRequestConfig = {
			method: "post",
			// TODO: Change this URL
			url: `${CONSTANTS.API_URL}&file_name=login`,
			headers: {},
			data: { email, password },
		};

		// Make API Call
		const response = await axios.request<
			ApiResponseData<AuthenticatedUserData | boolean>
		>(config);
		return response.data;
	} catch (error: any) {
		error.response.data.status = false;
		return error.response;
	}
};

/** Logout User API Call */
export const logoutRequest = async (): Promise<ApiResponseData<boolean>> => {
	// Set up the API Call Config
	const config: AxiosRequestConfig = {
		method: "post",
		url: `${CONSTANTS.API_URL}&file_name=logout`,
		headers: {},
	};

	// Make API Call
	const response = await axios.request<ApiResponseData<boolean>>(config);
	return response.data;
};

/** Check validity of Token */
export const verifyTokenRequest = async (
	token: string
): Promise<ApiResponseData<AuthenticatedUserData>> => {
	// Set up the API Call Config
	const config: AxiosRequestConfig = {
		method: "post",
		// TODO: Change this URL
		url: `${CONSTANTS.API_URL}&file_name=verify-token`,
		headers: {
			Authorization: `${token}`,
		},
	};

	// Make API Call
	const response = await axios.request<ApiResponseData<AuthenticatedUserData>>(
		config
	);
	return response.data;
};

/** Forgot Password API Call */
export const resetPasswordRequest = async (
	email: string
): Promise<ApiResponseData<boolean>> => {
	// Set up the API Call Config
	const config: AxiosRequestConfig = {
		method: "post",
		url: `${CONSTANTS.API_URL}&file_name=forgot-password`,
		headers: {},
		data: { email },
	};

	// Make API Call
	const response = await axios.request<ApiResponseData<boolean>>(config);
	return response.data;
};

/** Change password API call */
export const changePasswordRequest = async (
	confirmPassword: string,
	password: string
): Promise<ApiResponseData<boolean>> => {
	// Set up API Request
	const config: AxiosRequestConfig = {
		method: "post",
		// TODO - Replace with original url
		url: `${CONSTANTS.API_URL}&file_name=change-password`,
		data: {
			confirm_password: confirmPassword,
			password: password,
		},
	};

	// Make API Call
	const response = await axios.request(config);
	return response.data;
};
