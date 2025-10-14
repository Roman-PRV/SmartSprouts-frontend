// tests/modules/games/games.api.spec.ts
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { type HTTP } from "~/libs/modules/http/http";
import { type Storage } from "~/libs/modules/storage/storage";
import { type GameDescriptionDto } from "~/libs/types/types";
import { GamesApi } from "~/modules/games/games.api";

const FAKE_TOKEN = "test-token";
const EXPECT_HTTP_CALLS = 1;

type HttpMock = { load: ReturnType<typeof vi.fn> };
type StorageMock = { get: ReturnType<typeof vi.fn>; set?: ReturnType<typeof vi.fn> };

const makeGame = (id: string): GameDescriptionDto =>
	({
		description: `Description ${id}`,
		id,
		imageUrl: `https://example.com/${id}.png`,
		title: `Game ${id}`,
	}) as unknown as GameDescriptionDto;

/**
 * Create a minimal mock of a Fetch-like Response used by BaseHTTPApi
 * @template T
 * @param {T} data The value returned by response.json()
 * @returns {Response} A minimal Response-compatible object with ok, status, json() and text()
 */
function makeResponse<T>(data: T): Response {
	return {
		json: () => Promise.resolve(data),
		ok: true,
		status: 200,
		statusText: "OK",
		text: () => Promise.resolve(JSON.stringify(data)),
	} as unknown as Response;
}

describe("GamesApi.getAll", () => {
	let http: HttpMock;
	let storage: StorageMock;
	const baseUrl = "http://localhost:3000/api";

	beforeEach(() => {
		http = { load: vi.fn() };
		storage = { get: vi.fn(), set: vi.fn() };

		// Minimal token mock so BaseHTTPApi.getHeaders can append Authorization header
		storage.get.mockResolvedValue(FAKE_TOKEN);
	});

	it("returns games from HTTP when http.load responds with OK", async () => {
		const games = [makeGame("1"), makeGame("2")];

		http.load.mockResolvedValueOnce(makeResponse(games));

		const api = new GamesApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		const result = await api.getAll();

		expect(http.load).toHaveBeenCalledTimes(EXPECT_HTTP_CALLS);
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}/games`,
			expect.objectContaining({ method: "GET" })
		);
		expect(result).toEqual(games);
	});

	it("propagates network/http errors from http.load", async () => {
		const error = new Error("network failed");

		http.load.mockRejectedValueOnce(error);

		const api = new GamesApi({
			baseUrl,
			http: http as unknown as HTTP,
			storage: storage as unknown as Storage,
		});

		await expect(api.getAll()).rejects.toThrow("network failed");
		expect(http.load).toHaveBeenCalledWith(
			`${baseUrl}/games`,
			expect.objectContaining({ method: "GET" })
		);
	});
});
