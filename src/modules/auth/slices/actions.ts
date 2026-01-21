import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
	type User,
} from "../libs/types/types";

const getAuthenticatedUser = createAsyncThunk<User, undefined, AsyncThunkConfig>(
	"auth/getAuthenticatedUser",
	async (_payload, { extra, rejectWithValue }) => {
		const { authApi, storage } = extra;

		const hasToken = await storage.has(StorageKey.TOKEN);

		if (!hasToken) {
			return rejectWithValue({ message: "No token found" });
		}

		try {
			return await authApi.getAuthenticatedUser();
		} catch (error) {
			if (error instanceof HTTPError && error.status === HTTPCode.UNAUTHORIZED) {
				await storage.drop(StorageKey.TOKEN);
			}

			return rejectWithValue(normalizeError(error));
		}
	}
);

const login = createAsyncThunk<LoginResponseDto, LoginRequestDto, AsyncThunkConfig>(
	"auth/login",
	async (loginPayload, { extra, rejectWithValue }) => {
		const { authApi, storage } = extra;

		try {
			const response = await authApi.login(loginPayload);

			await storage.set(StorageKey.TOKEN, response.access_token);

			return response;
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const register = createAsyncThunk<RegisterResponseDto, RegisterRequestDto, AsyncThunkConfig>(
	"auth/register",
	async (registerPayload, { extra, rejectWithValue }) => {
		const { authApi, storage } = extra;

		try {
			const response = await authApi.register(registerPayload);

			await storage.set(StorageKey.TOKEN, response.access_token);

			return response;
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { getAuthenticatedUser, login, register };
