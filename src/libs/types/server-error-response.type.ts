import { type ServerErrorType } from "../enums/enums";
import { type ServerErrorDetail } from "./server-error-detail.type";

type ServerCommonErrorResponse = {
	errorType: typeof ServerErrorType.COMMON;
	message: string;
};

type ServerErrorResponse = ServerCommonErrorResponse | ServerValidationErrorResponse;

type ServerValidationErrorResponse = {
	details: ServerErrorDetail[];
	errors?: Record<string, string[]>;
	errorType: typeof ServerErrorType.VALIDATION;
	message: string;
};

export { type ServerErrorResponse };
