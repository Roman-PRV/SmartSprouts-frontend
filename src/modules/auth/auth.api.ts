import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { AuthApiPath } from "./libs/enums/enums";
import { type RegisterRequestDto, type RegisterResponseDto } from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class AuthApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.AUTH, storage });
	}

	public async register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
		const url = this.getFullEndpoint(AuthApiPath.REGISTER, {});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: false,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});

		return await response.json<RegisterResponseDto>();
	}
}

export { AuthApi };
