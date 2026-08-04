// ENUMS //
import { UserRoles } from "@/enums/app.enum";

export type AuthenticatedUserData = {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	token: string;
	contact: string;
	role?: UserRoles;
};
