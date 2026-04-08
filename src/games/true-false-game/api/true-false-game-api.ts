import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import type {
	TrueFalseGameAnswerRequestDto,
	TrueFalseGameCheckResponseDto,
	TrueFalseGameLevelDto,
} from "../libs/types/types";

import { TrueFalseGameApiPath } from "../libs/enums/enums";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class TrueFalseGameApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GAMES, storage });
	}

	/**
	 * POST /games/{gameId}/levels/{levelId}/check
	 */
	public async checkAnswers(
		gameId: string,
		levelId: string,
		payload: TrueFalseGameAnswerRequestDto
	): Promise<TrueFalseGameCheckResponseDto> {
		const url = this.getFullEndpoint(
			TrueFalseGameApiPath.$GAME_ID,
			TrueFalseGameApiPath.LEVELS,
			TrueFalseGameApiPath.$LEVEL_ID,
			TrueFalseGameApiPath.CHECK,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});

		const data = await response.json<TrueFalseGameCheckResponseDto>();

		return data;
	}

	/**
	 * GET /games/{gameId}/levels/{levelId}
	 */
	public async getLevelById(gameId: string, levelId: string): Promise<TrueFalseGameLevelDto> {
		const url = this.getFullEndpoint(
			TrueFalseGameApiPath.$GAME_ID,
			TrueFalseGameApiPath.LEVELS,
			TrueFalseGameApiPath.$LEVEL_ID,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<TrueFalseGameLevelDto>();
	}
}

export { TrueFalseGameApi };
