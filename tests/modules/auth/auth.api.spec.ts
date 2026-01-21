import { beforeEach, describe, expect, it, vi } from "vitest";

import { APIPath, ContentType } from "~/libs/enums/enums";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";
import { AuthApi } from "~/modules/auth/auth.api";
import { AuthApiPath } from "~/modules/auth/libs/enums/enums";
import {
	type LoginRequestDto,
	type LoginResponseDto,
	type RegisterRequestDto,
	type RegisterResponseDto,
	type User,
} from "~/modules/auth/libs/types/types";

const EXPECT_HTTP_CALLS = 1;

type HttpMock = { load: ReturnType<typeof vi.fn> };
type StorageMock = { get: ReturnType<typeof vi.fn> };

function makeResponse<T>(data: T, ok = true, status = 200): Response {
	return {
		json: () => Promise.resolve(data),
		ok,
		status,
		statusText: ok ? "OK" : "Bad Request",
		text: () => Promise.resolve(JSON.stringify(data)),
	} as unknown as Response;
}

describe("AuthApi.register", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = "http://localhost:3000/api";

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns data on success", async () => {
		const payload: RegisterRequestDto = {
			email: "test@example.com",
			name: "Test User",
			password: "password123",
			password_confirmation: "password123",
		};

		const responseData: RegisterResponseDto = {
			access_token: "fake-token",
			user: {
				email: "test@example.com",
				id: 1,
				name: "Test User",
			},
		};

		http.load.mockResolvedValueOnce(makeResponse(responseData));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		const result = await api.register(payload);

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}${APIPath.AUTH}${AuthApiPath.REGISTER}`,
			expect.objectContaining({
				headers: expect.any(Headers),
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			})
		);

		const firstCallArguments = http.load.mock.calls[0];
		const [_, options] = firstCallArguments as [
			string,
			{ headers: Headers; method: string; payload: string },
		];
		expect(options.headers.get("content-type")).toBe(ContentType.JSON);

		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		const payload: RegisterRequestDto = {
			email: "test@example.com",
			name: "Test User",
			password: "password123",
			password_confirmation: "password123",
		};

		const errorMessage = "Invalid data";
		http.load.mockRejectedValueOnce(new Error(errorMessage));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await expect(api.register(payload)).rejects.toThrow(errorMessage);
	});
});

describe("AuthApi.login", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = "http://localhost:3000/api";

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns data on success", async () => {
		const payload: LoginRequestDto = {
			email: "test@example.com",
			password: "password123",
		};

		const responseData: LoginResponseDto = {
			access_token: "fake-token",
			user: {
				email: "test@example.com",
				id: 1,
				name: "Test User",
			},
		};

		http.load.mockResolvedValueOnce(makeResponse(responseData));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		const result = await api.login(payload);

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}${APIPath.AUTH}${AuthApiPath.LOGIN}`,
			expect.objectContaining({
				headers: expect.any(Headers),
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			})
		);

		const firstCallArguments = http.load.mock.calls[0];
		const [_, options] = firstCallArguments as [
			string,
			{ headers: Headers; method: string; payload: string },
		];
		expect(options.headers.get("content-type")).toBe(ContentType.JSON);

		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		const payload: LoginRequestDto = {
			email: "test@example.com",
			password: "password123",
		};

		const errorMessage = "Invalid credentials";
		http.load.mockRejectedValueOnce(new Error(errorMessage));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await expect(api.login(payload)).rejects.toThrow(errorMessage);
	});
});

describe("AuthApi.getAuthenticatedUser", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = "http://localhost:3000/api";

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns user on success", async () => {
		const responseData: User = {
			email: "test@example.com",
			id: 1,
			name: "Test User",
		};
		const token = "some-token";

		http.load.mockResolvedValueOnce(makeResponse(responseData));
		storage.get.mockResolvedValue(token);

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		const result = await api.getAuthenticatedUser();

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			expect.objectContaining({
				headers: expect.any(Headers),
				method: HTTPMethod.GET,
				payload: null,
			})
		);

		const firstCallArguments = http.load.mock.calls[0];
		const [_, options] = firstCallArguments as [
			string,
			{ headers: Headers; method: string; payload: string },
		];
		expect(options.headers.get("authorization")).toBe(`Bearer ${token}`);

		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		const errorMessage = "Unauthorized";
		http.load.mockRejectedValueOnce(new Error(errorMessage));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await expect(api.getAuthenticatedUser()).rejects.toThrow(errorMessage);
	});
});
