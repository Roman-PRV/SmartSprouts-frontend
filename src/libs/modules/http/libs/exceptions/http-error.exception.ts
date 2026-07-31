import { type ServerErrorType } from "~/libs/enums/enums";
import { type ServerErrorDetail, type ValueOf } from "~/libs/types/types";

import { type HTTPCode } from "../enums/enums";
import { ApplicationError } from "./application-error.exception";

type Constructor = {
	cause?: unknown;
	details: ServerErrorDetail[];
	errors?: Record<string, string[]> | undefined;
	errorType: ValueOf<typeof ServerErrorType>;
	message: string;
	/** True only for an authenticated request rejected with 401 (session expired). */
	sessionExpired?: boolean | undefined;
	status: ValueOf<typeof HTTPCode>;
};

class HTTPError extends ApplicationError {
	public details: ServerErrorDetail[];
	public errors?: Record<string, string[]> | undefined;
	public errorType: ValueOf<typeof ServerErrorType>;

	public sessionExpired?: boolean | undefined;

	public status: ValueOf<typeof HTTPCode>;

	public constructor({
		cause,
		details,
		errors,
		errorType,
		message,
		sessionExpired,
		status,
	}: Constructor) {
		super({
			cause,
			message,
		});
		this.status = status;
		this.errorType = errorType;
		this.details = details;
		this.errors = errors;
		this.sessionExpired = sessionExpired;
	}
}

export { HTTPError };
