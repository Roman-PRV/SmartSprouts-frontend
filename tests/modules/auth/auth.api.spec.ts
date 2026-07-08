import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

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

const BASE_URL = "http://localhost:3000/api";
const EXPECT_HTTP_CALLS = 1;
const VALID_CREDENTIAL_VALUE = "password123";

type HttpCallArguments = [
	string,
	{
		credentials?: RequestCredentials;
		headers: Headers;
		method: string;
		payload: null | string;
	},
];
type HttpLoad = (...arguments_: HttpCallArguments) => Promise<Response>;

type HttpMock = { load: Mock<HttpLoad> };
type StorageMock = { get: ReturnType<typeof vi.fn> };

const makeResponse = <T,>(data: T): Response =>
	({
		json: () => Promise.resolve(data),
		ok: true,
		status: 200,
		statusText: "OK",
		text: () => Promise.resolve(JSON.stringify(data)),
	}) as unknown as Response;

describe("AuthApi.register", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = BASE_URL;

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns data on success", async () => {
		const payload: RegisterRequestDto = {
			email: "test@example.com",
			name: "Test User",
			password: VALID_CREDENTIAL_VALUE,
			password_confirmation: VALID_CREDENTIAL_VALUE,
		};

		const responseData: RegisterResponseDto = {
			access_token: "fake-token",
			user: {
				email: "test@example.com",
				id: 1,
				is_admin: false,
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
				headers: expect.any(Headers) as Headers,
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			})
		);

		const [, options] = http.load.mock.calls[0] as HttpCallArguments;
		expect(options.headers.get("content-type")).toBe(ContentType.JSON);

		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		const payload: RegisterRequestDto = {
			email: "test@example.com",
			name: "Test User",
			password: VALID_CREDENTIAL_VALUE,
			password_confirmation: VALID_CREDENTIAL_VALUE,
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
	const baseUrl = BASE_URL;

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns data on success", async () => {
		const payload: LoginRequestDto = {
			email: "test@example.com",
			password: VALID_CREDENTIAL_VALUE,
		};

		const responseData: LoginResponseDto = {
			access_token: "fake-token",
			user: {
				email: "test@example.com",
				id: 1,
				is_admin: false,
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
				headers: expect.any(Headers) as Headers,
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			})
		);

		const [, options] = http.load.mock.calls[0] as HttpCallArguments;
		expect(options.headers.get("content-type")).toBe(ContentType.JSON);
		expect(options.headers.get("authorization")).toBeNull();

		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		const payload: LoginRequestDto = {
			email: "test@example.com",
			password: VALID_CREDENTIAL_VALUE,
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
	const baseUrl = BASE_URL;

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request and returns user on success", async () => {
		const expectedUser: User = {
			email: "test@example.com",
			id: 1,
			is_admin: false,
			name: "Test User",
		};
		const responseData = { user: expectedUser };
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
				headers: expect.any(Headers) as Headers,
				method: HTTPMethod.GET,
				payload: null,
			})
		);

		const [, options] = http.load.mock.calls[0] as HttpCallArguments;
		expect(options.headers.get("authorization")).toBe(`Bearer ${token}`);

		expect(result).toEqual(expectedUser);
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

describe("AuthApi.getGoogleRedirectUrl", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = BASE_URL;

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends GET request with credentials include and returns url", async () => {
		const responseData = { url: "https://accounts.google.com/o/oauth2/auth?client_id=test" };
		http.load.mockResolvedValueOnce(makeResponse(responseData));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		const result = await api.getGoogleRedirectUrl();

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}${APIPath.AUTH}${AuthApiPath.GOOGLE_REDIRECT}`,
			expect.objectContaining({
				credentials: "include",
				method: HTTPMethod.GET,
				payload: null,
			})
		);
		expect(result).toEqual(responseData);
	});

	it("propagates error when request fails", async () => {
		http.load.mockRejectedValueOnce(new Error("Network error"));

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await expect(api.getGoogleRedirectUrl()).rejects.toThrow("Network error");
	});
});

describe("AuthApi.logout", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = BASE_URL;

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn() };
	});

	it("sends correct request", async () => {
		const token = "some-token";

		http.load.mockResolvedValueOnce(makeResponse(null));
		storage.get.mockResolvedValue(token);

		const api = new AuthApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await api.logout();

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}${APIPath.AUTH}${AuthApiPath.LOGOUT}`,
			expect.objectContaining({
				headers: expect.any(Headers) as Headers,
				method: HTTPMethod.POST,
				payload: null,
			})
		);

		const [, options] = http.load.mock.calls[0] as HttpCallArguments;
		expect(options.headers.get("authorization")).toBe(`Bearer ${token}`);
	});
});
