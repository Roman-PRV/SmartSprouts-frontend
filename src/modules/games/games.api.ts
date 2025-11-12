import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type";
import { type LevelDescriptionDto } from "~/libs/types/types";

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

	public async getAll(): Promise<GameDescriptionDto[]> {
		const url = this.getFullEndpoint(GamesApiPath.ROOT, {});
		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<GameDescriptionDto[]>();
	}

	public async getById(id: string): Promise<GameDescriptionDto> {
		const url = this.getFullEndpoint(GamesApiPath.$ID, { id: String(id) });

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<GameDescriptionDto>();
	}

	public async getLevelsList(id: string): Promise<LevelDescriptionDto[]> {
		const url = this.getFullEndpoint(GamesApiPath.$ID, GamesApiPath.LEVELS, {
			id: String(id),
		});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<LevelDescriptionDto[]>();
	}
}

export { GamesApi };
