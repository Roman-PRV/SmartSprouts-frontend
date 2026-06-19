import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { FindTheWrongGameApiPath } from "../libs/enums/enums";
import {
	type FindTheWrongLevelDto,
	type SubmitAttemptPayload,
	type SubmitAttemptResponseDto,
} from "../libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class FindTheWrongGameApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GAMES, storage });
	}

	/**
	 * GET /games/{gameId}/levels/{levelId}
	 *
	 * Generic player level route; the BE dispatcher returns the
	 * FindTheWrongLevelResource for find-the-wrong games.
	 */
	public async getLevelById(gameId: string, levelId: string): Promise<FindTheWrongLevelDto> {
		const url = this.getFullEndpoint(
			FindTheWrongGameApiPath.$GAME_ID,
			FindTheWrongGameApiPath.LEVELS,
			FindTheWrongGameApiPath.$LEVEL_ID,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<FindTheWrongLevelDto>();
	}

	/**
	 * POST /games/{gameId}/levels/{levelId}/attempts
	 */
	public async submitAttempt(
		gameId: string,
		levelId: string,
		payload: SubmitAttemptPayload
	): Promise<SubmitAttemptResponseDto> {
		const url = this.getFullEndpoint(
			FindTheWrongGameApiPath.$GAME_ID,
			FindTheWrongGameApiPath.LEVELS,
			FindTheWrongGameApiPath.$LEVEL_ID,
			FindTheWrongGameApiPath.ATTEMPTS,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});

		return await response.json<SubmitAttemptResponseDto>();
	}
}

export { FindTheWrongGameApi };
