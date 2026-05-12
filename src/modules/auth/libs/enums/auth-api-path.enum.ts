const AuthApiPath = {
	AUTHENTICATED_USER: "/me",
	GOOGLE_REDIRECT: "/google/redirect",
	LOGIN: "/login",
	LOGOUT: "/logout",
	REGISTER: "/register",
	ROOT: "/",
} as const;

export { AuthApiPath };
