import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type TrueFalseGameAnswerRequestDto,
	type TrueFalseGameAttemptResponseDto,
	type TrueFalseGameLevelDto,
} from "../../libs/types/types";
import { name as sliceName } from "./true-false-game.slice";

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
};

type SubmitAttemptThunkPayload = {
	gameId: string;
	levelId: string;
	payload: TrueFalseGameAnswerRequestDto;
};

const getLevelById = createAsyncThunk<TrueFalseGameLevelDto, GetLevelByIdPayload, AsyncThunkConfig>(
	`${sliceName}/get-level-by-id`,
	async ({ gameId, levelId }, { extra, rejectWithValue }) => {
		try {
			const { trueFalseGameApi } = extra;

			return await trueFalseGameApi.getLevelById(gameId, levelId);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const submitAttempt = createAsyncThunk<
	TrueFalseGameAttemptResponseDto,
	SubmitAttemptThunkPayload,
	AsyncThunkConfig
>(
	`${sliceName}/submit-attempt`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue }) => {
		try {
			const { trueFalseGameApi } = extra;

			return await trueFalseGameApi.submitAttempt(gameId, levelId, payload);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { getLevelById, submitAttempt };
