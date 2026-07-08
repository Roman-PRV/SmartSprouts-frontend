import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import type {
	ArithmeticAttemptRequestDto,
	ArithmeticAttemptResponseDto,
	ArithmeticLevelDto,
} from "../libs/types/types";

import { ArithmeticApiPath } from "../libs/enums/enums";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

/**
 * Generic API for the whole arithmetic game family. The concrete game is
 * selected purely by `gameId` in the URL — multiplication, addition and any
 * future operation share these two endpoints.
 */
class ArithmeticGameApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GAMES, storage });
	}

	/**
	 * GET /games/{gameId}/levels/{levelId}
	 */
	public async getLevelById(gameId: string, levelId: string): Promise<ArithmeticLevelDto> {
		const url = this.getFullEndpoint(
			ArithmeticApiPath.$GAME_ID,
			ArithmeticApiPath.LEVELS,
			ArithmeticApiPath.$LEVEL_ID,
			{ gameId, levelId }
		);

		return await this.requestJson<ArithmeticLevelDto>(url, { method: HTTPMethod.GET });
	}

	/**
	 * POST /games/{gameId}/levels/{levelId}/attempts
	 */
	public async submitAttempt(
		gameId: string,
		levelId: string,
		payload: ArithmeticAttemptRequestDto
	): Promise<ArithmeticAttemptResponseDto> {
		const url = this.getFullEndpoint(
			ArithmeticApiPath.$GAME_ID,
			ArithmeticApiPath.LEVELS,
			ArithmeticApiPath.$LEVEL_ID,
			ArithmeticApiPath.ATTEMPTS,
			{ gameId, levelId }
		);

		return await this.requestJson<ArithmeticAttemptResponseDto>(url, {
			method: HTTPMethod.POST,
			payload,
		});
	}
}

export { ArithmeticGameApi };
