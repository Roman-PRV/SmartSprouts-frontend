import { type ValueOf } from "../../../../types/types";
import { type HTTPMethod } from "../enums/enums";

type HTTPOptions = {
	credentials?: RequestCredentials;
	headers: Headers;
	method: ValueOf<typeof HTTPMethod>;
	payload: BodyInit | null;
};

export { type HTTPOptions };
