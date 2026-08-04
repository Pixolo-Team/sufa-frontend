/** Function to convert the string to Kebab Case */
export const convertToKebabCase = (inputString: string) => {
	// Convert the input string to lowercase and replace spaces with hyphens
	return inputString.toLowerCase().replace(/\s+/g, "-");
};

/** Capitalize the first letter of each segment in a hyphenated string and remove hyphens */
export const capitalizeHyphenated = (str: string): string => {
	return str
		.split("-")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join("");
};
