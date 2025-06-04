export type TaskCreatorData = {
	id: number;
	username: string;
	email: string;
};

export type TaskData = {
	id: string;
	name: string;
	status: string;
	description: Record<string, any>;
	creator: TaskCreatorData;
	date_created: string;
	date_closed: string | null;
	date_updated: string;
	subtasks?: TaskData[];
};
