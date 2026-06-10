import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import { name as sliceName } from "./find-the-wrong-admin.slice";

type CreateLevelArgument = { formData: FormData; gameId: string };
type DeleteLevelArgument = { gameId: string; levelId: number };

const getLevelsList = createAsyncThunk<FindTheWrongAdminLevelDto[], string, AsyncThunkConfig>(
	`${sliceName}/get-levels-list`,
	async (gameId, { extra, rejectWithValue, signal }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.getLevelsList(gameId, signal);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const createLevel = createAsyncThunk<FindTheWrongAdminLevelDto, CreateLevelArgument, AsyncThunkConfig>(
	`${sliceName}/create-level`,
	async ({ formData, gameId }, { extra, rejectWithValue }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			return await findTheWrongAdminApi.createLevel(gameId, formData);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const deleteLevel = createAsyncThunk<number, DeleteLevelArgument, AsyncThunkConfig>(
	`${sliceName}/delete-level`,
	async ({ gameId, levelId }, { extra, rejectWithValue }) => {
		try {
			const { findTheWrongAdminApi } = extra;

			await findTheWrongAdminApi.deleteLevel(gameId, levelId);

			return levelId;
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { createLevel, deleteLevel, getLevelsList };
