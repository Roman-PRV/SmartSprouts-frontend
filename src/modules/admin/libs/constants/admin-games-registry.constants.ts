import { GameKey } from "~/libs/enums/enums";
import {
	FindTheWrongEditorSection,
	FindTheWrongLevelsListSection,
} from "~/modules/admin/games/find-the-wrong/find-the-wrong-admin";

import { type AdminGameRegistration } from "../types/admin-game-registration.type";

const ADMIN_GAMES_REGISTRY: readonly AdminGameRegistration[] = [
	{
		EditorSection: FindTheWrongEditorSection,
		gameKey: GameKey.FIND_THE_WRONG,
		labelKey: "admin.nav.findTheWrong",
		LevelsListSection: FindTheWrongLevelsListSection,
	},
];

export { ADMIN_GAMES_REGISTRY };
