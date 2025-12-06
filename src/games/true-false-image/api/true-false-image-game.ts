import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { TrueFalseImageApi } from "./true-false-image-api";

const trueFalseImageApi = new TrueFalseImageApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { trueFalseImageApi };
export { actions, reducer } from "./slices/true-false-image";
