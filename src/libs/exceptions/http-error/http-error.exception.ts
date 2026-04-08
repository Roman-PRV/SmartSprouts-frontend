import { type HTTPCode } from "~/libs/modules/http/http";
import { type ValueOf } from "~/libs/types/value-of.type";

import { ApplicationError } from "../application-error/application-error.exception";

type Constructor = {
	cause?: unknown;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class HTTPError extends ApplicationError {
	public status: ValueOf<typeof HTTPCode>;

	public constructor({ cause, message, status }: Constructor) {
		super({
			cause,
			message,
		});

		this.status = status;
	}
}

export { HTTPError };
