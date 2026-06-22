import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { ArithmeticGameApi } from "./arithmetic-game-api";

const arithmeticGameApi = new ArithmeticGameApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { arithmeticGameApi };
export { actions, reducer } from "./slices/arithmetic-game";
