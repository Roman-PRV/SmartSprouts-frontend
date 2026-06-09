import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { AdminGameApiPath } from "~/modules/admin/libs/constants/admin-game-api-path.constant";

import { type FindTheWrongAdminLevelDto } from "../libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class FindTheWrongAdminApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ADMIN, storage });
	}

	public async createLevel(
		gameId: string,
		formData: FormData
	): Promise<FindTheWrongAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: formData,
		});

		return await response.json<FindTheWrongAdminLevelDto>();
	}

	public async deleteLevel(gameId: string, levelId: number): Promise<void> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.DELETE,
		});
	}

	public async getLevelsList(gameId: string): Promise<FindTheWrongAdminLevelDto[]> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<FindTheWrongAdminLevelDto[]>();
	}
}

export { FindTheWrongAdminApi };
