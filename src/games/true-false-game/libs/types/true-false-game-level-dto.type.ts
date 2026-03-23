import type { TrueFalseGameStatementDto } from "./true-false-game-statement-dto.type";

type TrueFalseGameLevelDto = {
	id: number;
	image_url: null | string;
	statements: TrueFalseGameStatementDto[];
	text: null | string;
	text_audio_url: null | string;
	title: string;
	title_audio_url: null | string;
};

export type { TrueFalseGameLevelDto };
