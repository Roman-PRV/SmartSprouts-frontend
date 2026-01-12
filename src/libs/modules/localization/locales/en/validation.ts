const validation = {
	email: {
		invalid: "Please enter a valid email",
		required: "Email is required",
	},
	name: {
		minLength: "Name must be at least {{min}} characters",
		required: "Name is required",
	},
	password: {
		minLength: "Password must be at least {{min}} characters",
		mustContainLetter: "Password must contain at least one letter",
		mustContainNumber: "Password must contain at least one number",
		required: "Password is required",
	},
	passwordConfirmation: {
		mustMatch: "Passwords must match",
		required: "Password confirmation is required",
	},
};

export { validation };
