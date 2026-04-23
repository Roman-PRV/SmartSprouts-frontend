import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { ProfileApiPath } from "./libs/enums/enums";
import { type UserProfileDto } from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class ProfileApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.PROFILE, storage });
	}

	public async getProfile(): Promise<UserProfileDto> {
		const url = this.getFullEndpoint(ProfileApiPath.ROOT, {});

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			payload: null,
		});

		return await response.json<UserProfileDto>();
	}
}

export { ProfileApi };
