import { type GameDescriptionDto, type LevelDescriptionDto } from "./types";

type GameWithLevelsDto = {
	game: GameDescriptionDto;
	levels: LevelDescriptionDto[];
};

export type { GameWithLevelsDto };
