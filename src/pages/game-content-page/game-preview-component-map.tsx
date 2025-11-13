import { FindTheWrongPreview } from "~/games/find-the-wrong/find-the-wrong-preview";
import { TrueFalseImagePreview } from "~/games/true-false-image/true-false-image-preview";
import { TrueFalseTextPreview } from "~/games/true-false-text/true-false-text-preview";
import { GameKey } from "~/libs/enums/enums";

type GameKeyType = (typeof GameKey)[keyof typeof GameKey];

type GamePreviewComponent = React.ComponentType<Record<string, never>>;

const GamePreviewComponentMap: Record<GameKeyType, GamePreviewComponent> = {
	[GameKey.FIND_THE_WRONG]: FindTheWrongPreview,
	[GameKey.TRUE_FALSE_IMAGE]: TrueFalseImagePreview,
	[GameKey.TRUE_FALSE_TEXT]: TrueFalseTextPreview,
};

export { type GameKeyType, GamePreviewComponentMap };
