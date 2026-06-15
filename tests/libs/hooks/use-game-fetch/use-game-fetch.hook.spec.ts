/**
 * @vitest-environment jsdom
 *
 * Thin-wrapper tests: full fetch-by-id logic (abort, undefined id, refetch) is
 * covered in use-fetch-by-id.hook.spec. Here we only verify the wiring —
 * getById as the action, the game selectors, and the data→currentGame rename.
 */
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type GameDescriptionDto, type ValueOf } from "~/libs/types/types";

const { mockDispatch, mockGetById, mockUseLanguageSync } = vi.hoisted(() => {
	const mockAbort = vi.fn();
	const mockDispatch = vi.fn(() => ({ abort: mockAbort }));
	const mockGetById = vi.fn((id: string) => ({ id, type: "games/get-by-id" }));
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return { mockDispatch, mockGetById, mockUseLanguageSync };
});

vi.mock("~/modules/games/slices/actions", () => ({ getById: mockGetById }));

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: (): typeof mockDispatch => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/libs/hooks/use-language-sync/use-language-sync.hook", () => ({
	useLanguageSync: mockUseLanguageSync,
}));

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useGameFetch } from "~/libs/hooks/use-game-fetch/use-game-fetch.hook";

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

describe("useGameFetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches the game via getById when uncached", () => {
		setMockState({ currentGame: null, currentGameStatus: DataStatus.IDLE });

		const { result } = renderHook(() => useGameFetch("5"));

		expect(mockGetById).toHaveBeenCalledWith("5");
		expect(result.current).toEqual({ currentGame: null, isLoading: true });
	});

	it("returns the matched game without refetching", () => {
		setMockState({ currentGame: makeGame("5"), currentGameStatus: DataStatus.FULFILLED });

		const { result } = renderHook(() => useGameFetch("5"));

		expect(mockGetById).not.toHaveBeenCalled();
		expect(result.current).toEqual({ currentGame: makeGame("5"), isLoading: false });
	});

	it("hides a game cached for a different id", () => {
		setMockState({ currentGame: makeGame("1"), currentGameStatus: DataStatus.FULFILLED });

		const { result } = renderHook(() => useGameFetch("2"));

		expect(result.current.currentGame).toBeNull();
		expect(result.current.isLoading).toBe(true);
	});
});
