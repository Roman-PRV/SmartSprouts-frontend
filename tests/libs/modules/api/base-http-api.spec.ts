import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContentType } from "~/libs/enums/enums";
import { BaseHTTPApi, type RequestOptions } from "~/libs/modules/api/base-http-api";
import { setUnauthorizedHandler } from "~/libs/modules/api/unauthorized-handler";
import { type HTTP, HTTPCode } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { HTTPHeader } from "~/libs/modules/http/libs/enums/http-header.enum";
import { type Storage } from "~/libs/modules/storage/storage";

type LoadOptions = {
	credentials?: string;
	headers: Headers;
	method: string;
	payload: unknown;
	signal?: AbortSignal;
};

type MockResponse = {
	json: () => Promise<unknown>;
	ok: boolean;
	status?: number;
};

class TestApi extends BaseHTTPApi {
	public runJson<T>(path: string, options: RequestOptions): Promise<T> {
		return this.requestJson<T>(path, options);
	}

	public runVoid(path: string, options: RequestOptions): Promise<void> {
		return this.requestVoid(path, options);
	}
}

const mockHttp = {
	load: vi.fn<(path: string, options: LoadOptions) => Promise<MockResponse>>(() =>
		Promise.resolve({ json: () => Promise.resolve({}), ok: true })
	),
};

const mockStorage = {
	get: vi.fn(),
};

vi.mock("~/libs/modules/localization/helpers/get-current-locale.helper", () => ({
	getCurrentLocale: vi.fn(() => "mock-lang"),
}));

const createApi = (): TestApi =>
	new TestApi({
		baseUrl: "http://test.com",
		http: mockHttp as unknown as HTTP,
		path: "/test",
		storage: mockStorage as unknown as Storage,
	});

const getLoadOptions = (): LoadOptions => {
	const call = mockHttp.load.mock.calls[0];

	if (!call) {
		throw new Error("Expected http.load to be called");
	}

	return call[1];
};

describe("BaseHTTPApi", () => {
	let api: TestApi;

	beforeEach(() => {
		api = createApi();
		vi.clearAllMocks();
	});

	it("includes the accept-language header in requests", async () => {
		await api.load("path", { hasAuth: false, method: HTTPMethod.GET });

		expect(getLoadOptions().headers.get(HTTPHeader.ACCEPT_LANGUAGE)).toBe("mock-lang");
	});
});

describe("BaseHTTPApi request helpers", () => {
	let api: TestApi;

	beforeEach(() => {
		api = createApi();
		vi.clearAllMocks();
	});

	it("requestJson sends a JSON content-type + stringified payload and returns the parsed body", async () => {
		mockHttp.load.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1 }), ok: true });

		const result = await api.runJson("path", { method: HTTPMethod.POST, payload: { text: "hi" } });

		expect(result).toEqual({ id: 1 });

		const options = getLoadOptions();
		expect(options.method).toBe(HTTPMethod.POST);
		expect(options.payload).toBe(JSON.stringify({ text: "hi" }));
		expect(options.headers.get(HTTPHeader.CONTENT_TYPE)).toBe(ContentType.JSON);
	});

	it("requestJson without a payload sends no content-type and no body (GET)", async () => {
		await api.runJson("path", { method: HTTPMethod.GET });

		const options = getLoadOptions();
		expect(options.method).toBe(HTTPMethod.GET);
		expect(options.payload).toBeNull();
		expect(options.headers.get(HTTPHeader.CONTENT_TYPE)).toBeNull();
	});

	it("sends the authorization header with the stored token", async () => {
		mockStorage.get.mockResolvedValueOnce("mock-token");

		await api.runJson("path", { method: HTTPMethod.GET });

		expect(getLoadOptions().headers.get(HTTPHeader.AUTHORIZATION)).toBe("Bearer mock-token");
	});

	it("omits the authorization header when hasAuth is false", async () => {
		mockStorage.get.mockResolvedValueOnce("mock-token");

		await api.runJson("path", { hasAuth: false, method: HTTPMethod.GET });

		expect(getLoadOptions().headers.get(HTTPHeader.AUTHORIZATION)).toBeNull();
	});

	it("forwards credentials when provided", async () => {
		await api.runJson("path", { credentials: "include", method: HTTPMethod.GET });

		expect(getLoadOptions().credentials).toBe("include");
	});

	it("requestVoid issues the request without reading a response body", async () => {
		const jsonReader = vi.fn(() => Promise.resolve({}));
		mockHttp.load.mockResolvedValueOnce({ json: jsonReader, ok: true });

		await api.runVoid("path", { method: HTTPMethod.DELETE });

		expect(getLoadOptions().method).toBe(HTTPMethod.DELETE);
		expect(jsonReader).not.toHaveBeenCalled();
	});

	it("forwards the abort signal only when one is provided", async () => {
		const signal = new AbortController().signal;

		await api.runVoid("path", { method: HTTPMethod.DELETE, signal });
		expect(getLoadOptions().signal).toBe(signal);

		vi.clearAllMocks();

		await api.runVoid("path", { method: HTTPMethod.DELETE });
		expect(getLoadOptions()).not.toHaveProperty("signal");
	});
});

describe("BaseHTTPApi 401 handling", () => {
	let api: TestApi;

	beforeEach(() => {
		api = createApi();
		vi.clearAllMocks();
	});

	it("notifies the unauthorized handler on a 401 for an authenticated request", async () => {
		const onUnauthorized = vi.fn();
		setUnauthorizedHandler(onUnauthorized);
		mockHttp.load.mockResolvedValueOnce({
			json: () => Promise.resolve({ message: "Unauthorized" }),
			ok: false,
			status: HTTPCode.UNAUTHORIZED,
		});

		await expect(api.load("path", { hasAuth: true, method: HTTPMethod.GET })).rejects.toThrow();

		expect(onUnauthorized).toHaveBeenCalledTimes(1);
	});

	it("does not notify on a 401 for an unauthenticated request (e.g. bad login)", async () => {
		const onUnauthorized = vi.fn();
		setUnauthorizedHandler(onUnauthorized);
		mockHttp.load.mockResolvedValueOnce({
			json: () => Promise.resolve({ message: "Invalid credentials" }),
			ok: false,
			status: HTTPCode.UNAUTHORIZED,
		});

		await expect(api.load("path", { hasAuth: false, method: HTTPMethod.POST })).rejects.toThrow();

		expect(onUnauthorized).not.toHaveBeenCalled();
	});

	it("does not notify on a non-401 error for an authenticated request", async () => {
		const onUnauthorized = vi.fn();
		setUnauthorizedHandler(onUnauthorized);
		mockHttp.load.mockResolvedValueOnce({
			json: () => Promise.resolve({ message: "Server error" }),
			ok: false,
			status: HTTPCode.INTERNAL_SERVER_ERROR,
		});

		await expect(api.load("path", { hasAuth: true, method: HTTPMethod.GET })).rejects.toThrow();

		expect(onUnauthorized).not.toHaveBeenCalled();
	});
});
