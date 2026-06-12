import { type FindTheWrongRevealItemDto } from "./find-the-wrong-reveal-item-dto.type";

type SubmitAttemptResponseDto = {
	found_items: FindTheWrongRevealItemDto[];
	missed_items: FindTheWrongRevealItemDto[];
	score: number;
	total_questions: number;
};

export { type SubmitAttemptResponseDto };
