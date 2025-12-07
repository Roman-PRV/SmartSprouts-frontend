import type { TrueFalseGameStatementDto } from "./true-false-game-statement-dto.type";

type TrueFalseGameLevelDto = {
	id: number;
	image_url: null | string;
	statements: TrueFalseGameStatementDto[];
	text: null | string;
	title: string;
};

export type { TrueFalseGameLevelDto };
