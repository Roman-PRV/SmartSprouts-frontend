import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http";
import { StorageKey } from "~/libs/modules/storage/storage";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
	type User,
} from "../libs/types/types";

/**
 * Fetches the currently authenticated user.
 *
 * This thunk checks for the existence of an authentication token in storage before attempting the request.
 * If the request fails with a 401 Unauthorized error, the token is automatically removed from storage.
 */
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

const logout = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	"auth/logout",
	async (_payload, { extra }) => {
		const { authApi, storage } = extra;

		try {
			await authApi.logout();
		} finally {
			await storage.drop(StorageKey.TOKEN);
		}

		return null;
	}
);

export { getAuthenticatedUser, login, logout, register };
