import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { ProfileApi } from "./profile.api.js";

const profileApi = new ProfileApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { profileApi };
export { ProfileApiPath } from "./libs/enums/enums.js";
export { type UserProfileDto } from "./libs/types/types.js";
export { fetchProfile } from "./slices/actions.js";
export { actions, reducer } from "./slices/profile.slice.js";
