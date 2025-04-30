/** Formats a timestamp into a human-readable date string */
export const formatDate = (timestamp: string) => {
	const date = new Date(parseInt(timestamp));
	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
