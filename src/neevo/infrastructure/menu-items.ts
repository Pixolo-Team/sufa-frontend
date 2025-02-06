// ENUMS //
import { Paths } from "@/enums/paths.enum";

// Menu Pages Data
export const menuItems = [
	{
		title: "Accounts",
		menu_items: [
			{
				path: "/sellers",
				name: "Accounts List",
				icon: "file",
				sub_menu_items: [
					{
						path: Paths.SIGNUP,
						name: "Sign Up",
						icon: "file",
					},
					{
						path: Paths.LOGIN,
						name: "Login",
						icon: "file",
					},
				],
			},
		],
	},
];
