import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { AuthApiPath } from "./libs/enums/enums";
import {
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
	type User,
} from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class AuthApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.AUTH, storage });
	}

	public async getAuthenticatedUser(): Promise<User> {
		const url = this.getFullEndpoint(AuthApiPath.AUTHENTICATED_USER, {});

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			payload: null,
		});

		return await response.json<User>();
	}

	public async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
		const url = this.getFullEndpoint(AuthApiPath.LOGIN, {});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: false,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});

		return await response.json<LoginResponseDto>();
	}

	public async logout(): Promise<void> {
		const url = this.getFullEndpoint(AuthApiPath.LOGOUT, {});

		await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: null,
		});
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
