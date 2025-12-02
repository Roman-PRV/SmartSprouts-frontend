import type { TrueFalseImageAnswerDto } from "./true-false-image-answer-dto.type";

type TrueFalseImageAnswerRequestDto = {
	answers: TrueFalseImageAnswerDto[];
	level_id: number;
};

export type { TrueFalseImageAnswerRequestDto };
