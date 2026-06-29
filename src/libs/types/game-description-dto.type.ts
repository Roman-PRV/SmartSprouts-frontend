import { type GameCategory, type GameKey } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/value-of.type";

type GameDescriptionDto = {
	categories?: ValueOf<typeof GameCategory>[];
	description: string;
	icon_url: string;
	id: string;
	isActive?: boolean;
	key: (typeof GameKey)[keyof typeof GameKey];
	title: string;
};

export type { GameDescriptionDto };
