import { ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class GamesApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: "/games", storage });
	}

	public async getAll(): Promise<GameDescriptionDto[]> {
		const response = await this.load("http://localhost:3000/api/games", {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<GameDescriptionDto[]>();
	}
}

export { GamesApi };
