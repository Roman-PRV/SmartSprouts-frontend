const auth = {
	consent: {
		label:
			"I confirm that I am 18 or older and the child's parent or legal guardian, I accept the <0>Terms of Service</0> and have read the <1>Privacy Policy</1>",
	},
	consentGate: {
		button: "Continue",
		description:
			"We need your confirmation before you can continue: our records show you haven't accepted the current version of our legal documents yet.",
		error: "Failed to save your confirmation. Please try again.",
		title: "One More Step",
	},
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
	sessionExpired: "Your session has expired. Please log in again.",
};

export { auth };
