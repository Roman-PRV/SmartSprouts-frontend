import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { FindTheWrongAdminApi } from "./find-the-wrong-admin-api";

const findTheWrongAdminApi = new FindTheWrongAdminApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { findTheWrongAdminApi };
export {
	actions,
	createItem,
	createLevel,
	deleteItem,
	deleteLevel,
	getLevel,
	getLevelsList,
	reducer,
	updateItem,
	updateLevel,
} from "./slices/find-the-wrong-admin";
