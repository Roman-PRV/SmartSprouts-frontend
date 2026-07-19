import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { ProfileApi } from "./profile.api";

const profileApi = new ProfileApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { profileApi };
export {
	type DeleteAccountWithCodeRequestDto,
	type DeleteAccountWithPasswordRequestDto,
	type UpdatePasswordRequestDto,
	type UserProfileDto,
} from "./libs/types/types";
export {
	deleteAccountWithCodeValidationSchema,
	deleteAccountWithPasswordValidationSchema,
	updatePasswordValidationSchema,
} from "./libs/validation-schemas/validation-schemas";
export {
	acceptConsents,
	deleteAccountWithCode,
	deleteAccountWithPassword,
	fetchProfile,
	requestDeletionCode,
	updatePassword,
} from "./slices/actions";
export { reducer } from "./slices/profile.slice";
