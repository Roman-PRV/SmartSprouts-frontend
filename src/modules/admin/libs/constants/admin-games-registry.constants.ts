import { GameKey } from "~/libs/enums/enums";
import {
	FindTheWrongEditorSection,
	FindTheWrongLevelsListSection,
} from "~/modules/admin/games/find-the-wrong/find-the-wrong-admin";
import {
	TrueFalseEditorSection,
	TrueFalseLevelsListSection,
} from "~/modules/admin/games/true-false/true-false-admin";

import { type AdminGameRegistration } from "../types/admin-game-registration.type";

const ADMIN_GAMES_REGISTRY: readonly AdminGameRegistration[] = [
	{
		EditorSection: FindTheWrongEditorSection,
		gameKey: GameKey.FIND_THE_WRONG,
		labelKey: "admin.nav.findTheWrong",
		LevelsListSection: FindTheWrongLevelsListSection,
	},
	{
		EditorSection: TrueFalseEditorSection,
		gameKey: GameKey.TRUE_FALSE_IMAGE,
		labelKey: "admin.nav.trueFalseImage",
		LevelsListSection: TrueFalseLevelsListSection,
	},
	{
		EditorSection: TrueFalseEditorSection,
		gameKey: GameKey.TRUE_FALSE_TEXT,
		labelKey: "admin.nav.trueFalseText",
		LevelsListSection: TrueFalseLevelsListSection,
	},
];

export { ADMIN_GAMES_REGISTRY };
