import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import type {
	TrueFalseImageAnswerRequestDto,
	TrueFalseImageCheckResponseDto,
	TrueFalseImageLevelDto,
} from "../libs/types/types";

import { TrueFalseImageApiPath } from "../libs/enums/enums";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class TrueFalseImageApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GAMES, storage });
	}

	/**
	 * POST /games/{gameId}/levels/{levelId}/check
	 */
	public async checkAnswers(
		gameId: string,
		levelId: string,
		payload: TrueFalseImageAnswerRequestDto
	): Promise<TrueFalseImageCheckResponseDto> {
		const url = this.getFullEndpoint(
			TrueFalseImageApiPath.$GAME_ID,
			TrueFalseImageApiPath.LEVELS,
			TrueFalseImageApiPath.$LEVEL_ID,
			TrueFalseImageApiPath.CHECK,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});

		const data = (await response.json()) as TrueFalseImageCheckResponseDto;

		return data;
	}

	/**
	 * GET /games/{gameId}/levels/{levelId}
	 */
	public async getLevelById(gameId: string, levelId: string): Promise<TrueFalseImageLevelDto> {
		const url = this.getFullEndpoint(
			TrueFalseImageApiPath.$GAME_ID,
			TrueFalseImageApiPath.LEVELS,
			TrueFalseImageApiPath.$LEVEL_ID,
			{ gameId, levelId }
		);

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.GET,
		});

		return await response.json<TrueFalseImageLevelDto>();
	}
}

export { TrueFalseImageApi };
