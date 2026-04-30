const validation = {
	email: {
		invalid: "Please enter a valid email",
		required: "Email is required",
	},
	error: "Validation error",
	name: {
		minLength: "Name must be at least {{min}} characters",
		required: "Name is required",
	},
	password: {
		minLength: "Password must be at least {{min}} characters",
		mustBeNew: "New password must be different from the current one",
		mustContainLetter: "Password must contain at least one letter",
		mustContainLowercase: "Password must contain at least one lowercase letter",
		mustContainNumber: "Password must contain at least one number",
		mustContainUppercase: "Password must contain at least one uppercase letter",
		required: "Password is required",
	},
	passwordConfirmation: {
		mustMatch: "Passwords must match",
		required: "Password confirmation is required",
	},
};

export { validation };
