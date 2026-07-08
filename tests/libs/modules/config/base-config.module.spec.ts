import { afterEach, describe, expect, it, vi } from "vitest";

import { BaseConfig } from "~/libs/modules/config/base-config.module";

const stubEnvironment = (overrides: Record<string, string>): void => {
	const defaults = {
		VITE_APP_API_ORIGIN_URL: "https://api.example.com",
		VITE_APP_NODE_ENV: "production",
		VITE_APP_PROXY_SERVER_URL: "https://proxy.example.com",
		...overrides,
	};

	for (const [key, value] of Object.entries(defaults)) {
		vi.stubEnv(key, value);
	}
};

describe("BaseConfig", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("parses a valid environment", () => {
		stubEnvironment({});

		const config = new BaseConfig();

		expect(config.ENV.API.ORIGIN_URL).toBe("https://api.example.com");
		expect(config.ENV.API.PROXY_SERVER_URL).toBe("https://proxy.example.com");
		expect(config.ENV.APP.ENVIRONMENT).toBe("production");
	});

	it("throws when a required variable is empty", () => {
		stubEnvironment({ VITE_APP_API_ORIGIN_URL: "" });

		expect(() => new BaseConfig()).toThrow(/Invalid environment configuration/);
	});

	it("throws when the environment value is not a known AppEnvironment", () => {
		stubEnvironment({ VITE_APP_NODE_ENV: "staging" });

		expect(() => new BaseConfig()).toThrow(/Invalid environment configuration/);
	});
});
