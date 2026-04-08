import type { TrueFalseGameAnswerDto } from "./true-false-game-answer-dto.type";

type TrueFalseGameAnswerRequestDto = {
	answers: TrueFalseGameAnswerDto[];
	level_id: number;
};

export type { TrueFalseGameAnswerRequestDto };
