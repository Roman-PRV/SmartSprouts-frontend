import { type GameKeyType } from "~/libs/enums/enums";

import { type AdminLevelEditorSectionProperties } from "./admin-level-editor-section-properties.type";
import { type AdminLevelsListSectionProperties } from "./admin-levels-list-section-properties.type";

type AdminGameRegistration = {
	EditorSection: React.FC<AdminLevelEditorSectionProperties>;
	gameKey: GameKeyType;
	labelKey: string;
	LevelsListSection: React.FC<AdminLevelsListSectionProperties>;
};

export { type AdminGameRegistration };
