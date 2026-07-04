import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { TrueFalseAdminApi } from "./true-false-admin-api";

const trueFalseAdminApi = new TrueFalseAdminApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { trueFalseAdminApi };
export {
	actions,
	createLevel,
	createStatement,
	deleteLevel,
	deleteStatement,
	getLevel,
	getLevelsList,
	reducer,
	regenerateLevelAudio,
	regenerateStatementAudio,
	updateLevel,
	updateStatement,
} from "./slices/true-false-admin";
