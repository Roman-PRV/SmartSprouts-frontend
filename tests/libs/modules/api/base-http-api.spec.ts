import { beforeEach, describe, expect, it, vi } from "vitest";

import { BaseHTTPApi } from "~/libs/modules/api/base-http-api";
import { HTTPHeader } from "~/libs/modules/http/libs/enums/http-header.enum";

const mockHttp = {
	load: vi.fn().mockResolvedValue({
		json: async () => ({}),
		ok: true,
	}),
};

const mockStorage = {
	get: vi.fn(),
};

vi.mock("~/libs/modules/localization/localization.js", () => ({
	getCurrentLocale: vi.fn(() => "mock-lang"),
}));

describe("BaseHTTPApi", () => {
	let api: BaseHTTPApi;

	beforeEach(() => {
		api = new BaseHTTPApi({
			baseUrl: "http://test.com",
			http: mockHttp as any,
			path: "/test",
			storage: mockStorage as any,
		});
		vi.clearAllMocks();
	});

	it("should include accept-language header in requests", async () => {
		await api.load("path", { hasAuth: false, method: "GET" });

		expect(mockHttp.load).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				headers: expect.any(Headers),
			}),
		);


		const callArgs = mockHttp.load.mock.calls[0];

		if (!callArgs) {
			throw new Error("Expected http.load to be called");
		}

		const options = callArgs[1];
		const headers = options.headers as Headers;

		expect(headers.get(HTTPHeader.ACCEPT_LANGUAGE)).toBe("mock-lang");
	});
});
