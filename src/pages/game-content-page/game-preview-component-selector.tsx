import { FindTheWrongPreview } from "~/games/find-the-wrong/find-the-wrong-preview";
import { TrueFalseImagePreview } from "~/games/true-false-image/true-false-image-preview";
import { TrueFalseTextPreview } from "~/games/true-false-text/true-false-text-preview";
import { GameKey, type GameKeyType } from "~/libs/enums/enums";
import { type GamePreviewComponent } from "~/libs/types/types";

const GamePreviewComponentMap: Record<GameKeyType, GamePreviewComponent> = {
	[GameKey.FIND_THE_WRONG]: FindTheWrongPreview,
	[GameKey.TRUE_FALSE_IMAGE]: TrueFalseImagePreview,
	[GameKey.TRUE_FALSE_TEXT]: TrueFalseTextPreview,
};

const isValidGameKey = (key: string): key is GameKeyType => {
	return key in GamePreviewComponentMap;
};

const getGamePreviewComponent = (key: string): GamePreviewComponent | null => {
	if (!isValidGameKey(key)) {
		return null;
	}

	return GamePreviewComponentMap[key];
};

export { GamePreviewComponentMap, getGamePreviewComponent, isValidGameKey };
