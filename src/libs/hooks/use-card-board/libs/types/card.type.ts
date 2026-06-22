const CardKind = {
	ANSWER: "answer",
	EQUATION: "equation",
} as const;

type AnswerCard = {
	key: string;
	type: typeof CardKind.ANSWER;
	value: number;
};

type CardPosition = {
	x: number;
	y: number;
};

type EquationCard = {
	equationId: number;
	key: string;
	operandA: number;
	operandB: number;
	type: typeof CardKind.EQUATION;
};

export { type AnswerCard, type CardPosition, type EquationCard, CardKind };
