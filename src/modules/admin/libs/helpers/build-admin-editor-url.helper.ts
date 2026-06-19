import { AppRoute } from "~/libs/enums/enums";

const buildAdminEditorUrl = (gameId: string, levelId: number): string => {
	return AppRoute.ADMIN_GAME_LEVEL_EDITOR.replace(":gameId", gameId).replace(
		":levelId",
		String(levelId)
	);
};

export { buildAdminEditorUrl };
