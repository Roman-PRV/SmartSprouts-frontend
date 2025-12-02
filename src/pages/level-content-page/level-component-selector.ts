import { TrueFalseImageLevelCard } from "~/games/true-false-image/libs/components/components";
import { GameKey, type GameKeyType } from "~/libs/enums/enums";
import { type LevelCardComponent } from "~/libs/types/level-card-component.type";

const LevelCardComponentMap: Record<GameKeyType, LevelCardComponent> = {
	[GameKey.FIND_THE_WRONG]: TrueFalseImageLevelCard,
	[GameKey.TRUE_FALSE_IMAGE]: TrueFalseImageLevelCard,
	[GameKey.TRUE_FALSE_TEXT]: TrueFalseImageLevelCard,
};

const isValidGameKey = (key: string): key is GameKeyType => {
	return key in LevelCardComponentMap;
};

const getLevelComponent: (key: string) => LevelCardComponent | null = (
	key: string
): LevelCardComponent | null => {
	if (!isValidGameKey(key)) {
		return null;
	}

	return LevelCardComponentMap[key];
};

export { getLevelComponent };
