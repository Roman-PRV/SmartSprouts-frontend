import { type ServerErrorType } from "~/libs/enums/enums.js";
import { type ServerErrorDetail, type ValueOf } from "~/libs/types/types.js";

import { type HTTPCode } from "../enums/enums";
import { ApplicationError } from "./application-error.exception";

type Constructor = {
	cause?: unknown;
	details: ServerErrorDetail[];
	errorType: ValueOf<typeof ServerErrorType>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class HTTPError extends ApplicationError {
	public details: ServerErrorDetail[];
	public errorType: ValueOf<typeof ServerErrorType>;

	public status: ValueOf<typeof HTTPCode>;

	public constructor({ cause, details, errorType, message, status }: Constructor) {
		super({
			cause,
			message,
		});
		this.status = status;
		this.errorType = errorType;
		this.details = details;
	}
}

export { HTTPError };
