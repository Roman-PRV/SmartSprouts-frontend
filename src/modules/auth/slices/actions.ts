import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { StorageKey } from "~/libs/modules/storage/storage";
import { type AsyncThunkConfig } from "~/libs/types/types";

import {
	type AuthenticatedUserResponseDto,
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
} from "../libs/types/types";

/**
 * Dispatched when any authenticated request is rejected with 401. The store
 * treats it like logout (full state reset), so the client redirects to login.
 */
const sessionExpired = createAction("auth/sessionExpired");

/**
 * Records acceptance of the current legal-document versions.
 *
 * Lives in the auth module (it repairs the consent state the auth slice
 * owns) but calls the profile API — the endpoint is /profile/consents.
 */
const acceptConsents = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	"auth/acceptConsents",
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

/**
 * Fetches the currently authenticated user.
 *
 * Skips the request when no token is stored. A 401 (stale token) is handled
 * centrally by the API layer's unauthorized handler, which clears the token
 * and expires the session.
 */
const getAuthenticatedUser = createAsyncThunk<
	AuthenticatedUserResponseDto,
	undefined,
	AsyncThunkConfig
>(
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
		} catch {
			// Client-side logout should always succeed.
			// API errors (e.g., 401 or network issues) should not prevent
			// local session cleanup.
		} finally {
			await storage.drop(StorageKey.TOKEN);
		}

		return null;
	}
);

const fetchGoogleRedirectUrl = createAsyncThunk<string, undefined, AsyncThunkConfig>(
	"auth/fetchGoogleRedirectUrl",
	async (_payload, { extra, rejectWithValue }) => {
		const { authApi } = extra;

		try {
			const { url } = await authApi.getGoogleRedirectUrl();

			return url;
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const loginWithGoogle = createAsyncThunk<AuthenticatedUserResponseDto, string, AsyncThunkConfig>(
	"auth/loginWithGoogle",
	async (token, { extra, rejectWithValue }) => {
		const { authApi, storage } = extra;

		try {
			await storage.set(StorageKey.TOKEN, token);

			return await authApi.getAuthenticatedUser();
		} catch (error) {
			await storage.drop(StorageKey.TOKEN);

			return rejectWithValue(normalizeError(error));
		}
	}
);

export {
	acceptConsents,
	fetchGoogleRedirectUrl,
	getAuthenticatedUser,
	login,
	loginWithGoogle,
	logout,
	register,
	sessionExpired,
};
