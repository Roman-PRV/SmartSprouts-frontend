import { ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { type Storage } from "~/libs/modules/storage/storage";
import { type GameDescriptionDto } from "~/types/game-description-dto.type";

class GamesApi extends BaseHTTPApi {
	public constructor({
		baseUrl,
		http,
		storage,
	}: {
		baseUrl: string;
		http: HTTP;
		storage: Storage;
	}) {
		super({ baseUrl, http, path: "/games", storage });
	}

	public getAll(): Promise<GameDescriptionDto[]> {
		const endpoint = this.getFullEndpoint({});

		return this.load(endpoint, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: "GET",
		}).then((response) => response.json() as Promise<GameDescriptionDto[]>);
	}
}

export { GamesApi };
