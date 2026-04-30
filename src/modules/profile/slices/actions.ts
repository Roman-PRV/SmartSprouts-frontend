import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { StorageKey } from "~/libs/modules/storage/storage";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type UpdatePasswordRequestDto,
	type UpdatePasswordResponseDto,
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

const updatePassword = createAsyncThunk<
	UpdatePasswordResponseDto,
	UpdatePasswordRequestDto,
	AsyncThunkConfig
>("profile/updatePassword", async (payload, { extra, rejectWithValue }) => {
	const { profileApi, storage } = extra;

	try {
		const response = await profileApi.updatePassword(payload);
		await storage.set(StorageKey.TOKEN, response.access_token);

		return response;
	} catch (error) {
		return rejectWithValue(normalizeError(error));
	}
});

export { fetchProfile, updatePassword };
