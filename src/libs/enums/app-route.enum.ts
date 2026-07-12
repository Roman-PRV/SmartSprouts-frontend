const AppRoute = {
	ADMIN_GAME_LEVEL_EDITOR: "/admin/games/:gameId/levels/:levelId",
	ADMIN_GAME_LEVELS: "/admin/games/:gameId/levels",
	ADMIN_ROOT: "/admin",
	AUTH_GOOGLE_CALLBACK: "/auth/google/callback",
	GAME_CONTENT: "/games/:id",
	GAMES: "/games",
	LEVEL_CONTENT: "/games/:id/levels/:levelId",
	LOGIN: "/login",
	PRIVACY: "/privacy",
	PROFILE: "/profile",
	REGISTER: "/register",
	ROOT: "/",
	TERMS: "/terms",
} as const;

export { AppRoute };
