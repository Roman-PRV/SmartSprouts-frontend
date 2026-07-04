import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type CreateTrueFalseStatementPayload,
	type RegenerateAudioPayload,
	type TrueFalseAdminLevelDto,
	type TrueFalseAdminStatementDto,
	type UpdateTrueFalseStatementPayload,
} from "../../libs/types/types";
import { name as sliceName } from "./true-false-admin.slice";

type CreateLevelArgument = { formData: FormData; gameId: string };
type CreateStatementArgument = {
	gameId: string;
	levelId: number;
	payload: CreateTrueFalseStatementPayload;
};
type DeleteLevelArgument = { gameId: string; levelId: number };
type DeleteStatementArgument = { gameId: string; statementId: number };
type GetLevelArgument = { gameId: string; levelId: number };
type RegenerateLevelAudioArgument = {
	gameId: string;
	levelId: number;
	payload: RegenerateAudioPayload;
};
type RegenerateStatementAudioArgument = {
	gameId: string;
	payload: RegenerateAudioPayload;
	statementId: number;
};
type UpdateLevelArgument = { formData: FormData; gameId: string; levelId: number };
type UpdateStatementArgument = {
	gameId: string;
	payload: UpdateTrueFalseStatementPayload;
	statementId: number;
};

const getLevelsList = createAsyncThunk<TrueFalseAdminLevelDto[], string, AsyncThunkConfig>(
	`${sliceName}/get-levels-list`,
	async (gameId, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.getLevelsList({ gameId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const getLevel = createAsyncThunk<TrueFalseAdminLevelDto, GetLevelArgument, AsyncThunkConfig>(
	`${sliceName}/get-level`,
	async ({ gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.getLevel({ gameId, levelId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const createLevel = createAsyncThunk<TrueFalseAdminLevelDto, CreateLevelArgument, AsyncThunkConfig>(
	`${sliceName}/create-level`,
	async ({ formData, gameId }, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.createLevel({ formData, gameId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const updateLevel = createAsyncThunk<TrueFalseAdminLevelDto, UpdateLevelArgument, AsyncThunkConfig>(
	`${sliceName}/update-level`,
	async ({ formData, gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.updateLevel({ formData, gameId, levelId, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const deleteLevel = createAsyncThunk<number, DeleteLevelArgument, AsyncThunkConfig>(
	`${sliceName}/delete-level`,
	async ({ gameId, levelId }, { extra, rejectWithValue, signal }) => {
		try {
			await extra.trueFalseAdminApi.deleteLevel({ gameId, levelId, signal });

			return levelId;
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const createStatement = createAsyncThunk<
	TrueFalseAdminStatementDto,
	CreateStatementArgument,
	AsyncThunkConfig
>(
	`${sliceName}/create-statement`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.createStatement({ gameId, levelId, payload, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const updateStatement = createAsyncThunk<
	TrueFalseAdminStatementDto,
	UpdateStatementArgument,
	AsyncThunkConfig
>(
	`${sliceName}/update-statement`,
	async ({ gameId, payload, statementId }, { extra, rejectWithValue, signal }) => {
		try {
			return await extra.trueFalseAdminApi.updateStatement({
				gameId,
				payload,
				signal,
				statementId,
			});
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const deleteStatement = createAsyncThunk<number, DeleteStatementArgument, AsyncThunkConfig>(
	`${sliceName}/delete-statement`,
	async ({ gameId, statementId }, { extra, rejectWithValue, signal }) => {
		try {
			await extra.trueFalseAdminApi.deleteStatement({ gameId, signal, statementId });

			return statementId;
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

// Yields no payload: the fresh audio state comes from a follow-up getLevel, so
// the slice never reads a result from this thunk.
const regenerateLevelAudio = createAsyncThunk<
	undefined,
	RegenerateLevelAudioArgument,
	AsyncThunkConfig
>(
	`${sliceName}/regenerate-level-audio`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue, signal }) => {
		try {
			await extra.trueFalseAdminApi.regenerateLevelAudio({ gameId, levelId, payload, signal });
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

// Yields no payload for the same reason as regenerateLevelAudio above.
const regenerateStatementAudio = createAsyncThunk<
	undefined,
	RegenerateStatementAudioArgument,
	AsyncThunkConfig
>(
	`${sliceName}/regenerate-statement-audio`,
	async ({ gameId, payload, statementId }, { extra, rejectWithValue, signal }) => {
		try {
			await extra.trueFalseAdminApi.regenerateStatementAudio({
				gameId,
				payload,
				signal,
				statementId,
			});
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export {
	createLevel,
	createStatement,
	deleteLevel,
	deleteStatement,
	getLevel,
	getLevelsList,
	regenerateLevelAudio,
	regenerateStatementAudio,
	updateLevel,
	updateStatement,
};
