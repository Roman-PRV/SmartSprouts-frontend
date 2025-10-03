import { type ValueOf } from "../../../../types/types.js";
import { type HTTPMethod } from "../enums/enums.js";

type HTTPOptions = {
	headers: Headers;
	method: ValueOf<typeof HTTPMethod>;
	payload: BodyInit | null;
};

export { type HTTPOptions };
