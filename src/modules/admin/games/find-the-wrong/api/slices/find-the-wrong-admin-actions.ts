import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type CreateFindTheWrongAdminItemPayload,
	type FindTheWrongAdminItemDto,
	type FindTheWrongAdminLevelDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../../libs/types/types";
import { name as sliceName } from "./find-the-wrong-admin.slice";

type CreateItemArgument = {
	gameId: string;
	levelId: number;
	payload: CreateFindTheWrongAdminItemPayload;
};
type CreateLevelArgument = { formData: FormData; gameId: string };
type DeleteItemArgument = { gameId: string; itemId: number };
type DeleteLevelArgument = { gameId: string; levelId: number };
type GetLevelArgument = { gameId: string; levelId: number };
type UpdateItemArgument = {
	gameId: string;
	itemId: number;
	payload: UpdateFindTheWrongAdminItemPayload;
};
type UpdateLevelArgument = { formData: FormData; gameId: string; levelId: number };

const getLevelsList = createAsyncThunk<FindTheWrongAdminLevelDto[], string, AsyncThunkConfig>(
	`${sliceName}/get-levels-list`,
	async (gameId, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.getLevelsList({ gameId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const createLevel = createAsyncThunk<
	FindTheWrongAdminLevelDto,
	CreateLevelArgument,
	AsyncThunkConfig
>(`${sliceName}/create-level`, async ({ formData, gameId }, { extra, rejectWithValue, signal }) => {
	try {
		const { findTheWrongAdminApi } = extra;

		return await findTheWrongAdminApi.createLevel({ formData, gameId, signal });
	} catch (error: unknown) {
		return rejectWithValue(normalizeError(error));
	}
});

const deleteLevel = createAsyncThunk<number, DeleteLevelArgument, AsyncThunkConfig>(
	`${sliceName}/delete-level`,
	async ({ gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			await findTheWrongAdminApi.deleteLevel({ gameId, levelId, signal });

			return levelId;
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const getLevel = createAsyncThunk<FindTheWrongAdminLevelDto, GetLevelArgument, AsyncThunkConfig>(
	`${sliceName}/get-level`,
	async ({ gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.getLevel({ gameId, levelId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const updateLevel = createAsyncThunk<
	FindTheWrongAdminLevelDto,
	UpdateLevelArgument,
	AsyncThunkConfig
>(
	`${sliceName}/update-level`,
	async ({ formData, gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.updateLevel({ formData, gameId, levelId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const createItem = createAsyncThunk<FindTheWrongAdminItemDto, CreateItemArgument, AsyncThunkConfig>(
	`${sliceName}/create-item`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.createItem({ gameId, levelId, payload, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const updateItem = createAsyncThunk<FindTheWrongAdminItemDto, UpdateItemArgument, AsyncThunkConfig>(
	`${sliceName}/update-item`,
	async ({ gameId, itemId, payload }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.updateItem({ gameId, itemId, payload, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const deleteItem = createAsyncThunk<number, DeleteItemArgument, AsyncThunkConfig>(
	`${sliceName}/delete-item`,
	async ({ gameId, itemId }, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			await findTheWrongAdminApi.deleteItem({ gameId, itemId, signal });

			return itemId;
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export {
	createItem,
	createLevel,
	deleteItem,
	deleteLevel,
	getLevel,
	getLevelsList,
	updateItem,
	updateLevel,
};
