import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import { type TrueFalseImageLevelDto } from "../../libs/types/true-false-image-level-dto.type.js";
// import { name as sliceName } from "./true-false-image.slice.js";

type GetLevelByIdPayload = {
	gameId: string;
	levelId: string;
};

const sliceName = "true-false-image";

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

export { getLevelById };
