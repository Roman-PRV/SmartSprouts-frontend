import { APIPath, ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { AdminGameApiPath } from "~/modules/admin/libs/constants/admin-game-api-path.constant";

import { FindTheWrongAdminApiPath } from "../libs/enums/enums";
import {
	type CreateFindTheWrongAdminItemPayload,
	type FindTheWrongAdminItemDto,
	type FindTheWrongAdminLevelDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

type CreateItemArguments = {
	gameId: string;
	levelId: number;
	payload: CreateFindTheWrongAdminItemPayload;
	signal?: AbortSignal;
};

type UpdateItemArguments = {
	gameId: string;
	itemId: number;
	payload: UpdateFindTheWrongAdminItemPayload;
	signal?: AbortSignal;
};

type UpdateLevelArguments = {
	formData: FormData;
	gameId: string;
	levelId: number;
	signal?: AbortSignal;
};

class FindTheWrongAdminApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ADMIN, storage });
	}

	public async createItem({
		gameId,
		levelId,
		payload,
		signal,
	}: CreateItemArguments): Promise<FindTheWrongAdminItemDto> {
		const url = this.getFullEndpoint(FindTheWrongAdminApiPath.GAME_LEVEL_ITEMS, {
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

		return await response.json<FindTheWrongAdminItemDto>();
	}

	public async createLevel(
		gameId: string,
		formData: FormData,
		signal?: AbortSignal
	): Promise<FindTheWrongAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.POST,
			payload: formData,
			...(signal && { signal }),
		});

		return await response.json<FindTheWrongAdminLevelDto>();
	}

	public async deleteItem(gameId: string, itemId: number, signal?: AbortSignal): Promise<void> {
		const url = this.getFullEndpoint(FindTheWrongAdminApiPath.ITEM_DETAIL, {
			gameId,
			itemId: String(itemId),
		});

		await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.DELETE,
			...(signal && { signal }),
		});
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

	public async getLevel(
		gameId: string,
		levelId: number,
		signal?: AbortSignal
	): Promise<FindTheWrongAdminLevelDto> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVEL_DETAIL, {
			gameId,
			levelId: String(levelId),
		});

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			...(signal && { signal }),
		});

		return await response.json<FindTheWrongAdminLevelDto>();
	}

	public async getLevelsList(
		gameId: string,
		signal?: AbortSignal
	): Promise<FindTheWrongAdminLevelDto[]> {
		const url = this.getFullEndpoint(AdminGameApiPath.LEVELS, { gameId });

		const response = await this.load(url, {
			hasAuth: true,
			method: HTTPMethod.GET,
			...(signal && { signal }),
		});

		return await response.json<FindTheWrongAdminLevelDto[]>();
	}

	public async updateItem({
		gameId,
		itemId,
		payload,
		signal,
	}: UpdateItemArguments): Promise<FindTheWrongAdminItemDto> {
		const url = this.getFullEndpoint(FindTheWrongAdminApiPath.ITEM_DETAIL, {
			gameId,
			itemId: String(itemId),
		});

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: HTTPMethod.PATCH,
			payload: JSON.stringify(payload),
			...(signal && { signal }),
		});

		return await response.json<FindTheWrongAdminItemDto>();
	}

	public async updateLevel({
		formData,
		gameId,
		levelId,
		signal,
	}: UpdateLevelArguments): Promise<FindTheWrongAdminLevelDto> {
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

		return await response.json<FindTheWrongAdminLevelDto>();
	}
}

export { FindTheWrongAdminApi };
