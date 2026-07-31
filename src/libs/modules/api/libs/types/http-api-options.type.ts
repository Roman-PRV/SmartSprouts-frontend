import { type ContentType } from "~/libs/enums/enums";
import { type HTTPOptions } from "~/libs/modules/http/http";
import { type ValueOf } from "~/libs/types/types";

type HTTPApiOptions = Omit<HTTPOptions, "headers" | "payload"> & {
	contentType?: ValueOf<typeof ContentType>;
	hasAuth: boolean;
	payload?: HTTPOptions["payload"];
	/** Opt out of treating a 401 as an expired session (e.g. logout). */
	skipUnauthorizedHandler?: boolean;
};

export { type HTTPApiOptions };
