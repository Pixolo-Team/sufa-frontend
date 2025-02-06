/** Validate Email - it should have @ and a .com/.in etc at the end*/
export const validateEmail = (email: string) => {
	// Check for non-empty string and validate against the email regex pattern
	const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

	// Consider empty string ("") as invalid
	if (email.trim() === "") {
		return false;
	}

	return emailRegex.test(email);
};

/** Function to validate password format using regular expression - Password should contain atleast 8 characters, 1 Uppercase Letter, 1 Special character and 1 Number */
export const validatePassword = (password: string) => {
	// Regular expression for password validation
	const passwordRegex =
		/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
};
