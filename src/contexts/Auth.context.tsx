"use client";
// REACT //
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
} from "react";
import { useRouter } from "next/navigation";

// MODULES //
import { Paths } from "@/enums/paths.enum";

// TYPES //
import { ApiResponseData } from "@/types/app";
import { AuthenticatedUserData } from "@/types/user";

// ENUMS //
import { LocalStorageKeys } from "@/enums/app.enum";
import { ToastTypes } from "@/neevo/enums/toast.enum";
import { CustomFirebaseEvents } from "@/enums/analytics.enum";

// API SERVICES //
import {
	verifyTokenRequest,
	loginRequest,
	signupRequest,
	resetPasswordRequest,
	logoutRequest,
} from "@/services/api/account.api.service";

// SERVICES //
import {
	clearLocalStorage,
	getLocalStorageItem,
	setLocalStorageItem,
} from "@/services/local-storage.service";
import { showToast } from "@/neevo/services/toast.service";
import { logCustomFirebaseEvent } from "@/services/analytics.service";

// Define the shape of the AuthContext
type AuthContextType = {
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	loggedInUser: AuthenticatedUserData | null;
	login: (email: string, password: string) => void;
	logout: () => void;
	signUp: (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) => void;
	resetPassword: (email: string) => void;
};

// Create an AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

/** Custom hook to use the AuthContext */
export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};

type AuthProviderProps = {
	children: React.ReactNode;
};

/** AuthProvider Component */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// Define Navigation
	const router = useRouter();

	// Define States
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
	const [loggedInUser, setLoggedInUser] = useState<AuthenticatedUserData | null>(
		null
	);

	/** Function to store the User Information */
	const setUserState = (user: AuthenticatedUserData | null) => {
		// Set the User in Context
		setLoggedInUser(user);
		// If User Exists
		if (user) {
			// Set User in Local Storage
			setLocalStorageItem(LocalStorageKeys.LOGGED_IN_USER, user);
			// Set Authentication State
			setIsAuthenticated(true);
		} else {
			// Clear all data from Local Storage
			clearLocalStorage();
			// Set Authentication State
			setIsAuthenticated(false);
		}
	};

	/** Login function */
	const login = async (email: string, password: string) => {
		// Show Loader
		setIsAuthLoading(true);
		// Log Firebase Event
		logCustomFirebaseEvent(CustomFirebaseEvents.USER_LOGIN_ATTEMPT, {
			email: email,
		});
		// Make API Call to Login the User
		loginRequest(email, password)
			.then((response: ApiResponseData<boolean | AuthenticatedUserData>) => {
				// Check the Status Code of the API Call
				if (response.status_code === 200) {
					// Set the User State
					setUserState(response.data as AuthenticatedUserData);
					// LOG firebase event
					logCustomFirebaseEvent(CustomFirebaseEvents.USER_LOGIN_SUCCESS, {
						email: email,
					});
					// Navigate the User to Home Page
					router.push(Paths.HOME);
				} else {
					// LOG firebase event
					logCustomFirebaseEvent(CustomFirebaseEvents.USER_LOGIN_FAILURE, {
						email: email,
					});
					// Display error message in toast
					showToast(response.message, ToastTypes.WARNING);
				}
			})
			.catch(() => {
				// LOG firebase event
				logCustomFirebaseEvent(CustomFirebaseEvents.USER_LOGIN_FAILURE, {
					email: email,
				});
				// Display error message in toast
				showToast("Something went wrong", ToastTypes.ERROR);
			})
			.finally(() => {
				// Hide Loader
				setIsAuthLoading(false);
			});
	};

	/** Logout function */
	const logout = async () => {
		setIsAuthLoading(true);
		// Make API Call to Logout the User
		logoutRequest()
			.then((response: ApiResponseData<boolean>) => {
				if (response.status_code === 200) {
					// Clear the User Context
					setUserState(null);
					// Log Firebase Event
					logCustomFirebaseEvent(CustomFirebaseEvents.USER_LOGOUT);
					// Navigate to Login Page
					router.push(Paths.LOGIN);
					// Display success message in toast
					showToast(response.message, ToastTypes.SUCCESS);
				} else {
					// Display error message in toast
					showToast(response.message, ToastTypes.WARNING);
				}
			})
			.catch(() => {
				// Display error message in toast
				showToast("Something went wrong", ToastTypes.ERROR);
			})
			.finally(() => {
				// Hide Loader
				setIsAuthLoading(false);
			});
	};

	/** Sign Up function */
	const signUp = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) => {
		// Show Loader
		setIsAuthLoading(true);
		// Log Firebase Event
		logCustomFirebaseEvent(CustomFirebaseEvents.USER_SIGN_UP_ATTEMPT, {
			email: email,
			firstName: firstName,
			lastName: lastName,
		});
		// Make API Call to Login the USer
		signupRequest(email, password, firstName, lastName)
			.then((response: ApiResponseData<AuthenticatedUserData | boolean>) => {
				// Check the Status Code of the API Call
				if (response.status_code === 200) {
					// Set the User State
					setUserState(response.data as AuthenticatedUserData);
					// LOG firebase event
					logCustomFirebaseEvent(CustomFirebaseEvents.USER_SIGN_UP_SUCCESS, {
						email: email,
						firstName: firstName,
						lastName: lastName,
					});
					// Navigate the User
					router.push(Paths.HOME);
				} else {
					// LOG firebase event
					logCustomFirebaseEvent(CustomFirebaseEvents.USER_SIGN_UP_FAILURE, {
						email: email,
						firstName: firstName,
						lastName: lastName,
					});
					// Display error message in toast
					showToast(response.message, ToastTypes.WARNING);
				}
			})
			.catch(() => {
				// Display error message in toast
				showToast("Something went wrong", ToastTypes.ERROR);
			})
			.finally(() => {
				// Hide Loader
				setIsAuthLoading(false);
			});
	};

	/** This Function checks if the User is Logged In by passing the Token to the API */
	const verifyToken = async () => {
		// Start Auth Loading
		setIsAuthLoading(true);
		// Get User from Local Storage
		const user = getLocalStorageItem(LocalStorageKeys.LOGGED_IN_USER);
		// Check if the User exists in the Local Storage already
		if (user) {
			// Make API Call to Verify the Token
			verifyTokenRequest(user.token)
				.then((response: ApiResponseData<AuthenticatedUserData>) => {
					// If the token is valid then Set the User
					if (response.status_code === 200) {
						setUserState(response.data);
					} else {
						// If the token is not valid then Remove the user
						logout();
					}
				})
				.catch(() => {
					// Show session expired message in toast
					showToast("Session Expired", ToastTypes.ERROR);
				})
				.finally(() => {
					// Hide Loader
					setIsAuthLoading(false);
				});
		} else {
			logout();
		}
	};

	/** Function to send Password Reset Email */
	const resetPassword = async (email: string) => {
		// Show Loader
		setIsAuthLoading(true);
		// Make API Call to Login the USer
		resetPasswordRequest(email)
			.then((response: ApiResponseData<boolean>) => {
				// Check the Status Code of the API Call
				if (response.status_code === 200) {
					// LOG firebase event
					logCustomFirebaseEvent(CustomFirebaseEvents.FORGOT_PASSWORD, {
						email: email,
					});
					// Display success message in toast
					showToast(response.message, ToastTypes.SUCCESS);
				} else {
					// Display error message in toast
					showToast(response.message, ToastTypes.WARNING);
				}
			})
			.catch(() => {
				// Display error message in toast
				showToast("Something went wrong", ToastTypes.ERROR);
			})
			.finally(() => {
				// Hide Loader
				setIsAuthLoading(false);
			});
	};

	useEffect(() => {
		// Check if the User is Logged In
		verifyToken();
	}, []);

	/** Memoizes the authentication context value to optimize re-renders. */
	const value = useMemo(
		() => ({
			isAuthenticated,
			isAuthLoading,
			loggedInUser,
			login,
			logout,
			signUp,
			resetPassword,
		}),
		[isAuthenticated, isAuthLoading, loggedInUser]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
