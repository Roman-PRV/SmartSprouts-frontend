import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import { type TrueFalseImageAnswerRequestDto, type TrueFalseImageCheckResponseDto, type TrueFalseImageLevelDto } from "../../libs/types/types.js";
import { name as sliceName } from "./true-false-image.slice.js";

type CheckAnswersPayload = {
	gameId: string;
	levelId: string;
	payload: TrueFalseImageAnswerRequestDto;
};

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
};

const getLevelById = createAsyncThunk<
	TrueFalseImageLevelDto,
	GetLevelByIdPayload,
	AsyncThunkConfig
>(`${sliceName}/get-level-by-id`, async ({ gameId, levelId }, { extra, rejectWithValue }) => {
	try {
		const { trueFalseImageApi } = extra;

		return await trueFalseImageApi.getLevelById(gameId, levelId);
	} catch (error: unknown) {
		return rejectWithValue(normalizeError(error));
	}
});

const checkAnswers = createAsyncThunk<
	TrueFalseImageCheckResponseDto,
	CheckAnswersPayload,
	AsyncThunkConfig
>(`${sliceName}/check-answers`, async ({ gameId, levelId, payload }, { extra, rejectWithValue }) => {
	try {
		const { trueFalseImageApi } = extra;

		return await trueFalseImageApi.checkAnswers(gameId, levelId, payload);
	} catch (error: unknown) {
		return rejectWithValue(normalizeError(error));
	}
});

export { checkAnswers, getLevelById };
