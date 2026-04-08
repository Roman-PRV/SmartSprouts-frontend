import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { GamesApi } from "./games.api";

const gamesApi = new GamesApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { gamesApi };
export { actions, reducer } from "./slices/games";
