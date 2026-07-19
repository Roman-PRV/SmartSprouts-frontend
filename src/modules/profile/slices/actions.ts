import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { StorageKey } from "~/libs/modules/storage/storage";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type DeleteAccountWithCodeRequestDto,
	type DeleteAccountWithPasswordRequestDto,
	type UpdatePasswordRequestDto,
	type UpdatePasswordResponseDto,
	type UserProfileDto,
} from "../libs/types/types";

const acceptConsents = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	"profile/acceptConsents",
	async (_payload, { extra, rejectWithValue }) => {
		const { profileApi } = extra;

		try {
			await profileApi.acceptConsents();

			return null;
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const deleteAccountWithCode = createAsyncThunk<
	null,
	DeleteAccountWithCodeRequestDto,
	AsyncThunkConfig
>("profile/deleteAccountWithCode", async (payload, { extra, rejectWithValue }) => {
	const { profileApi } = extra;

	try {
		await profileApi.deleteAccount(payload);

		return null;
	} catch (error) {
		return rejectWithValue(normalizeError(error));
	}
});

const deleteAccountWithPassword = createAsyncThunk<
	null,
	DeleteAccountWithPasswordRequestDto,
	AsyncThunkConfig
>("profile/deleteAccountWithPassword", async (payload, { extra, rejectWithValue }) => {
	const { profileApi } = extra;

	try {
		await profileApi.deleteAccount(payload);

		return null;
	} catch (error) {
		return rejectWithValue(normalizeError(error));
	}
});

const requestDeletionCode = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	"profile/requestDeletionCode",
	async (_payload, { extra, rejectWithValue }) => {
		const { profileApi } = extra;

		try {
			await profileApi.requestDeletionCode();

			return null;
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

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

export {
	acceptConsents,
	deleteAccountWithCode,
	deleteAccountWithPassword,
	fetchProfile,
	requestDeletionCode,
	updatePassword,
};
