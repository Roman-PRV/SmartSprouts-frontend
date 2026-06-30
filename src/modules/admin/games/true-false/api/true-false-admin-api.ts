import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { AdminGameApiPath } from "~/modules/admin/libs/constants/admin-game-api-path.constant";

import { TrueFalseAdminApiPath } from "../libs/enums/enums";
import {
	type CreateTrueFalseStatementPayload,
	type RegenerateAudioPayload,
	type TrueFalseAdminLevelDto,
	type TrueFalseAdminStatementDto,
	type UpdateTrueFalseStatementPayload,
} from "../libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

type CreateStatementArguments = {
	gameId: string;
	levelId: number;
	payload: CreateTrueFalseStatementPayload;
	signal?: AbortSignal;
};

type RegenerateLevelAudioArguments = {
	gameId: string;
	levelId: number;
	payload: RegenerateAudioPayload;
	signal?: AbortSignal;
};

type RegenerateStatementAudioArguments = {
	gameId: string;
	payload: RegenerateAudioPayload;
	signal?: AbortSignal;
	statementId: number;
};

type UpdateLevelArguments = {
	formData: FormData;
	gameId: string;
	levelId: number;
	signal?: AbortSignal;
};

type UpdateStatementArguments = {
	gameId: string;
	payload: UpdateTrueFalseStatementPayload;
	signal?: AbortSignal;
	statementId: number;
};

/**
 * Admin API client for both true/false games. Levels go through the generic
 * admin/games/{gameId}/levels endpoints (the form differs per game but the URL
 * is shared); statements and audio regeneration use the dedicated paths.
 */
class TrueFalseAdminApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ADMIN, storage });
	}

	public async createLevel(
		gameId: string,
		formData: FormData,
		signal?: AbortSignal
	): Promise<TrueFalseAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: formData,
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminLevelDto>();
	}

	public async createStatement({
		gameId,
		levelId,
		payload,
		signal,
	}: CreateStatementArguments): Promise<TrueFalseAdminStatementDto> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.LEVEL_STATEMENTS, {
			gameId,
			levelId: String(levelId),
		});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminStatementDto>();
	}

	public async deleteLevel(gameId: string, levelId: number, signal?: AbortSignal): Promise<void> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.DELETE,
			...(signal && { signal }),
		});
	}

	public async deleteStatement(
		gameId: string,
		statementId: number,
		signal?: AbortSignal
	): Promise<void> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.STATEMENT_DETAIL, {
			gameId,
			statementId: String(statementId),
		});

		await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.DELETE,
			...(signal && { signal }),
		});
	}

	public async getLevel(
		gameId: string,
		levelId: number,
		signal?: AbortSignal
	): Promise<TrueFalseAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminLevelDto>();
	}

	public async getLevelsList(
		gameId: string,
		signal?: AbortSignal
	): Promise<TrueFalseAdminLevelDto[]> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminLevelDto[]>();
	}

	public async regenerateLevelAudio({
		gameId,
		levelId,
		payload,
		signal,
	}: RegenerateLevelAudioArguments): Promise<void> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.LEVEL_AUDIO_REGENERATE, {
			gameId,
			levelId: String(levelId),
		});

		await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
			...(signal && { signal }),
		});
	}

	public async regenerateStatementAudio({
		gameId,
		payload,
		signal,
		statementId,
	}: RegenerateStatementAudioArguments): Promise<void> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.STATEMENT_AUDIO_REGENERATE, {
			gameId,
			statementId: String(statementId),
		});

		await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
			...(signal && { signal }),
		});
	}

	public async updateLevel({
		formData,
		gameId,
		levelId,
		signal,
	}: UpdateLevelArguments): Promise<TrueFalseAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: formData,
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminLevelDto>();
	}

	public async updateStatement({
		gameId,
		payload,
		signal,
		statementId,
	}: UpdateStatementArguments): Promise<TrueFalseAdminStatementDto> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.STATEMENT_DETAIL, {
			gameId,
			statementId: String(statementId),
		});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.PATCH,
			payload: JSON.stringify(payload),
			...(signal && { signal }),
		});

		return await response.json<TrueFalseAdminStatementDto>();
	}
}

export { TrueFalseAdminApi };
