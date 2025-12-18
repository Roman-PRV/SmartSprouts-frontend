import { createAsyncThunk } from "@reduxjs/toolkit";

import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import { type RegisterRequestDto, type RegisterResponseDto } from "../libs/types/types";

const register = createAsyncThunk<RegisterResponseDto, RegisterRequestDto, AsyncThunkConfig>(
	"auth/register",
	async (registerPayload, { extra, rejectWithValue }) => {
		const { authApi, storage } = extra;

		try {
			const response = await authApi.register(registerPayload);

			await storage.set(StorageKey.TOKEN, response.access_token);

			return response;
		} catch (error) {
			// Check if it's an HTTPError with validation errors
			if (error && typeof error === "object" && "errors" in error) {
				const httpError = error as { errors?: Record<string, string[]>; message: string };

				return rejectWithValue({
					errors: httpError.errors,
					message: httpError.message,
				});
			}

			throw error;
		}
	}
);

export { register };
