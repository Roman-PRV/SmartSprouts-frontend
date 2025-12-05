import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { GamesApi } from "./games.api.js";

const gamesApi = new GamesApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { gamesApi };
export { actions, reducer } from "./slices/games.js";
