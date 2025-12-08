const TrueFalseGameApiPath = {
	$GAME_ID: "/:gameId",
	$LEVEL_ID: "/:levelId",
	CHECK: "/check",
	LEVELS: "/levels",
} as const;

export { TrueFalseGameApiPath };
