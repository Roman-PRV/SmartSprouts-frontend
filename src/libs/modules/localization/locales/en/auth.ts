const auth = {
	googleCallback: {
		errors: {
			authFailed: "Failed to sign in with Google. Please try again.",
			invalidAccount: "Your Google account does not contain the required information.",
			invalidState: "Your sign-in session has expired. Please try again.",
		},
		loading: "Completing sign-in…",
	},
	login: {
		button: "Login",
		fields: {
			email: {
				label: "Email",
				placeholder: "your@email.com",
			},
			password: {
				label: "Password",
				placeholder: "Enter password",
			},
		},
		footerLinkText: "Register",
		footerText: "Don't have an account?",
		googleButton: "Sign in with Google",
		googleErrors: {
			redirectFailed: "Unable to start Google sign-in. Please try again.",
		},
		orDivider: "or",
		subtitle: "Login to continue",
		title: "Welcome Back",
	},
	register: {
		button: "Register",
		fields: {
			confirmPassword: {
				label: "Confirm Password",
				placeholder: "Confirm password",
			},
			email: {
				label: "Email",
				placeholder: "your@email.com",
			},
			name: {
				label: "Name",
				placeholder: "Your name",
			},
			password: {
				label: "Password",
				placeholder: "Enter password",
			},
		},
		footerLinkText: "Sign in",
		footerText: "Already have an account?",
		subtitle: "Register to get started",
		title: "Create Account",
	},
};

export { auth };
