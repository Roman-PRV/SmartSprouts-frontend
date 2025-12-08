import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type TrueFalseGameAnswerRequestDto,
	type TrueFalseGameCheckResponseDto,
	type TrueFalseGameLevelDto,
} from "../../libs/types/types.js";
import { name as sliceName } from "./true-false-game.slice.js";

type CheckAnswersPayload = {
	gameId: string;
	levelId: string;
	payload: TrueFalseGameAnswerRequestDto;
};

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
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

const checkAnswers = createAsyncThunk<
	TrueFalseGameCheckResponseDto,
	CheckAnswersPayload,
	AsyncThunkConfig
>(
	`${sliceName}/check-answers`,
	async ({ gameId, levelId, payload }, { extra, rejectWithValue }) => {
		try {
			const { trueFalseGameApi } = extra;

			return await trueFalseGameApi.checkAnswers(gameId, levelId, payload);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { checkAnswers, getLevelById };
