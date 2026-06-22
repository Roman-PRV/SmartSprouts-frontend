type ArithmeticAttemptAnswerDto = {
	answer: number;
	equation_id: number;
};

type ArithmeticAttemptRequestDto = {
	answers: ArithmeticAttemptAnswerDto[];
};

export type { ArithmeticAttemptAnswerDto, ArithmeticAttemptRequestDto };
