import { describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { StorageKey } from "~/libs/modules/storage/storage";
import { type ThunkErrorPayload } from "~/libs/types/types";
import { actions, login, register } from "~/modules/auth/auth";
import { reducer } from "~/modules/auth/slices/auth.slice";

describe("auth slice", () => {
	const initialState = {
		dataStatus: DataStatus.IDLE,
		error: null,
		isAuthenticated: false,
		user: null,
	};

	describe("reducer", () => {
		it("returns the initial state", () => {
			expect(reducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
		});

		it("handles login.pending action", () => {
			const action = { type: login.pending.type };
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.PENDING);
			expect(state.error).toBeNull();
		});

		it("handles login.fulfilled action", () => {
			const mockUser = { email: "test@example.com", id: 1, name: "Test User" };
			const action = {
				payload: { access_token: "fake-token", user: mockUser },
				type: login.fulfilled.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.FULFILLED);
			expect(state.isAuthenticated).toBe(true);
			expect(state.user).toEqual(mockUser);
			expect(state.error).toBeNull();
		});

		it("handles login.rejected action with payload message", () => {
			const errorMessage = "Invalid credentials";
			const action = {
				payload: { message: errorMessage } as ThunkErrorPayload,
				type: login.rejected.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.REJECTED);
			expect(state.error).toBe(errorMessage);
		});

		it("handles login.rejected action with default error message", () => {
			const action = {
				error: { message: "Network error" },
				type: login.rejected.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.REJECTED);
			expect(state.error).toBe("Network error");
		});

		it("handles register.pending action", () => {
			const action = { type: register.pending.type };
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.PENDING);
			expect(state.error).toBeNull();
		});

		it("handles register.fulfilled action", () => {
			const mockUser = { email: "test@example.com", id: 1, name: "Test User" };
			const action = {
				payload: { access_token: "fake-token", user: mockUser },
				type: register.fulfilled.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.FULFILLED);
			expect(state.isAuthenticated).toBe(true);
			expect(state.user).toEqual(mockUser);
			expect(state.error).toBeNull();
		});

		it("handles register.rejected action with payload message", () => {
			const errorMessage = "Email already exists";
			const action = {
				payload: { message: errorMessage } as ThunkErrorPayload,
				type: register.rejected.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.REJECTED);
			expect(state.error).toBe(errorMessage);
		});

		it("handles register.rejected action with default error message", () => {
			const action = {
				error: { message: "Network error" },
				type: register.rejected.type,
			};
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.REJECTED);
			expect(state.error).toBe("Network error");
		});

		it("handles clearError action", () => {
			const stateWithError = {
				...initialState,
				error: "Some error",
			};
			const action = { type: actions.clearError.type };
			const state = reducer(stateWithError, action);

			expect(state.error).toBeNull();
		});

		it("handles logout action", () => {
			const authenticatedState = {
				dataStatus: DataStatus.FULFILLED,
				error: "Some error",
				isAuthenticated: true,
				user: { email: "test@example.com", id: 1, name: "Test User" },
			};
			const action = { type: actions.logout.type };
			const state = reducer(authenticatedState, action);

			expect(state.isAuthenticated).toBe(false);
			expect(state.user).toBeNull();
			expect(state.error).toBeNull();
			expect(state.dataStatus).toBe(DataStatus.IDLE);
		});
	});

	describe("register thunk", () => {
		it("calls authApi.register and stores token in storage on success", async () => {
			const mockResponse = {
				access_token: "fake-token",
				user: { email: "test@example.com", id: 1, name: "Test User" },
			};
			const authApiMock = { register: vi.fn().mockResolvedValue(mockResponse) };
			const storageMock = { set: vi.fn().mockResolvedValue(undefined) };
			const dispatch = vi.fn();
			const getState = vi.fn();
			const extra = { authApi: authApiMock, storage: storageMock };

			const payload = {
				email: "test@example.com",
				name: "Test User",
				password: "password123",
				password_confirmation: "password123",
			};

			const thunk = register(payload);
			const result = await thunk(dispatch, getState, extra as any);

			expect(authApiMock.register).toHaveBeenCalledWith(payload);
			expect(storageMock.set).toHaveBeenCalledWith(StorageKey.TOKEN, mockResponse.access_token);
			expect(result.payload).toEqual(mockResponse);
		});

		it("returns rejected value on api error", async () => {
			const errorMessage = "API error";
			const authApiMock = { register: vi.fn().mockRejectedValue(new Error(errorMessage)) };
			const storageMock = { set: vi.fn() };
			const dispatch = vi.fn();
			const getState = vi.fn();
			const extra = { authApi: authApiMock, storage: storageMock };

			const payload = {
				email: "test@example.com",
				name: "Test User",
				password: "password123",
				password_confirmation: "password123",
			};

			const thunk = register(payload);
			const result = await thunk(dispatch, getState, extra as any);

			expect(result.meta.requestStatus).toBe("rejected");
			expect((result.payload as any).message).toBe(errorMessage);
		});
	});

	describe("login thunk", () => {
		it("calls authApi.login and stores token in storage on success", async () => {
			const mockResponse = {
				access_token: "fake-token",
				user: { email: "test@example.com", id: 1, name: "Test User" },
			};
			const authApiMock = { login: vi.fn().mockResolvedValue(mockResponse) };
			const storageMock = { set: vi.fn().mockResolvedValue(undefined) };
			const dispatch = vi.fn();
			const getState = vi.fn();
			const extra = { authApi: authApiMock, storage: storageMock };

			const payload = {
				email: "test@example.com",
				password: "password123",
			};

			const thunk = login(payload);
			const result = await thunk(dispatch, getState, extra as any);

			expect(authApiMock.login).toHaveBeenCalledWith(payload);
			expect(storageMock.set).toHaveBeenCalledWith(StorageKey.TOKEN, mockResponse.access_token);
			expect(result.payload).toEqual(mockResponse);
		});

		it("returns rejected value on api error", async () => {
			const errorMessage = "API error";
			const authApiMock = { login: vi.fn().mockRejectedValue(new Error(errorMessage)) };
			const storageMock = { set: vi.fn() };
			const dispatch = vi.fn();
			const getState = vi.fn();
			const extra = { authApi: authApiMock, storage: storageMock };

			const payload = {
				email: "test@example.com",
				password: "password123",
			};

			const thunk = login(payload);
			const result = await thunk(dispatch, getState, extra as any);

			expect(result.meta.requestStatus).toBe("rejected");
			expect((result.payload as any).message).toBe(errorMessage);
		});
	});
});
