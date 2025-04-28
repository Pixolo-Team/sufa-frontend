export type TaskUser = {
	id: number;
	username: string;
	email: string;
};

export type TaskResponse = {
	id: string;
	name: string;
	status: string;
	description: string;
	creator: TaskUser;
	date_created: string;
	date_closed: string | null;
	date_updated: string | null;
	subtasks?: TaskResponse[];
};

export type ApiResponse = {
	parentTask: TaskResponse;
};
