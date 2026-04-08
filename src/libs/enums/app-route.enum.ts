const AppRoute = {
	GAME_CONTENT: "/games/:id",
	GAMES: "/games",
	LEVEL_CONTENT: "/games/:id/levels/:levelId",
	LOGIN: "/login",
	PROFILE: "/profile",
	REGISTER: "/register",
	ROOT: "/",
} as const;

export { AppRoute };
