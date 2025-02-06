"use client";
// REACT //
import React from "react";

// ENUMS //
import { UserRoles } from "@/enums/app.enum";

// CONTEXTS //
import { useAuthContext } from "@/contexts/Auth.context";

// Define the interface for Render On Role Props
interface RenderOnRoleProps {
	children: React.ReactNode;
	roles: UserRoles[];
}

/** Neevo Render on Role component */
const RenderOnRole: React.FC<RenderOnRoleProps> = ({ children, roles }) => {
	// Define Context
	const { loggedInUser } = useAuthContext();

	// Check if the user has the required role.
	if (!loggedInUser?.role || !roles.includes(loggedInUser?.role)) {
		return null;
	}

	// Render the children component.
	return <>{children}</>;
};

export default RenderOnRole;
