import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
} from "../libs/types/types";

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

export { login, register };
