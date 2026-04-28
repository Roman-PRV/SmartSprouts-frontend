import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type UpdatePasswordRequestDto,
	type UserProfileDto,
} from "../libs/types/types";

const fetchProfile = createAsyncThunk<UserProfileDto, undefined, AsyncThunkConfig>(
	"profile/fetchProfile",
	async (_payload, { extra, rejectWithValue }) => {
		const { profileApi } = extra;

		try {
			return await profileApi.getProfile();
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const updatePassword = createAsyncThunk<undefined, UpdatePasswordRequestDto, AsyncThunkConfig>(
	"profile/updatePassword",
	async (payload, { extra, rejectWithValue }) => {
		const { profileApi } = extra;

		try {
			await profileApi.updatePassword(payload);
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { fetchProfile, updatePassword };
