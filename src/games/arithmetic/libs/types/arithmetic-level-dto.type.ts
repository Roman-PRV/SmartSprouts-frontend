import type { ArithmeticEquationDto } from "./arithmetic-equation-dto.type";

type ArithmeticLevelDto = {
	equations?: ArithmeticEquationDto[];
	id: number;
	image_url: null | string;
	operator: string;
	title: string;
};

export type { ArithmeticLevelDto };
