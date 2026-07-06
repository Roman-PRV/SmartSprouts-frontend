import { APIPath } from "~/libs/enums/enums";
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

type CreateLevelArguments = {
	formData: FormData;
	gameId: string;
	signal?: AbortSignal;
};

type CreateStatementArguments = {
	gameId: string;
	levelId: number;
	payload: CreateTrueFalseStatementPayload;
	signal?: AbortSignal;
};

type DeleteLevelArguments = {
	gameId: string;
	levelId: number;
	signal?: AbortSignal;
};

type DeleteStatementArguments = {
	gameId: string;
	signal?: AbortSignal;
	statementId: number;
};

type GetLevelArguments = {
	gameId: string;
	levelId: number;
	signal?: AbortSignal;
};

type GetLevelsListArguments = {
	gameId: string;
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

	public async createLevel({
		formData,
		gameId,
		signal,
	}: CreateLevelArguments): Promise<TrueFalseAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		return await this.requestFormData<TrueFalseAdminLevelDto>(url, {
			formData,
			method: HTTPMethod.POST,
			signal,
		});
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

		return await this.requestJson<TrueFalseAdminStatementDto>(url, {
			method: HTTPMethod.POST,
			payload,
			signal,
		});
	}

	public async deleteLevel({ gameId, levelId, signal }: DeleteLevelArguments): Promise<void> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		await this.requestVoid(url, { method: HTTPMethod.DELETE, signal });
	}

	public async deleteStatement({
		gameId,
		signal,
		statementId,
	}: DeleteStatementArguments): Promise<void> {
		const url = this.getFullEndpoint(TrueFalseAdminApiPath.STATEMENT_DETAIL, {
			gameId,
			statementId: String(statementId),
		});

		await this.requestVoid(url, { method: HTTPMethod.DELETE, signal });
	}

	public async getLevel({
		gameId,
		levelId,
		signal,
	}: GetLevelArguments): Promise<TrueFalseAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		return await this.requestJson<TrueFalseAdminLevelDto>(url, { method: HTTPMethod.GET, signal });
	}

	public async getLevelsList({
		gameId,
		signal,
	}: GetLevelsListArguments): Promise<TrueFalseAdminLevelDto[]> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		return await this.requestJson<TrueFalseAdminLevelDto[]>(url, {
			method: HTTPMethod.GET,
			signal,
		});
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

		await this.requestVoid(url, { method: HTTPMethod.POST, payload, signal });
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

		await this.requestVoid(url, { method: HTTPMethod.POST, payload, signal });
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

		return await this.requestFormData<TrueFalseAdminLevelDto>(url, {
			formData,
			method: HTTPMethod.POST,
			signal,
		});
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

		return await this.requestJson<TrueFalseAdminStatementDto>(url, {
			method: HTTPMethod.PATCH,
			payload,
			signal,
		});
	}
}

export { TrueFalseAdminApi };
