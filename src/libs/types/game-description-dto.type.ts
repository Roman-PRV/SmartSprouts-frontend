import { type GameKey } from "~/libs/enums/enums";

type GameDescriptionDto = {
	description: string;
	icon_url: string;
	id: string;
	isActive?: boolean;
	key: (typeof GameKey)[keyof typeof GameKey];
	title: string;
};

export type { GameDescriptionDto };
