type ArithmeticAttemptResponseDto = {
	results: ArithmeticAttemptResultDto[];
};

type ArithmeticAttemptResultDto = {
	correct: boolean;
	equation_id: number;
	expected_answer: number;
	given_answer: number;
	operand_a: number;
	operand_b: number;
	operator: string;
};

export type { ArithmeticAttemptResponseDto, ArithmeticAttemptResultDto };
