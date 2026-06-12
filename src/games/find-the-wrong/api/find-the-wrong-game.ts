import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { FindTheWrongGameApi } from "./find-the-wrong-game-api";

const findTheWrongGameApi = new FindTheWrongGameApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { findTheWrongGameApi };
export { actions, reducer } from "./slices/find-the-wrong-game";
