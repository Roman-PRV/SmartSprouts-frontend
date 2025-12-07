import type { TrueFalseImageStatementDto } from "./true-false-image-statement-dto.type";

type TrueFalseImageLevelDto = {
	id: number;
	image_url: null | string;
	statements: TrueFalseImageStatementDto[];
	text: null | string;
	title: string;
};

export type { TrueFalseImageLevelDto };
