/**
 * @vitest-environment jsdom
 *
 * Thin-wrapper tests: full fetch-by-id logic is covered in
 * use-fetch-by-id.hook.spec. Here we only verify the wiring — getLevelsList as
 * the action, the level selectors, and the data→levels rename.
 */
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type LevelDescriptionDto, type ValueOf } from "~/libs/types/types";

const { mockDispatch, mockGetLevelsList, mockUseLanguageSync } = vi.hoisted(() => {
	const mockAbort = vi.fn();
	const mockDispatch = vi.fn(() => ({ abort: mockAbort }));
	const mockGetLevelsList = vi.fn((id: string) => ({ id, type: "games/get-levels" }));
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return { mockDispatch, mockGetLevelsList, mockUseLanguageSync };
});

vi.mock("~/modules/games/slices/actions", () => ({ getLevelsList: mockGetLevelsList }));

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
import { useLevelsFetch } from "~/libs/hooks/use-levels-fetch/use-levels-fetch.hook";

const mockUseAppSelector = vi.mocked(useAppSelector);

type GamesState = {
	currentGameLevels: LevelDescriptionDto[] | null;
	currentLevelsGameId: null | string;
	levelsStatus: ValueOf<typeof DataStatus>;
};

const LEVELS = [{ id: 10 }] as unknown as LevelDescriptionDto[];

const setMockState = (state: GamesState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector({ games: state } as unknown as Parameters<typeof selector>[0])
	);
};

describe("useLevelsFetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches levels via getLevelsList when uncached", () => {
		setMockState({
			currentGameLevels: null,
			currentLevelsGameId: null,
			levelsStatus: DataStatus.IDLE,
		});

		const { result } = renderHook(() => useLevelsFetch("5"));

		expect(mockGetLevelsList).toHaveBeenCalledWith("5");
		expect(result.current).toEqual({ hasError: false, isLoading: true, levels: null });
	});

	it("revalidates matched levels on mount while keeping them visible", () => {
		setMockState({
			currentGameLevels: LEVELS,
			currentLevelsGameId: "5",
			levelsStatus: DataStatus.FULFILLED,
		});

		const { result } = renderHook(() => useLevelsFetch("5"));

		// Cached levels carry mutable progress, so revisiting refetches in the
		// background without a loading flash.
		expect(mockGetLevelsList).toHaveBeenCalledWith("5");
		expect(result.current).toEqual({ hasError: false, isLoading: false, levels: LEVELS });
	});

	it("hides levels cached for a different id", () => {
		setMockState({
			currentGameLevels: LEVELS,
			currentLevelsGameId: "1",
			levelsStatus: DataStatus.FULFILLED,
		});

		const { result } = renderHook(() => useLevelsFetch("2"));

		expect(result.current.levels).toBeNull();
		expect(result.current.isLoading).toBe(true);
	});
});
