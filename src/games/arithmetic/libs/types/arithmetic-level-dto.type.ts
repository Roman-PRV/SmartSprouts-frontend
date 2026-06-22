import type { ArithmeticEquationDto } from "./arithmetic-equation-dto.type";

type ArithmeticLevelDto = {
	equations?: ArithmeticEquationDto[];
	id: number;
	image_url: null | string;
	operator: string;
	title: string;
	title_audio_url: null | string;
};

export type { ArithmeticLevelDto };
