import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type FindTheWrongLevelDto,
	type SubmitAttemptPayload,
	type SubmitAttemptResponseDto,
} from "../../libs/types/types";
import { name as sliceName } from "./find-the-wrong-game.slice";

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
};

type SubmitAttemptThunkPayload = {
	gameId: string;
	levelId: string;
	payload: SubmitAttemptPayload;
};

const getLevelById = createAsyncThunk<FindTheWrongLevelDto, GetLevelByIdPayload, AsyncThunkConfig>(
	`${sliceName}/get-level-by-id`,
	async ({ gameId, levelId }, { extra, rejectWithValue }) => {
		try {
			const { findTheWrongGameApi } = extra;

			return await findTheWrongGameApi.getLevelById(gameId, levelId);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const submitAttempt = createAsyncThunk<
	SubmitAttemptResponseDto,
	SubmitAttemptThunkPayload,
	AsyncThunkConfig
>(
	`${sliceName}/submit-attempt`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue }) => {
		try {
			const { findTheWrongGameApi } = extra;

			return await findTheWrongGameApi.submitAttempt(gameId, levelId, payload);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { getLevelById, submitAttempt };
