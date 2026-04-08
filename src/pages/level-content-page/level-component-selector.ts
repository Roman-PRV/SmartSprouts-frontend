import { TrueFalseLevelCard } from "~/libs/components/components";
import { GameKey, type GameKeyType } from "~/libs/enums/enums";
import { type LevelCardComponent } from "~/libs/types/level-card-component.type";

const LevelCardComponentMap: Record<GameKeyType, LevelCardComponent> = {
	[GameKey.FIND_THE_WRONG]: TrueFalseLevelCard,
	[GameKey.TRUE_FALSE_IMAGE]: TrueFalseLevelCard,
	[GameKey.TRUE_FALSE_TEXT]: TrueFalseLevelCard,
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
