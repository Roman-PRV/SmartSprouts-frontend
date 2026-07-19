import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { ProfileApiPath } from "./libs/enums/enums";
import {
	type DeleteAccountRequestDto,
	type UpdatePasswordRequestDto,
	type UpdatePasswordResponseDto,
	type UserProfileDto,
} from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class ProfileApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.PROFILE, storage });
	}

	public async acceptConsents(): Promise<void> {
		const url = this.getFullEndpoint(ProfileApiPath.CONSENTS, {});

		await this.requestVoid(url, {
			method: HTTPMethod.POST,
			payload: { accepted_terms: true },
		});
	}

	public async deleteAccount(payload: DeleteAccountRequestDto): Promise<void> {
		const url = this.getFullEndpoint(ProfileApiPath.ROOT, {});

		await this.requestVoid(url, { method: HTTPMethod.DELETE, payload });
	}

	public async getProfile(): Promise<UserProfileDto> {
		const url = this.getFullEndpoint(ProfileApiPath.ROOT, {});

		return await this.requestJson<UserProfileDto>(url, { method: HTTPMethod.GET });
	}

	public async requestDeletionCode(): Promise<void> {
		const url = this.getFullEndpoint(ProfileApiPath.DELETION_CODE, {});

		await this.requestVoid(url, { method: HTTPMethod.POST });
	}

	public async updatePassword(
		payload: UpdatePasswordRequestDto
	): Promise<UpdatePasswordResponseDto> {
		const url = this.getFullEndpoint(ProfileApiPath.PASSWORD, {});

		return await this.requestJson<UpdatePasswordResponseDto>(url, {
			method: HTTPMethod.PUT,
			payload,
		});
	}
}

export { ProfileApi };
