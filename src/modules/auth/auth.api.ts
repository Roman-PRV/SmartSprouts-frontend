import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { AuthApiPath } from "./libs/enums/enums";
import {
	type AuthenticatedUserResponseDto,
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
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

	public async getAuthenticatedUser(): Promise<AuthenticatedUserResponseDto> {
		const url = this.getFullEndpoint(AuthApiPath.AUTHENTICATED_USER, {});

		return await this.requestJson<AuthenticatedUserResponseDto>(url, {
			method: HTTPMethod.GET,
		});
	}

	public async getGoogleRedirectUrl(): Promise<{ url: string }> {
		const url = this.getFullEndpoint(AuthApiPath.GOOGLE_REDIRECT, {});

		return await this.requestJson<{ url: string }>(url, {
			credentials: "include",
			hasAuth: false,
			method: HTTPMethod.GET,
		});
	}

	public async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
		const url = this.getFullEndpoint(AuthApiPath.LOGIN, {});

		return await this.requestJson<LoginResponseDto>(url, {
			hasAuth: false,
			method: HTTPMethod.POST,
			payload,
		});
	}

	public async logout(): Promise<void> {
		const url = this.getFullEndpoint(AuthApiPath.LOGOUT, {});

		// Send the token (the server revokes it), but a 401 here means the session
		// was already gone — a benign logout, not an expiry — so skip the global
		// session-expiry handler and its misleading "session expired" toast.
		await this.requestVoid(url, { method: HTTPMethod.POST, skipUnauthorizedHandler: true });
	}

	public async register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
		const url = this.getFullEndpoint(AuthApiPath.REGISTER, {});

		return await this.requestJson<RegisterResponseDto>(url, {
			hasAuth: false,
			method: HTTPMethod.POST,
			payload,
		});
	}
}

export { AuthApi };
