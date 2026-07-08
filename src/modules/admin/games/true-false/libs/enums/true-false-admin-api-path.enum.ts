import { AdminGameApiPath } from "~/modules/admin/libs/constants/admin-game-api-path.constant";

const TrueFalseAdminApiPath = {
	LEVEL_AUDIO_REGENERATE: `${AdminGameApiPath.LEVEL_DETAIL}/audio/regenerate`,
	LEVEL_STATEMENTS: `${AdminGameApiPath.LEVEL_DETAIL}/statements`,
	STATEMENT_AUDIO_REGENERATE: "/games/:gameId/statements/:statementId/audio/regenerate",
	STATEMENT_DETAIL: "/games/:gameId/statements/:statementId",
} as const;

export { TrueFalseAdminApiPath };
