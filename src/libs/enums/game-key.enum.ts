const GameKey = {
	ADDITION_TABLE: "addition_table",
	FIND_THE_WRONG: "find_the_wrong",
	MULTIPLICATION_TABLE: "multiplication_table",
	TRUE_FALSE_IMAGE: "true_false_image",
	TRUE_FALSE_TEXT: "true_false_text",
} as const;

type GameKeyType = (typeof GameKey)[keyof typeof GameKey];

export { type GameKeyType, GameKey };
