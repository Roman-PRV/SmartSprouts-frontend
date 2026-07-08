import { APIPath, type GameCategory } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type";
import { type LevelDescriptionDto, type ValueOf } from "~/libs/types/types";

import { GamesApiPath } from "./libs/enums/enums";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class GamesApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GAMES, storage });
	}

	public async getAll(category?: ValueOf<typeof GameCategory>): Promise<GameDescriptionDto[]> {
		const url = this.getFullEndpoint(GamesApiPath.ROOT, {});
		const endpoint = category ? `${url}?${new URLSearchParams({ category }).toString()}` : url;

		return await this.requestJson<GameDescriptionDto[]>(endpoint, { method: HTTPMethod.GET });
	}

	public async getById(id: string): Promise<GameDescriptionDto> {
		const url = this.getFullEndpoint(GamesApiPath.$ID, { id });

		return await this.requestJson<GameDescriptionDto>(url, { method: HTTPMethod.GET });
	}

	public async getLevelsList(id: string): Promise<LevelDescriptionDto[]> {
		const url = this.getFullEndpoint(GamesApiPath.$ID, GamesApiPath.LEVELS, {
			id,
		});

		return await this.requestJson<LevelDescriptionDto[]>(url, { method: HTTPMethod.GET });
	}
}

export { GamesApi };
