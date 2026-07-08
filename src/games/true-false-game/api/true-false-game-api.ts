import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import type {
	TrueFalseGameAnswerRequestDto,
	TrueFalseGameAttemptResponseDto,
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
	 * GET /games/{gameId}/levels/{levelId}
	 */
	public async getLevelById(gameId: string, levelId: string): Promise<TrueFalseGameLevelDto> {
		const url = this.getFullEndpoint(
			TrueFalseGameApiPath.$GAME_ID,
			TrueFalseGameApiPath.LEVELS,
			TrueFalseGameApiPath.$LEVEL_ID,
			{ gameId, levelId }
		);

		return await this.requestJson<TrueFalseGameLevelDto>(url, { method: HTTPMethod.GET });
	}

	/**
	 * POST /games/{gameId}/levels/{levelId}/attempts
	 */
	public async submitAttempt(
		gameId: string,
		levelId: string,
		payload: TrueFalseGameAnswerRequestDto
	): Promise<TrueFalseGameAttemptResponseDto> {
		const url = this.getFullEndpoint(
			TrueFalseGameApiPath.$GAME_ID,
			TrueFalseGameApiPath.LEVELS,
			TrueFalseGameApiPath.$LEVEL_ID,
			TrueFalseGameApiPath.ATTEMPTS,
			{ gameId, levelId }
		);

		return await this.requestJson<TrueFalseGameAttemptResponseDto>(url, {
			method: HTTPMethod.POST,
			payload,
		});
	}
}

export { TrueFalseGameApi };
