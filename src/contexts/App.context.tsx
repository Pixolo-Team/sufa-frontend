"use client";
// REACT //
import React, { createContext, useCallback, useContext, useMemo } from "react";

// NAVIGATION //
import { useSearchParams } from "next/navigation";

// Define the shape of the AppContext
type AppContextType = {
	getPageNumber: () => number;
};

// Create an AppContext
const AppContext = createContext<AppContextType | null>(null);

/** Custom hook to use the AppContext */
export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === null) {
		throw new Error("useApp must be used within an AppProvider");
	}
	return context;
};

type AppProviderProps = {
	children: React.ReactNode;
};

/** AppProvider Component */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	// Define Navigation
	const searchParams = useSearchParams();

	// Define States

	/** Function to get Page Query Param */
	const getPageNumber = useCallback((): number => {
		// Get the query parameters
		return parseInt(searchParams.get("page") ?? "1");
	}, [searchParams]);

	/** Memoizes the value containing the getPageNumber function to avoid unnecessary recalculations. */
	const value = useMemo(
		() => ({
			getPageNumber,
		}),
		[getPageNumber]
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
