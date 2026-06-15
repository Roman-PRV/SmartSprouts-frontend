/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type GameDescriptionDto, type ValueOf } from "~/libs/types/types";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockDispatch, mockGetById, mockUseLanguageSync } = vi.hoisted(() => {
	const mockGetById = vi.fn((id: string) => ({ payload: id, type: "games/get-by-id" }));
	const mockDispatch = vi.fn();
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return { mockDispatch, mockGetById, mockUseLanguageSync };
});

vi.mock("~/modules/games/slices/games", () => ({
	actions: { getById: mockGetById },
}));

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: (): typeof mockDispatch => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/libs/hooks/use-language-sync/use-language-sync.hook", () => ({
	useLanguageSync: mockUseLanguageSync,
}));

// ─── Imports (after vi.mock calls) ───────────────────────────────────────────

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useGameFetch } from "~/libs/hooks/use-game-fetch/use-game-fetch.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);

type GamesState = {
	currentGame: GameDescriptionDto | null;
	currentGameStatus: ValueOf<typeof DataStatus>;
};

const makeGame = (id: string): GameDescriptionDto => ({
	description: "A game",
	icon_url: "/icon.svg",
	id,
	key: "find_the_wrong" as GameDescriptionDto["key"],
	title: "Game",
});

const setMockState = (state: GamesState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector({ games: state } as unknown as Parameters<typeof selector>[0])
	);
};

const renderGameFetch = (id: string | undefined) =>
	renderHook((current: string | undefined) => useGameFetch(current), { initialProps: id });

describe("useGameFetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches on mount when no game is cached", () => {
		setMockState({ currentGame: null, currentGameStatus: DataStatus.IDLE });

		const { result } = renderGameFetch("1");

		expect(mockGetById).toHaveBeenCalledWith("1");
		expect(result.current.isLoading).toBe(true);
		expect(result.current.currentGame).toBeNull();
	});

	it("does not refetch when the cached game already matches the id", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		const { result } = renderGameFetch("1");

		expect(mockGetById).not.toHaveBeenCalled();
		expect(result.current.isLoading).toBe(false);
		expect(result.current.currentGame).toEqual(makeGame("1"));
	});

	it("does not dispatch again on rerender with the same id", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		const { rerender } = renderGameFetch("1");
		rerender("1");

		expect(mockGetById).not.toHaveBeenCalled();
	});

	it("refetches when the id changes to a game that is not cached", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		const { rerender } = renderGameFetch("1");
		rerender("2");

		expect(mockGetById).toHaveBeenCalledWith("2");
	});

	it("treats a cached game from a different id as loading (no stale data exposed)", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		const { result } = renderGameFetch("2");

		expect(result.current.currentGame).toBeNull();
		expect(result.current.isLoading).toBe(true);
	});

	it("stops loading on rejection so the consumer can show not-found", () => {
		setMockState({ currentGame: null, currentGameStatus: DataStatus.REJECTED });

		const { result } = renderGameFetch("1");

		expect(result.current.currentGame).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	it("registers a language-sync callback that refetches the game", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		let capturedCallback: (() => void) | undefined;
		mockUseLanguageSync.mockImplementation((callback: () => void) => {
			capturedCallback = callback;
		});

		renderGameFetch("1");

		expect(capturedCallback).toBeDefined();

		act(() => {
			capturedCallback?.();
		});

		expect(mockGetById).toHaveBeenCalledWith("1");
	});
});
