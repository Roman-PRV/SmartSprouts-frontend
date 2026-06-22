import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type ArithmeticAttemptRequestDto,
	type ArithmeticAttemptResponseDto,
	type ArithmeticLevelDto,
} from "../../libs/types/types";
import { name as sliceName } from "./arithmetic-game.slice";

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
};

type SubmitAttemptThunkPayload = {
	gameId: string;
	levelId: string;
	payload: ArithmeticAttemptRequestDto;
};

const getLevelById = createAsyncThunk<ArithmeticLevelDto, GetLevelByIdPayload, AsyncThunkConfig>(
	`${sliceName}/get-level-by-id`,
	async ({ gameId, levelId }, { extra, rejectWithValue }) => {
		try {
			const { arithmeticGameApi } = extra;

			return await arithmeticGameApi.getLevelById(gameId, levelId);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const submitAttempt = createAsyncThunk<
	ArithmeticAttemptResponseDto,
	SubmitAttemptThunkPayload,
	AsyncThunkConfig
>(
	`${sliceName}/submit-attempt`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue }) => {
		try {
			const { arithmeticGameApi } = extra;

			return await arithmeticGameApi.submitAttempt(gameId, levelId, payload);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { getLevelById, submitAttempt };
