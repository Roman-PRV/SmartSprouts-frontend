import { AppRoute } from "~/libs/enums/enums";

const buildAdminLevelsListUrl = (gameId: string): string => {
	return AppRoute.ADMIN_GAME_LEVELS.replace(":gameId", gameId);
};

export { buildAdminLevelsListUrl };
