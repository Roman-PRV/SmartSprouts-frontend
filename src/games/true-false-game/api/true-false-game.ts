import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { TrueFalseGameApi } from "./true-false-game-api";

const trueFalseGameApi = new TrueFalseGameApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { trueFalseGameApi };
export { actions, reducer } from "./slices/true-false-game";
