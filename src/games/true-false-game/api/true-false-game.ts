import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { TrueFalseGameApi } from "./true-false-game-api";

const trueFalseGameApi = new TrueFalseGameApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { trueFalseGameApi };
export { actions, reducer } from "./slices/true-false-game";
