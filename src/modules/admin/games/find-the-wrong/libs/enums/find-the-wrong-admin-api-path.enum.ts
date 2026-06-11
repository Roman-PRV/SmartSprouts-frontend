import { AdminGameApiPath } from "~/modules/admin/libs/constants/admin-game-api-path.constant";

const FindTheWrongAdminApiPath = {
	GAME_LEVEL_ITEMS: `${AdminGameApiPath.LEVEL_DETAIL}/items`,
	ITEM_DETAIL: "/games/:gameId/items/:itemId",
} as const;

export { FindTheWrongAdminApiPath };
